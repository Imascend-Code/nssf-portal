# reports/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, summary

router = DefaultRouter()
router.register(r"reports", ReportViewSet, basename="reports")

urlpatterns = [
    path("", include(router.urls)),
    path("reports/summary/", summary, name="reports-summary"),
]
