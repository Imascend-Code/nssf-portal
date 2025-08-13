# reports/models.py
from __future__ import annotations
import os
from datetime import datetime
from uuid import uuid4
from django.db import models
from django.conf import settings

class ReportFormat(models.TextChoices):
    CSV = "csv", "CSV"
    XLSX = "xlsx", "Excel (XLSX)"
    JSON = "json", "JSON"
    PDF = "pdf", "PDF"

class ReportKind(models.TextChoices):
    # different logical report types you want
    ACCOUNT_SUMMARY = "account_summary", "Account Summary"
    PAYMENTS = "payments", "Payments"
    REQUESTS = "requests", "Service Requests"
    # add more kinds here

def report_upload_to(instance: "Report", filename: str) -> str:
    now = datetime.utcnow()
    base, ext = os.path.splitext(filename)
    ext = ext.lower() or f".{instance.format}"
    fname = f"{instance.kind}_{uuid4().hex}{ext}"
    return f"reports/{now.year}/{now.month:02d}/{fname}"

class Report(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="reports",
        on_delete=models.CASCADE,
        help_text="Who requested/owns this report"
    )
    title = models.CharField(max_length=180)
    kind = models.CharField(max_length=64, choices=ReportKind.choices)
    format = models.CharField(max_length=8, choices=ReportFormat.choices)
    params = models.JSONField(default=dict, blank=True)

    file = models.FileField(upload_to=report_upload_to, blank=True, null=True)
    size_bytes = models.PositiveBigIntegerField(default=0)
    status = models.CharField(
        max_length=24,
        choices=[("queued", "Queued"), ("running", "Running"), ("done", "Done"), ("error", "Error")],
        default="queued",
    )
    error_message = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    generated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.title} ({self.get_format_display()})"

    @property
    def is_ready(self) -> bool:
        return self.status == "done" and bool(self.file)
