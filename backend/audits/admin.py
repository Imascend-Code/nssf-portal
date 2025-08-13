# audits/admin.py
from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("created_at", "actor", "action", "model", "object_id", "status_code", "ip_address")
    list_filter = ("action", "model", "status_code")
    search_fields = ("actor__email", "model", "object_id", "path", "ip_address")
    date_hierarchy = "created_at"
    readonly_fields = ("actor","action","model","object_id","status_code","path","changes","ip_address","created_at")
    ordering = ("-created_at",)

    # read-only in admin (no add/change/delete)
    def has_add_permission(self, request): return False
    def has_change_permission(self, request, obj=None): return False
    # Allow delete if you want to prune logs; otherwise return False:
    # def has_delete_permission(self, request, obj=None): return False
