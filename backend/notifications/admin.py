# notices/admin.py  (or notifications/admin.py if that’s your app name)
from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "channel", "subject", "was_read", "sent_at")
    list_filter = ("channel", "was_read")
    search_fields = ("subject", "message", "user__email")
    date_hierarchy = "sent_at"
    ordering = ("-sent_at",)
    actions = ["mark_read", "mark_unread"]

    @admin.action(description="Mark selected notifications as read")
    def mark_read(self, request, queryset):
        queryset.update(was_read=True)

    @admin.action(description="Mark selected notifications as unread")
    def mark_unread(self, request, queryset):
        queryset.update(was_read=False)
