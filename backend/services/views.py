# services/views.py
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import ServiceCategory, ServiceRequest, RequestAttachment, RequestStatus
from .serializers import (
    ServiceCategorySerializer, ServiceRequestSerializer,
    ServiceRequestUpdateSerializer, RequestAttachmentSerializer
)

class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.AllowAny]

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.select_related("requester", "assigned_to", "category")
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status","category","priority","requester"]
    search_fields = ["title","description"]
    ordering_fields = ["created_at","resolved_at","priority"]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if user.role == "PENSIONER":
            return qs.filter(requester=user)
        return qs

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ("PUT","PATCH") and self.request.user.role in ("STAFF","ADMIN"):
            return ServiceRequestUpdateSerializer
        return super().get_serializer_class()

    # Prevent pensioners from editing (comment this out if you want limited edits)
    def update(self, request, *args, **kwargs):
        if request.user.role == "PENSIONER":
            return Response({"detail": "Only staff can update a request."}, status=403)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if request.user.role == "PENSIONER":
            return Response({"detail": "Only staff can update a request."}, status=403)
        return super().partial_update(request, *args, **kwargs)

    @action(methods=["post"], detail=True, parser_classes=[MultiPartParser, FormParser])
    def attachments(self, request, pk=None):
        req = self.get_object()
        # owner can upload to own request; staff/admin can upload to any
        if request.user.role == "PENSIONER" and req.requester_id != request.user.id:
            return Response({"detail": "Forbidden"}, status=403)
        ser = RequestAttachmentSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save(request=req, uploaded_by=request.user)
        return Response(ser.data, status=201)
