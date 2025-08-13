# services/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ServiceCategoryViewSet, ServiceRequestViewSet

router = DefaultRouter()
router.register(r"service-categories", ServiceCategoryViewSet, basename="service-categories")
router.register(r"requests", ServiceRequestViewSet, basename="requests")

urlpatterns = [path("", include(router.urls))]
