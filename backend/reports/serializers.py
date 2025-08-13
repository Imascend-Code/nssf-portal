# reports/serializers.py
from rest_framework import serializers
from .models import Report, ReportFormat, ReportKind

class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["title", "kind", "format", "params"]

    def validate(self, data):
        # you can enforce allowed formats per kind here if needed
        return data

class ReportSerializer(serializers.ModelSerializer):
    owner_email = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            "id", "title", "kind", "format", "params",
            "status", "error_message",
            "file", "download_url", "size_bytes",
            "owner", "owner_email",
            "created_at", "generated_at",
        ]
        read_only_fields = fields

    def get_owner_email(self, obj):
        return getattr(obj.owner, "email", None)

    def get_download_url(self, obj):
        request = self.context.get("request")
        if request and obj.is_ready:
            # route to custom action
            return request.build_absolute_uri(f"{obj.id}/download/")
        return None
