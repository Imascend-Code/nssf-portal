"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from profiles.views import ProfileMeViewSet, BeneficiaryItemViewSet
from payments.views import PaymentViewSet
from services.views import ServiceCategoryViewSet, ServiceRequestViewSet
from notifications.views import NotificationViewSet
from reports.views import summary as report_summary
from payments.views_statement import statement_pdf
from accounts.urls import urlpatterns as accounts_urls
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r"profiles/me", ProfileMeViewSet, basename="profiles-me")
router.register(r"profiles/beneficiaries", BeneficiaryItemViewSet, basename="beneficiaries")
router.register(r"payments", PaymentViewSet, basename="payments")
router.register(r"service-categories", ServiceCategoryViewSet, basename="service-categories")
router.register(r"requests", ServiceRequestViewSet, basename="requests")
router.register(r"notifications", NotificationViewSet, basename="notifications")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("api/v1/", include([
        path("", include(router.urls)),
        path("auth/login/", TokenObtainPairView.as_view(), name="jwt-login"),
        path("auth/refresh/", TokenRefreshView.as_view(), name="jwt-refresh"),
        path("auth/", include((accounts_urls, "accounts"), namespace="accounts")),
        path("reports/summary/", report_summary),
        path("documents/statement/", statement_pdf),
    ])),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)