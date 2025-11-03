---
sidebar_position: 1
---

# Webhook Events Overview

Webhooks allow you to receive real-time notifications about events happening in your BirrLink account. Instead of polling the API for updates, BirrLink will send HTTP POST requests to your specified URLs when certain events occur.

## How Webhooks Work

1. You register one or more webhook endpoints with BirrLink
2. When an event occurs (like a payment completion), BirrLink sends an HTTP POST request to your webhook URL
3. Your application processes the event and responds with a 200 status code
4. BirrLink considers the webhook delivered successfully

## Registering Webhooks

### Via API

```bash
curl https://api.birrlink.et/v1/webhooks \
  -H "Authorization: Bearer YOUR_SECRET_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourwebsite.com/webhooks/birrlink",
    "events": ["payment.completed", "payment.failed"],
    "description": "Handle payment notifications"
  }'
```

### Via Dashboard

Alternatively, you can register webhooks through your [BirrLink Dashboard](https://dashboard.birrlink.et):

1. Log in to your dashboard
2. Navigate to **Settings** → **Webhooks**
3. Click **Add Webhook**
4. Enter your webhook URL and select events
5. Save the webhook

## Webhook Payload Format

All webhook events follow the same basic structure:

```json
{
  "id": "evt_123456789",
  "type": "payment.completed",
  "created": 1678886400,
  "livemode": false,
  "data": {
    "object": {
      // Event-specific data
    }
  },
  "previous_attributes": {
    // For update events, contains previous values
  }
}
```

### Example Payment Completed Event

```json
{
  "id": "evt_123456789",
  "type": "payment.completed",
  "created": 1678886400,
  "livemode": false,
  "data": {
    "object": {
      "id": "pay_987654321",
      "status": "completed",
      "amount": 100.00,
      "currency": "ETB",
      "customer": {
        "email": "customer@example.com",
        "phone": "+251912345678"
      },
      "description": "Payment for order #12345",
      "transaction_id": "txn_55667788",
      "payment_method": "mobile_money",
      "created_at": "2023-10-20T14:30:00Z",
      "completed_at": "2023-10-20T14:35:00Z"
    }
  }
}
```

## Available Events

### Payment Events
- `payment.created`: Payment request created
- `payment.pending`: Payment awaiting customer confirmation
- `payment.processing`: Payment being processed
- `payment.completed`: Payment successfully completed
- `payment.failed`: Payment failed
- `payment.cancelled`: Payment cancelled by customer

### Refund Events
- `refund.created`: Refund created
- `refund.approved`: Refund approved
- `refund.completed`: Refund successfully processed
- `refund.failed`: Refund failed

### Customer Events
- `customer.created`: New customer created
- `customer.updated`: Customer information updated

## Receiving Webhooks

### Endpoint Requirements

Your webhook endpoint must:

1. Accept HTTP POST requests
2. Respond with a 200 status code within 10 seconds
3. Be accessible over HTTPS in production
4. Handle duplicate events gracefully

### Example Endpoint (Node.js)

```javascript
app.post('/webhooks/birrlink', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['birrlink-signature'];
  const event = req.body;
  
  // Process different event types
  switch (event.type) {
    case 'payment.completed':
      const payment = event.data.object;
      console.log(`Payment ${payment.id} completed with amount ${payment.amount}`);
      // Update your database, send confirmation email, etc.
      break;
    case 'payment.failed':
      const failedPayment = event.data.object;
      console.log(`Payment ${failedPayment.id} failed`);
      // Handle failed payment, notify customer, etc.
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Acknowledge receipt
  res.status(200).send('OK');
});
```

### Example Endpoint (Python)

```python
from flask import Flask, request
import json

app = Flask(__name__)

@app.route('/webhooks/birrlink', methods=['POST'])
def webhook_handler():
    event_json = request.get_json()
    event_type = event_json['type']
    
    if event_type == 'payment.completed':
        payment = event_json['data']['object']
        print(f"Payment {payment['id']} completed with amount {payment['amount']}")
        # Update your database, send confirmation email, etc.
    elif event_type == 'payment.failed':
        failed_payment = event_json['data']['object']
        print(f"Payment {failed_payment['id']} failed")
        # Handle failed payment, notify customer, etc.
    else:
        print(f"Unhandled event type {event_type}")
    
    # Acknowledge receipt
    return 'OK', 200
```

## Security

### Signature Verification

BirrLink signs all webhook events with an HMAC-SHA256 signature to ensure authenticity:

```
birrlink-signature: t=1678886400,v1=hmac_signature_here
```

Verify signatures in your webhook handler:

**Node.js:**
```javascript
const crypto = require('crypto');

const verifySignature = (payload, signature, secret) => {
  const expectedSignature = `t=${timestamp},v1=${crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')}`;
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
```

**Python:**
```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    expected_signature = f"t={timestamp},v1=" + hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)
```

### Best Practices

- Store your webhook signing secret securely
- Always verify webhook signatures
- Log webhook attempts for debugging
- Implement rate limiting to prevent abuse
- Use unique endpoints for different event types if needed

## Reliability

### Retry Mechanism

BirrLink will attempt to deliver webhooks up to 3 times if:

- Your server returns a non-200 status code
- Your server doesn't respond within 10 seconds
- Your server is unreachable

The retry schedule is: immediately, after 1 minute, and after 10 minutes.

### Handling Delays

Webhooks are delivered on a best-effort basis but may experience delays during high traffic. Your application should be able to handle out-of-order events and implement idempotency to prevent duplicate processing.

## Testing Webhooks

### Using Webhook Testing Tools

Tools like [ngrok](https://ngrok.com) can expose your local development server to the internet for webhook testing:

```bash
ngrok http 3000
```

Then use the ngrok URL as your webhook endpoint in the sandbox environment.

### Simulating Events

Use the BirrLink Dashboard to simulate different webhook events in the sandbox environment to test your implementation.