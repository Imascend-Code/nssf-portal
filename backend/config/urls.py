# project/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import (
    SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
)

# --- ViewSets you already have ---
from profiles.views import ProfileMeViewSet, BeneficiaryItemViewSet
from payments.views import PaymentViewSet
from services.views import ServiceCategoryViewSet, ServiceRequestViewSet
from notifications.views import NotificationViewSet
from audits.views import AuditLogViewSet

# --- Function views ---
from reports.views import summary as report_summary
from payments.views_statement import statement_pdf

# --- Auth (JWT) ---
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# --- Accounts (add admin members API) ---
# If AdminMemberViewSet lives in accounts.views:
from accounts.views import AdminMemberViewSet

router = DefaultRouter()

# Your existing endpoints
router.register(r"profiles/me", ProfileMeViewSet, basename="profiles-me")
router.register(r"profiles/beneficiaries", BeneficiaryItemViewSet, basename="beneficiaries")
router.register(r"payments", PaymentViewSet, basename="payments")
router.register(r"service-categories", ServiceCategoryViewSet, basename="service-categories")
router.register(r"requests", ServiceRequestViewSet, basename="requests")
router.register(r"notifications", NotificationViewSet, basename="notifications")
router.register(r"audits", AuditLogViewSet, basename="audits")

# NEW: Admin members API (list/retrieve/update + set_balance/adjust_balance)
router.register(r"members", AdminMemberViewSet, basename="members")

urlpatterns = [
    path("admin/", admin.site.urls),

    # API docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    # API v1
    path("api/v1/", include([
        # DRF routers
        path("", include(router.urls)),

        # Accounts views (users/me, auth/register)
        path("", include(("accounts.urls", "accounts"), namespace="accounts")),

        # JWT auth
        path("auth/login/", TokenObtainPairView.as_view(), name="jwt-login"),
        path("auth/refresh/", TokenRefreshView.as_view(), name="jwt-refresh"),

        # Reports & documents
        path("reports/summary/", report_summary, name="report-summary"),
        path("documents/statement/", statement_pdf, name="statement-pdf"),
    ])),
]

# Static/media (dev)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
