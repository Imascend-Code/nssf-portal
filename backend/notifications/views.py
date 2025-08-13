from typing import List

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """
    Scoped to current user.
    Routes (via router):
      GET    /api/v1/notifications/
      GET    /api/v1/notifications/{id}/
      POST   /api/v1/notifications/{id}/mark_read/
      POST   /api/v1/notifications/mark_all_read/
      GET    /api/v1/notifications/unread_count/
      POST   /api/v1/notifications/mark_many_read/   body: {"ids":[1,2,...]}
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        n = self.get_object()
        if not n.was_read:
            n.was_read = True
            n.save(update_fields=["was_read"])
        return Response({"ok": True})

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(was_read=False).update(was_read=True)
        return Response({"updated": updated})

    @action(detail=False, methods=["get"])
    def unread_count(self, request):
        count = self.get_queryset().filter(was_read=False).count()
        return Response({"unread": count})

    @action(detail=False, methods=["post"])
    def mark_many_read(self, request):
        ids: List[int] = request.data.get("ids") or []
        if not isinstance(ids, list):
            return Response({"detail": "ids must be a list"}, status=status.HTTP_400_BAD_REQUEST)
        qs = self.get_queryset().filter(id__in=ids, was_read=False)
        updated = qs.update(was_read=True)
        return Response({"updated": updated})
