# audits/views.py
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import AuditLog
from .serializers import AuditLogSerializer

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        u = getattr(request, "user", None)
        return bool(u and u.is_authenticated and getattr(u, "role", "") == "ADMIN")

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only access to audit logs (Admin only).
    Supports filters: actor, action, model, status_code; ordering by created_at.
    """
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    serializer_class = AuditLogSerializer
    queryset = AuditLog.objects.select_related("actor").all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["actor", "action", "model", "status_code"]
    search_fields = ["object_id", "path", "actor__email", "model"]
    ordering_fields = ["created_at", "status_code"]
    ordering = ["-created_at"]
