from rest_framework.permissions import BasePermission

class IsStaffOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ("STAFF", "ADMIN")

class IsOwnerOrReadOnly(BasePermission):
    """
    Pensioner: can read own; may create; may not update others.
    Staff/Admin: full access (gate with IsStaffOrAdmin where needed).
    """
    def has_object_permission(self, request, view, obj):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        if request.user.role in ("STAFF", "ADMIN"):
            return True
        return getattr(obj, "requester_id", None) == request.user.id
