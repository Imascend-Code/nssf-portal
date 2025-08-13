from django.contrib.auth.models import AbstractUser
from django.db import models

class Roles(models.TextChoices):
    PENSIONER="PENSIONER","Pensioner"
    STAFF="STAFF","Staff"
    ADMIN="ADMIN","Admin"

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.PENSIONER)
    full_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    def __str__(self): return f"{self.email} ({self.role})"
