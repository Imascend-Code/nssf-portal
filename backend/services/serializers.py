from rest_framework import serializers
from .models import ServiceCategory, ServiceRequest, RequestAttachment
from django.utils import timezone
import mimetypes

ALLOWED_DOCS = {"application/pdf","image/png","image/jpeg"}

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ("id","name","description")

class RequestAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestAttachment
        fields = ("id","file","uploaded_by","uploaded_at")
        read_only_fields = ("uploaded_by","uploaded_at")

    def validate_file(self, f):
        if f.size > 5*1024*1024:
            raise serializers.ValidationError("Max file size is 5MB")
        ctype = getattr(f, "content_type", None) or mimetypes.guess_type(f.name)[0]
        if ctype not in ALLOWED_DOCS:
            raise serializers.ValidationError("Only pdf/jpg/png allowed")
        return f

class ServiceRequestSerializer(serializers.ModelSerializer):
    attachments = RequestAttachmentSerializer(many=True, read_only=True)
    class Meta:
        model = ServiceRequest
        fields = "__all__"
        read_only_fields = ("requester","status","assigned_to","resolved_at","created_at","updated_at")

class ServiceRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = ("status","assigned_to","priority","description","title","category")

    def update(self, instance, validated_data):
        old_status = instance.status
        obj = super().update(instance, validated_data)
        if old_status != obj.status and obj.status in ("resolved","rejected","closed"):
            obj.resolved_at = timezone.now()
            obj.save(update_fields=["resolved_at"])
        return obj
