# services/admin.py
from django.contrib import admin
from .models import ServiceCategory, ServiceRequest, RequestAttachment

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)

class RequestAttachmentInline(admin.TabularInline):
    model = RequestAttachment
    extra = 0
    readonly_fields = ("uploaded_by", "uploaded_at")

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "status", "priority", "category", "requester", "assigned_to", "created_at", "resolved_at")
    list_filter = ("status", "priority", "category")
    search_fields = ("title", "description", "requester__email", "assigned_to__email")
    date_hierarchy = "created_at"
    inlines = [RequestAttachmentInline]

@admin.register(RequestAttachment)
class RequestAttachmentAdmin(admin.ModelAdmin):
    list_display = ("id", "request", "uploaded_by", "uploaded_at")
    readonly_fields = ("uploaded_by", "uploaded_at")
    search_fields = ("request__title", "uploaded_by__email")
