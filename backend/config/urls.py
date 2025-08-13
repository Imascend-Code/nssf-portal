from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import (
    SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
)

# ViewSets
from profiles.views import ProfileMeViewSet, BeneficiaryItemViewSet
from payments.views import PaymentViewSet
from services.views import ServiceCategoryViewSet, ServiceRequestViewSet
from notifications.views import NotificationViewSet
from audits.views import AuditLogViewSet  # ✅ if you want API access to audits

# Function views
from reports.views import summary as report_summary
from payments.views_statement import statement_pdf

# Auth
from accounts.urls import urlpatterns as accounts_urls
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r"profiles/me", ProfileMeViewSet, basename="profiles-me")
router.register(r"profiles/beneficiaries", BeneficiaryItemViewSet, basename="beneficiaries")
router.register(r"payments", PaymentViewSet, basename="payments")
router.register(r"service-categories", ServiceCategoryViewSet, basename="service-categories")
router.register(r"requests", ServiceRequestViewSet, basename="requests")
router.register(r"notifications", NotificationViewSet, basename="notifications")
router.register(r"audits", AuditLogViewSet, basename="audits")  # ✅ optional

urlpatterns = [
    path("admin/", admin.site.urls),
    # API Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    # API v1
    path("api/v1/", include([
        path("", include(router.urls)),
        path("auth/login/", TokenObtainPairView.as_view(), name="jwt-login"),
        path("auth/refresh/", TokenRefreshView.as_view(), name="jwt-refresh"),
        path("auth/", include((accounts_urls, "accounts"), namespace="accounts")),
        path("reports/summary/", report_summary, name="report-summary"),
        path("documents/statement/", statement_pdf, name="statement-pdf"),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
