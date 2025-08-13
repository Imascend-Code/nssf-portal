# payments/urls_statement.py
from django.urls import path
from .views_statement import statement_pdf

urlpatterns = [
    # Exposes: /api/v1/documents/statement/
    path("documents/statement/", statement_pdf, name="statement-pdf"),
]
