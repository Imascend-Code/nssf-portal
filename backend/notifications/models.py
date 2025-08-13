# notices/models.py
from django.db import models
from django.conf import settings

class Channel(models.TextChoices):
    EMAIL = "email", "email"
    IN_APP = "in_app", "in_app"

class Notification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )
    channel = models.CharField(max_length=20, choices=Channel.choices, default=Channel.IN_APP)
    subject = models.CharField(max_length=140)
    message = models.TextField()
    was_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-sent_at"]
        indexes = [
            models.Index(fields=["user", "was_read", "sent_at"]),
            models.Index(fields=["was_read", "sent_at"]),
        ]

    def __str__(self):
        return f"[{self.channel}] {self.subject} → {self.user}"
