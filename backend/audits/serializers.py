# audits/serializers.py
from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = (
            "id", "created_at", "actor", "actor_email",
            "action", "model", "object_id", "status_code", "path",
            "changes", "ip_address",
        )
        read_only_fields = fields

    def get_actor_email(self, obj):
        return getattr(obj.actor, "email", None)
