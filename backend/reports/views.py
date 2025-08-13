# reports/views.py
from __future__ import annotations

from collections import OrderedDict
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Sum, Avg, DurationField, ExpressionWrapper, F
from django.db.models.functions import TruncMonth

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.http import FileResponse, Http404

from .models import Report
from .serializers import ReportSerializer, ReportCreateSerializer
from .permissions import IsOwnerOrAdmin
from .utils import generate_report

# Optional domain models (don’t crash if app not installed)
try:
    from payments.models import Payment
except Exception:  # app might not be ready in some envs
    Payment = None

try:
    from services.models import ServiceRequest
except Exception:
    ServiceRequest = None


class ReportViewSet(viewsets.ModelViewSet):
    """
    Files-based reports CRUD + download:
    - GET /api/v1/reports/
    - POST /api/v1/reports/
    - GET /api/v1/reports/{id}/
    - DELETE /api/v1/reports/{id}/
    - GET /api/v1/reports/{id}/download/
    """
    queryset = Report.objects.select_related("owner")
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_serializer_class(self):
        if self.action == "create":
            return ReportCreateSerializer
        return ReportSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        u = self.request.user
        return qs if u.is_staff else qs.filter(owner=u)

    def perform_create(self, serializer):
        report = serializer.save(owner=self.request.user, status="queued")
        # synchronous generation (swap to Celery later if you like)
        generate_report(report, actor=self.request.user)

    @action(detail=True, methods=["get"], url_path="download")
    def download(self, request, pk=None):
        try:
            report = self.get_object()
        except Http404:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if not report.is_ready or not report.file:
            return Response({"detail": "Report not ready."}, status=status.HTTP_400_BAD_REQUEST)

        filename = report.file.name.rsplit("/", 1)[-1]
        return FileResponse(report.file.open("rb"), as_attachment=True, filename=filename)


# ---------- Admin KPI Summary (kept for your AdminDashboard) ----------

def _first_day_of_month(dt):
    return dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

@api_view(["GET"])
@permission_classes([IsAuthenticated])  # additional admin guard below
def summary(request):
    """
    GET /api/v1/reports/summary/
    Returns KPI style aggregates for the admin dashboard.
    Admin-only; returns 403 for non-admins.
    """
    user = request.user
    if not (getattr(user, "is_staff", False) or getattr(user, "is_superuser", False) or getattr(user, "role", "") == "ADMIN"):
        return Response({"detail": "Admin access required."}, status=403)

    now = timezone.now()
    start_12 = _first_day_of_month(now) - timedelta(days=365)

    # Payments aggregates
    payments_by_month = OrderedDict()
    payments_by_status = []
    if Payment is not None:
        pays_qs = Payment.objects.filter(period_start__gte=start_12)
        by_month_qs = (
            pays_qs
            .annotate(month=TruncMonth("period_start"))
            .values("month")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )
        for row in by_month_qs:
            month = row["month"]
            total = row["total"] or 0
            payments_by_month[month.strftime("%Y-%m")] = float(total)

        payments_by_status = list(
            pays_qs.values("status").annotate(total=Sum("amount"), count=Count("id")).order_by("status")
        )

    # Requests aggregates
    requests_by_status = []
    requests_by_category = []
    avg_resolution_days_30 = None

    if ServiceRequest is not None:
        reqs = ServiceRequest.objects.all()
        requests_by_status = list(
            reqs.values("status").annotate(count=Count("id")).order_by("status")
        )
        requests_by_category = list(
            reqs.values("category__name").annotate(count=Count("id")).order_by("-count")
        )

        recent = reqs.filter(resolved_at__isnull=False, resolved_at__gte=now - timedelta(days=30))
        avg_expr = ExpressionWrapper(F("resolved_at") - F("created_at"), output_field=DurationField())
        avg_delta = recent.aggregate(avg=Avg(avg_expr))["avg"]
        if avg_delta:
            avg_resolution_days_30 = avg_delta.total_seconds() / 86400.0

    # Totals for quick KPIs
    payments_total = 0.0
    users_total = None
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        users_total = User.objects.count()
    except Exception:
        users_total = None

    if Payment is not None:
        total = Payment.objects.aggregate(s=Sum("amount"))["s"] or 0
        payments_total = float(total)

    return Response({
        "payments_total": payments_total,
        "payments_by_month": payments_by_month,
        "payments_by_status": payments_by_status,
        "requests_by_status": requests_by_status,
        "requests_by_category": requests_by_category,
        "avg_resolution_days_30": avg_resolution_days_30,
        "users_total": users_total,
        "as_of": now.isoformat(),
    })
