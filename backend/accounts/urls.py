from django.urls import path
from .views import RegisterView, MeView, change_password

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("me/change-password/", change_password, name="change-password"),
]
