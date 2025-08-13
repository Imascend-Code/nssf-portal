# audits/tests.py
import json
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_audit_log_created_on_post_and_admin_can_list():
    c = APIClient()
    # make users
    admin = User.objects.create_user(email="admin@test.com", password="Pass123!", role="ADMIN", is_staff=True, is_superuser=True)
    p = User.objects.create_user(email="p@test.com", password="Pass123!", role="PENSIONER")

    # pensioner logs in and creates a request (hit any POST endpoint you have; using notifications as example)
    c.force_authenticate(p)
    r = c.post("/api/v1/notifications/", {"channel": "in_app", "subject": "Hi", "message": "Hello"}, format="json")
    assert r.status_code in (200, 201)

    # Non-admin cannot list audit logs
    r2 = c.get("/api/v1/audit-logs/")
    assert r2.status_code == 403

    # Admin can list and should see at least 1 entry
    c.force_authenticate(admin)
    r3 = c.get("/api/v1/audit-logs/?action=POST")
    assert r3.status_code == 200
    data = r3.json()
    count = data["count"] if isinstance(data, dict) and "count" in data else len(data)
    assert count >= 1
