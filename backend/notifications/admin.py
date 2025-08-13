from django.contrib import admin
from .models import Notification, Channel


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "subject", "channel", "was_read", "sent_at")
    list_filter = ("channel", "was_read", "sent_at")
    search_fields = ("subject", "message", "user__email")
    autocomplete_fields = ("user",)
    date_hierarchy = "sent_at"
    ordering = ("-sent_at",)

    actions = ["mark_selected_read", "mark_selected_unread"]

    @admin.action(description="Mark selected as read")
    def mark_selected_read(self, request, queryset):
        queryset.update(was_read=True)

    @admin.action(description="Mark selected as unread")
    def mark_selected_unread(self, request, queryset):
        queryset.update(was_read=False)
