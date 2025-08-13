# reports/admin.py
from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "kind", "format", "status", "size_bytes", "created_at", "generated_at")
    list_filter = ("kind", "format", "status", "created_at")
    search_fields = ("title", "owner__email")
    readonly_fields = ("size_bytes", "generated_at", "file")

    actions = ["regenerate_reports"]

    @admin.action(description="Regenerate selected reports")
    def regenerate_reports(self, request, queryset):
        from .utils import generate_report
        count = 0
        for r in queryset:
            generate_report(r, actor=request.user)
            count += 1
        self.message_user(request, f"Regenerated {count} report(s).")
