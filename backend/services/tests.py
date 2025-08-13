# services/tests.py
import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import ServiceCategory, ServiceRequest

User = get_user_model()

@pytest.mark.django_db
def test_create_request_and_upload_attachment():
    c = APIClient()
    p = User.objects.create_user(email="p@test.com", password="Pass123!", role="PENSIONER")
    cat = ServiceCategory.objects.create(name="Certificate Request")

    c.force_authenticate(p)
    r = c.post("/api/v1/requests/", {
        "category": cat.id, "title": "Need letter", "description": "Please issue", "priority": "normal"
    }, format="json")
    assert r.status_code == 201
    rid = r.data["id"]

    f = SimpleUploadedFile("a.pdf", b"%PDF-1.4 dummy", content_type="application/pdf")
    r2 = c.post(f"/api/v1/requests/{rid}/attachments/", {"file": f}, format="multipart")
    assert r2.status_code == 201

@pytest.mark.django_db
def test_pensioner_cannot_update_request():
    c = APIClient()
    p = User.objects.create_user(email="p2@test.com", password="Pass123!", role="PENSIONER")
    cat = ServiceCategory.objects.create(name="Benefit Update")
    sr = ServiceRequest.objects.create(requester=p, category=cat, title="X", description="Y")

    c.force_authenticate(p)
    r = c.patch(f"/api/v1/requests/{sr.id}/", {"title":"new"}, format="json")
    assert r.status_code == 403
