# config/schema.py
from drf_spectacular.utils import (
    extend_schema, extend_schema_view, OpenApiExample, OpenApiResponse,
    inline_serializer
)
from rest_framework import serializers

# Examples for JWT endpoints
JWT_LOGIN_EXAMPLES = [
    OpenApiExample(
        "Successful login",
        value={"access": "eyJhbGciOiJIUzI1...", "refresh": "eyJhbGciOiJIUzI1..."},
        response_only=True,
    ),
    OpenApiExample(
        "Login payload",
        value={"email": "p1@nssf.test", "password": "Pass123!"},
        request_only=True,
    ),
]

# Reusable paginated response wrapper
def paginated_response(of_serializer):
    return OpenApiResponse(
        response=inline_serializer(
            name=f"Paginated{of_serializer.__name__}",
            fields={
                "count": serializers.IntegerField(),
                "next": serializers.CharField(allow_null=True),
                "previous": serializers.CharField(allow_null=True),
                "results": of_serializer(many=True),
            },
        )
    )

# Reusable multipart/form-data request body for file uploads
FILE_UPLOAD_REQUEST = {
    "multipart/form-data": {
        "type": "object",
        "properties": {
            "file": {"type": "string", "format": "binary"},  # up to 5MB; pdf/jpg/png
        },
        "required": ["file"],
    }
}

def doc_tag(tag: str):
    """Add a single tag to all actions of a ViewSet."""
    return extend_schema_view(
        list=extend_schema(tags=[tag]),
        retrieve=extend_schema(tags=[tag]),
        create=extend_schema(tags=[tag]),
        update=extend_schema(tags=[tag]),
        partial_update=extend_schema(tags=[tag]),
        destroy=extend_schema(tags=[tag]),
    )
