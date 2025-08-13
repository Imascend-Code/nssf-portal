# reports/tests.py
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.utils import timezone
from datetime import timedelta, date

from django.contrib.auth import get_user_model
from payments.models import Payment
from services.models import ServiceCategory, ServiceRequest, Priority, RequestStatus

User = get_user_model()

@pytest.mark.django_db
def test_reports_admin_only_and_payload_shape():
    c = APIClient()
    # non-admin denied
    u = User.objects.create_user(email="p@test.com", password="Pass123!", role="PENSIONER")
    c.force_authenticate(u)
    r = c.get("/api/v1/reports/summary/")
    assert r.status_code == 403

    # seed minimal data
    admin = User.objects.create_user(email="a@test.com", password="Pass123!", role="ADMIN", is_staff=True, is_superuser=True)
    c.force_authenticate(admin)

    p = User.objects.create_user(email="x@test.com", password="Pass123!", role="PENSIONER")
    today = date.today().replace(day=1)
    Payment.objects.create(pensioner=p, period_start=today, period_end=today, amount=1000, status="processed", reference="R1")

    cat = ServiceCategory.objects.create(name="Certificate Request")
    sr = ServiceRequest.objects.create(requester=p, category=cat, title="Need letter", description="desc", priority=Priority.NORMAL, status=RequestStatus.RESOLVED)
    sr.resolved_at = timezone.now()
    sr.save(update_fields=["resolved_at"])

    # admin can see summary
    r2 = c.get("/api/v1/reports/summary/")
    assert r2.status_code == 200
    data = r2.json()
    assert "payments_by_month" in data
    assert "requests_by_status" in data
    assert "requests_by_category" in data
    assert "avg_resolution_days_30" in data
