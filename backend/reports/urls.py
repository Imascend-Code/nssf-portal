# reports/urls.py
from django.urls import path
from .views import summary

urlpatterns = [
    path("reports/summary/", summary, name="reports-summary"),
]
