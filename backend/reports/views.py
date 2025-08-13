# reports/views.py
from __future__ import annotations
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List, Tuple

from collections import OrderedDict
from django.utils import timezone
from django.db.models import Count, Avg, DurationField, ExpressionWrapper, F, Sum
from django.db.models.functions import TruncMonth

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from services.models import ServiceRequest
from payments.models import Payment


def _first_day_of_month(dt: datetime) -> datetime:
    return dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


def _last_12_month_bins(now: datetime) -> List[datetime]:
    """
    Return a list of the first day of each of the last 12 months (ascending).
    """
    start = _first_day_of_month(now)
    months = []
    y, m = start.year, start.month
    for _ in range(12):
        months.append(datetime(y, m, 1, tzinfo=now.tzinfo))
        # bump forward
        if m == 12:
            y, m = y + 1, 1
        else:
            m += 1
    # We constructed from this month forward; shift back 12 months:
    # Easiest is to start 11 months ago till now:
    now_first = _first_day_of_month(now)
    out = []
    yy, mm = now_first.year, now_first.month
    for i in range(12):
        # go back 11..0 months
        back = 11 - i
        y2 = yy
        m2 = mm - back
        while m2 <= 0:
            m2 += 12
            y2 -= 1
        out.append(datetime(y2, m2, 1, tzinfo=now.tzinfo))
    out.sort()
    return out


def _decimal_to_float(val) -> float:
    if val is None:
        return 0.0
    if isinstance(val, Decimal):
        return float(val)
    return float(val)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])  # <-- staff OR superuser allowed
def summary(request):
    """
    Admin-only operational summary.
    - payments_by_month: last 12 months (YYYY-MM) with totals (0 where no data)
    - payments_by_status: [{status, total, count}]
    - requests_by_status: [{status, count}]
    - requests_by_category: top categories by count
    - avg_resolution_days_30: float days over last 30d
    - as_of: ISO timestamp
    """
    try:
        now = timezone.now()
        firsts = _last_12_month_bins(now)
        start_12 = firsts[0]

        # --- Payments
        pays_qs = Payment.objects.filter(period_start__gte=start_12)

        # Monthly totals (ensure every bucket appears)
        by_month_qs = (
            pays_qs
            .annotate(month=TruncMonth("period_start"))
            .values("month")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )
        mapped = {row["month"].date(): _decimal_to_float(row["total"]) for row in by_month_qs}

        payments_by_month = OrderedDict()
        for dt in firsts:
            key = dt.strftime("%Y-%m")
            payments_by_month[key] = _decimal_to_float(mapped.get(dt.date(), 0))

        payments_by_status = list(
            pays_qs.values("status")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("status")
        )
        # cast Decimal -> float for totals
        for row in payments_by_status:
            row["total"] = _decimal_to_float(row.get("total"))

        # --- Requests
        reqs = ServiceRequest.objects.all()

        requests_by_status = list(
            reqs.values("status").annotate(count=Count("id")).order_by("status")
        )

        requests_by_category = list(
            reqs.values(name=F("category__name")).annotate(count=Count("id")).order_by("-count")
        )
        # Optionally cap top categories for UI:
        requests_by_category = requests_by_category[:12]

        # --- Average resolution time (last 30 days) in days
        recent = reqs.filter(resolved_at__isnull=False, resolved_at__gte=now - timedelta(days=30))
        avg_expr = ExpressionWrapper(F("resolved_at") - F("created_at"), output_field=DurationField())
        avg_delta = recent.aggregate(avg=Avg(avg_expr))["avg"]
        avg_resolution_days_30 = (avg_delta.total_seconds() / 86400.0) if avg_delta else None

        return Response(
            {
                "payments_by_month": payments_by_month,
                "payments_by_status": payments_by_status,
                "requests_by_status": requests_by_status,
                "requests_by_category": requests_by_category,
                "avg_resolution_days_30": avg_resolution_days_30,
                "as_of": now.isoformat(),
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        # In production you'd log the exception
        return Response({"detail": "Failed to compute summary."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
