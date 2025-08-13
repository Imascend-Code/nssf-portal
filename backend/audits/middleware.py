# audits/middleware.py
import json
from django.utils.deprecation import MiddlewareMixin
from .models import AuditLog

SENSITIVE_KEYS = {
    "password", "old_password", "new_password",
    "token", "access", "refresh", "authorization",
    "secret", "secret_key", "api_key",
}

def _mask(value):
    if value is None:
        return None
    if isinstance(value, (int, float, bool)):
        return value
    s = str(value)
    if len(s) <= 4:
        return "****"
    return s[:2] + "*" * (len(s) - 4) + s[-2:]

def _scrub_payload(obj):
    if isinstance(obj, dict):
        return {k: (_mask(v) if k.lower() in SENSITIVE_KEYS else _scrub_payload(v)) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_scrub_payload(v) for v in obj]
    return obj

class AuditMiddleware(MiddlewareMixin):
    """
    Logs write operations to /api/... endpoints.
    """
    def process_response(self, request, response):
        try:
            method = getattr(request, "method", "GET")
            path = getattr(request, "path", "") or ""
            # Only track API writes
            if not (path.startswith("/api/") and method in {"POST", "PUT", "PATCH", "DELETE"}):
                return response
            # Skip admin and static URLs
            if path.startswith("/admin/") or path.startswith("/static/") or path.startswith("/media/"):
                return response

            # Best-effort JSON body (bounded)
            payload = None
            body = getattr(request, "body", b"") or b""
            if body and len(body) <= 512 * 1024:  # cap at 512KB
                try:
                    payload = json.loads(body.decode("utf-8"))
                    payload = _scrub_payload(payload)
                except Exception:
                    payload = None

            # Determine view/model name if available
            view_name = ""
            if hasattr(response, "renderer_context"):
                ctx = response.renderer_context or {}
                view = ctx.get("view")
                if view:
                    view_name = view.__class__.__name__

            # Try to guess object_id from response (common create/update patterns)
            object_id = ""
            try:
                data = getattr(response, "data", None)
                if isinstance(data, dict) and "id" in data:
                    object_id = str(data["id"])
            except Exception:
                pass

            # client IP
            ip = self._client_ip(request)

            AuditLog.objects.create(
                actor=request.user if getattr(request, "user", None) and request.user.is_authenticated else None,
                action=method,
                model=view_name,
                object_id=object_id,
                status_code=getattr(response, "status_code", 0) or 0,
                path=path,
                changes=payload,
                ip_address=ip,
            )
        except Exception:
            # Do not break the request if auditing fails
            pass
        return response

    def _client_ip(self, request):
        xff = request.META.get("HTTP_X_FORWARDED_FOR")
        return xff.split(",")[0].strip() if xff else request.META.get("REMOTE_ADDR")
