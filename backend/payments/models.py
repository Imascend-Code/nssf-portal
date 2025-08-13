from django.db import models
from django.conf import settings

class PaymentStatus(models.TextChoices):
    PROCESSED="processed","processed"
    PENDING="pending","pending"
    ON_HOLD="on_hold","on_hold"

class Payment(models.Model):
    pensioner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments")
    period_start = models.DateField()
    period_end = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PROCESSED)
    paid_at = models.DateTimeField(null=True, blank=True)
    reference = models.CharField(max_length=60)
    class Meta:
        indexes = [models.Index(fields=["pensioner","paid_at"])]
        ordering = ["-period_start"]
    def __str__(self): return f"{self.pensioner.email} {self.period_start} - {self.amount}"
