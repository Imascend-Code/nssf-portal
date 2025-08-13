from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
try:
    JSONField = models.JSONField
except:
    from django.contrib.postgres.fields import JSONField  # sqlite compat fallback not needed in Django 5

class AuditLog(models.Model):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    action = models.CharField(max_length=60)
    model = models.CharField(max_length=120)
    object_id = models.CharField(max_length=60)
    changes = JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created_at"]
