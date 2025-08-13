# notices/tests.py
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Notification, Channel

User = get_user_model()

@pytest.mark.django_db
def test_list_scopes_to_current_user_and_mark_actions():
    c = APIClient()
    u1 = User.objects.create_user(email="a@test.com", password="Pass123!", role="PENSIONER")
    u2 = User.objects.create_user(email="b@test.com", password="Pass123!", role="PENSIONER")

    n1 = Notification.objects.create(user=u1, channel=Channel.IN_APP, subject="Hello", message="Msg")
    Notification.objects.create(user=u2, channel=Channel.IN_APP, subject="Other", message="Msg")

    c.force_authenticate(u1)
    r = c.get("/api/v1/notifications/")
    assert r.status_code == 200
    ids = [row["id"] for row in r.json()["results"]] if "results" in r.json() else [row["id"] for row in r.json()]
    assert n1.id in ids
    # mark_read (detail)
    r2 = c.post(f"/api/v1/notifications/{n1.id}/mark_read/")
    assert r2.status_code == 200
    n1.refresh_from_db()
    assert n1.was_read is True
    # mark_all_read (bulk)
    Notification.objects.create(user=u1, channel=Channel.IN_APP, subject="X", message="Y")
    r3 = c.post("/api/v1/notifications/mark_all_read/")
    assert r3.status_code == 200
    assert r3.json()["updated"] >= 1
