# API Reference

## Base URL

```
{{base_url}}
```

## Authentication

{{auth_method}}

## Endpoints

### Health Check

```
GET /api/health
```

Response:
```json
{ "status": "ok", "timestamp": "..." }
```

{{api_endpoints}}

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `INTERNAL_ERROR` | 500 | Server error |
