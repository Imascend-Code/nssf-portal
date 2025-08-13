# accounts/tests.py
import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

@pytest.mark.django_db
def test_register_and_change_password():
    c = APIClient()
    r = c.post(reverse("register"), {"email":"t@test.com","password":"Pass123!x","full_name":"T","phone":"0700"}, format="json")
    assert r.status_code == 201
    u = User.objects.get(email="t@test.com")
    c.force_authenticate(u)
    r2 = c.post(reverse("change-password"), {"old_password":"Pass123!x","new_password":"Pass123!y"}, format="json")
    assert r2.status_code == 200
    assert u.check_password("Pass123!y") is False  # not refreshed
    u.refresh_from_db()
    assert u.check_password("Pass123!y") is True
