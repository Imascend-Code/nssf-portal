from django.db import models
from django.conf import settings

def request_file_path(instance, filename): return f"requests/{instance.request_id}/{filename}"

class ServiceCategory(models.Model):
    name = models.CharField(max_length=80, unique=True)
    description = models.TextField(blank=True)
    def __str__(self): return self.name

class RequestStatus(models.TextChoices):
    SUBMITTED="submitted","submitted"
    UNDER_REVIEW="under_review","under_review"
    IN_PROGRESS="in_progress","in_progress"
    RESOLVED="resolved","resolved"
    REJECTED="rejected","rejected"
    CLOSED="closed","closed"

class Priority(models.TextChoices):
    LOW="low","low"
    NORMAL="normal","normal"
    HIGH="high","high"

class ServiceRequest(models.Model):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="requests")
    category = models.ForeignKey(ServiceCategory, on_delete=models.PROTECT)
    title = models.CharField(max_length=140)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=RequestStatus.choices, default=RequestStatus.SUBMITTED)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_requests")
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.NORMAL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        indexes = [
            models.Index(fields=["status","created_at"]),
            models.Index(fields=["assigned_to"]),
        ]
        ordering = ["-created_at"]
    def __str__(self): return f"{self.title} ({self.status})"

class RequestAttachment(models.Model):
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to=request_file_path)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
