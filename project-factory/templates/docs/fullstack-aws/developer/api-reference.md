# API Reference

## Base URL

```
Development: http://localhost:3000/api
Production: https://{{api_domain}}/api
```

## Authentication

JWT Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

{{api_endpoints}}

## Error Responses

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
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request body (Zod validation) |
| `INTERNAL_ERROR` | 500 | Server error |
