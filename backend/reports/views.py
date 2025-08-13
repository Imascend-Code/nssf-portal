# reports/views.py
from datetime import timedelta
from collections import OrderedDict
from django.utils import timezone
from django.db.models import Count, Avg, DurationField, ExpressionWrapper, F, Sum
from django.db.models.functions import TruncMonth
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from services.models import ServiceRequest
from payments.models import Payment

def _first_day_of_month(dt):
    return dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def summary(request):
    # Admin-only guard
    user = request.user
    if getattr(user, "role", None) != "ADMIN":
        return Response({"detail": "Admin access required."}, status=403)

    now = timezone.now()
    start_12 = _first_day_of_month(now) - timedelta(days=365)

    # ---- Payments: totals by month (last 12) + by status
    pays_qs = Payment.objects.filter(period_start__gte=start_12)

    by_month_qs = (
        pays_qs
        .annotate(month=TruncMonth("period_start"))
        .values("month")
        .annotate(total=Sum("amount"))
        .order_by("month")
    )
    payments_by_month = OrderedDict(
        (row["month"].strftime("%Y-%m"), float(row["total"] or 0)) for row in by_month_qs
    )

    payments_by_status = list(
        pays_qs.values("status").annotate(total=Sum("amount"), count=Count("id")).order_by("status")
    )

    # ---- Requests: by status + by category (top categories)
    reqs = ServiceRequest.objects.all()

    requests_by_status = list(
        reqs.values("status").annotate(count=Count("id")).order_by("status")
    )
    requests_by_category = list(
        reqs.values("category__name").annotate(count=Count("id")).order_by("-count")
    )

    # ---- Average resolution time (last 30 days) in days (float)
    recent = reqs.filter(resolved_at__isnull=False, resolved_at__gte=now - timedelta(days=30))
    avg_expr = ExpressionWrapper(F("resolved_at") - F("created_at"), output_field=DurationField())
    avg_delta = recent.aggregate(avg=Avg(avg_expr))["avg"]
    avg_resolution_days_30 = (avg_delta.total_seconds() / 86400.0) if avg_delta else None

    return Response({
        "payments_by_month": payments_by_month,
        "payments_by_status": payments_by_status,
        "requests_by_status": requests_by_status,
        "requests_by_category": requests_by_category,
        "avg_resolution_days_30": avg_resolution_days_30,
        "as_of": now.isoformat(),
    })
