import json
from django.utils.deprecation import MiddlewareMixin
from .models import AuditLog

class AuditMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        try:
            if request.method in ("POST","PUT","PATCH","DELETE") and hasattr(request, "user") and request.path.startswith("/api/"):
                payload = None
                if request.body:
                    try: payload = json.loads(request.body.decode("utf-8"))
                    except Exception: payload = None
                AuditLog.objects.create(
                    actor=request.user if request.user.is_authenticated else None,
                    action=request.method,
                    model=getattr(getattr(response, "renderer_context", {}), "get", lambda *_: None)("view", None).__class__.__name__ if hasattr(response, "renderer_context") else "",
                    object_id="",
                    changes=payload,
                    ip_address=self._client_ip(request),
                )
        except Exception:
            pass
        return response

    def _client_ip(self, request):
        xff = request.META.get("HTTP_X_FORWARDED_FOR")
        return xff.split(",")[0] if xff else request.META.get("REMOTE_ADDR")
