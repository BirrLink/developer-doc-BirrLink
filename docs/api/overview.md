---
sidebar_position: 1
---

# API Overview

The BirrLink API allows you to integrate payment processing directly into your application. Our RESTful API follows standard conventions and uses JSON for request and response bodies.

## Base URL

- **Sandbox**: `https://sandbox.birrlink.com/api/v1`
- **Production**: `https://api.birrlink.com/v1`

## Authentication

All API requests must include your secret API key in the header:

```
Authorization: Bearer YOUR_SECRET_API_KEY
```

Replace `YOUR_SECRET_API_KEY` with your actual API key from your BirrLink dashboard.

## API Versioning

The current version of the API is v1. We will maintain backward compatibility within the same version. Any breaking changes will result in a new API version.

## Request Format

All requests should have the content type `application/json`.

Example request:
```json
{
  "amount": 100.00,
  "currency": "ETB",
  "customer": {
    "email": "customer@example.com",
    "phone": "+251912345678"
  },
  "description": "Payment for order #12345",
  "callback_url": "https://yourwebsite.com/payment-callback"
}
```

## Response Format

All API responses are JSON objects. Successful requests return a 2xx status code:

```json
{
  "status": "success",
  "data": {
    "id": "pay_123456789",
    "status": "pending",
    "amount": 100.00,
    "currency": "ETB",
    "payment_method": "mobile_money",
    "payment_link": "https://pay.birrlink.com/pay_123456789",
    "created_at": "2023-10-20T14:30:00Z"
  }
}
```

Error responses include an error code and message:

```json
{
  "status": "error",
  "error": {
    "code": "invalid_amount",
    "message": "Amount must be greater than 0"
  }
}
```

## Common HTTP Status Codes

- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request format
- `401` - Unauthorized: Invalid or missing API key
- `404` - Not Found: Requested resource does not exist
- `422` - Unprocessable Entity: Request validation failed
- `500` - Internal Server Error: Something went wrong on our side

## Rate Limiting

To ensure service quality, API requests are rate-limited:

- **Sandbox environment**: 1000 requests per minute per API key
- **Production environment**: 5000 requests per minute per API key

Rate-limited requests return a 429 status code.