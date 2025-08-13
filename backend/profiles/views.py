from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PensionerProfile, Beneficiary
from .serializers import PensionerProfileSerializer, BeneficiarySerializer

class ProfileMeViewSet(viewsets.ModelViewSet):
    serializer_class = PensionerProfileSerializer
    http_method_names = ["get","patch"]
    def get_object(self):
        return PensionerProfile.objects.get_or_create(user=self.request.user, defaults={
            "nssf_number": f"DEMO-{self.request.user.id}"
        })[0]

    @action(detail=False, methods=["get","post"])
    def beneficiaries(self, request):
        profile = self.get_object()
        if request.method == "GET":
            qs = profile.beneficiaries.all()
            return Response(BeneficiarySerializer(qs, many=True).data)
        ser = BeneficiarySerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save(profile=profile)
        return Response(ser.data, status=201)

class BeneficiaryItemViewSet(viewsets.ModelViewSet):
    serializer_class = BeneficiarySerializer
    queryset = Beneficiary.objects.all()
    def get_queryset(self): return super().get_queryset().filter(profile__user=self.request.user)
