from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Payment
from .serializers import PaymentSerializer

class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ["status","pensioner"]
    ordering_fields = ["paid_at","period_start","amount"]
    search_fields = ["reference"]
    def get_queryset(self):
        user = self.request.user
        qs = Payment.objects.all()
        if user.role == "PENSIONER":
            qs = qs.filter(pensioner=user)
        return qs
