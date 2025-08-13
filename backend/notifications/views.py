# notices/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import QuerySet
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self) -> QuerySet:
        return (
            Notification.objects
            .filter(user=self.request.user)
            .order_by("-sent_at")  # stable default
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        n = self.get_object()
        if n.user_id != request.user.id:
            return Response({"detail": "Forbidden"}, status=403)
        if not n.was_read:
            n.was_read = True
            n.save(update_fields=["was_read"])
        return Response({"status": "read"})

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        qs = self.get_queryset().filter(was_read=False)
        updated = qs.update(was_read=True)
        return Response({"updated": updated})
