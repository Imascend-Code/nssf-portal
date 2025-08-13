# audits/models.py
from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=60)            # POST/PUT/PATCH/DELETE
    model = models.CharField(max_length=120, blank=True)
    object_id = models.CharField(max_length=64, blank=True)
    status_code = models.PositiveIntegerField(default=0)
    path = models.CharField(max_length=255, blank=True)
    changes = models.JSONField(null=True, blank=True)   # safe on Django 5
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["created_at"]),
            models.Index(fields=["actor", "created_at"]),
            models.Index(fields=["model", "created_at"]),
            models.Index(fields=["action", "created_at"]),
        ]

    def __str__(self):
        who = self.actor.email if self.actor else "anonymous"
        return f"{self.action} {self.model}#{self.object_id} by {who} @ {self.created_at:%Y-%m-%d %H:%M:%S}"
