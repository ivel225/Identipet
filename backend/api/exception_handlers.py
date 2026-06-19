from rest_framework.views import exception_handler


def identipet_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None

    original_data = response.data
    code = getattr(exc, "default_code", "error")

    if isinstance(original_data, dict) and "detail" in original_data:
        message = str(original_data["detail"])
        fields = None
    elif isinstance(original_data, dict):
        message = "Validation failed."
        fields = original_data
        code = "validation_error"
    else:
        message = str(original_data)
        fields = None

    response.data = {
        "detail": message,
        "error": {
            "code": str(code),
            "message": message,
            "status_code": response.status_code,
        },
    }

    if fields:
        response.data["error"]["fields"] = fields

    return response
