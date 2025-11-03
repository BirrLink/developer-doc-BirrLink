---
sidebar_position: 3
---

# API Endpoints

This section details all available API endpoints for the BirrLink payment gateway.

## Payments

### Create Payment
`POST /payments`

Create a new payment request.

**Request Body:**
```json
{
  "amount": 100.00,
  "currency": "ETB",
  "customer": {
    "email": "customer@example.com",
    "phone": "+251912345678",
    "name": "John Doe"
  },
  "description": "Payment for order #12345",
  "callback_url": "https://yourwebsite.com/payment-callback",
  "payment_method": "mobile_money",
  "metadata": {
    "order_id": "12345",
    "customer_id": "67890"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "pay_123456789",
    "status": "pending",
    "amount": 100.00,
    "currency": "ETB",
    "payment_method": "mobile_money",
    "payment_link": "https://pay.birrlink.et/pay_123456789",
    "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "expires_at": "2023-10-20T15:30:00Z",
    "created_at": "2023-10-20T14:30:00Z"
  }
}
```

### Get Payment
`GET /payments/{payment_id}`

Retrieve details of a specific payment.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "pay_123456789",
    "status": "completed",
    "amount": 100.00,
    "currency": "ETB",
    "customer": {
      "email": "customer@example.com",
      "phone": "+251912345678"
    },
    "description": "Payment for order #12345",
    "transaction_id": "txn_987654321",
    "payment_method": "mobile_money",
    "created_at": "2023-10-20T14:30:00Z",
    "completed_at": "2023-10-20T14:35:00Z"
  }
}
```

### List Payments
`GET /payments`

Retrieve a list of payments.

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 10, max: 100)
- `offset` (optional): Number of records to skip
- `status` (optional): Filter by payment status (pending, completed, failed, cancelled)
- `date_from` (optional): Filter from date (ISO 8601 format)
- `date_to` (optional): Filter to date (ISO 8601 format)

**Response:**
```json
{
  "status": "success",
  "data": {
    "payments": [
      {
        "id": "pay_123456789",
        "status": "completed",
        "amount": 100.00,
        "currency": "ETB",
        "description": "Payment for order #12345",
        "created_at": "2023-10-20T14:30:00Z"
      }
    ],
    "pagination": {
      "limit": 10,
      "offset": 0,
      "total": 1
    }
  }
}
```

## Refunds

### Create Refund
`POST /refunds`

Create a refund for a completed payment.

**Request Body:**
```json
{
  "payment_id": "pay_123456789",
  "amount": 50.00,
  "reason": "Customer request",
  "metadata": {
    "order_id": "12345"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "ref_987654321",
    "payment_id": "pay_123456789",
    "status": "pending_approval",
    "amount": 50.00,
    "currency": "ETB",
    "reason": "Customer request",
    "created_at": "2023-10-20T15:00:00Z"
  }
}
```

## Customers

### Create Customer
`POST /customers`

Create a new customer record.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "phone": "+251912345678",
  "name": "John Doe",
  "metadata": {
    "customer_type": "individual"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "cus_1122334455",
    "email": "customer@example.com",
    "phone": "+251912345678",
    "name": "John Doe",
    "created_at": "2023-10-20T14:30:00Z"
  }
}
```

## Webhook Endpoints

### Create Webhook
`POST /webhooks`

Register a webhook to receive event notifications.

**Request Body:**
```json
{
  "url": "https://yourwebsite.com/webhooks/birrlink",
  "events": ["payment.completed", "payment.failed"],
  "description": "Webhook for payment notifications"
}
```

## Common Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "error": {
    "code": "validation_error",
    "message": "Amount must be greater than 0",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be greater than 0"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "error": {
    "code": "authentication_failed",
    "message": "Invalid API key"
  }
}
```

### 404 Not Found
```json
{
  "status": "error",
  "error": {
    "code": "resource_not_found",
    "message": "The requested resource does not exist"
  }
}
```

### 422 Unprocessable Entity
```json
{
  "status": "error",
  "error": {
    "code": "insufficient_funds",
    "message": "Customer has insufficient funds for this transaction"
  }
}
```

### 429 Rate Limited
```json
{
  "status": "error",
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Try again later."
  }
}
```