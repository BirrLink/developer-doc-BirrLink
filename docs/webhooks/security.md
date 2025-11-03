---
sidebar_position: 2
---

# Webhook Security

Securing your webhook endpoints is crucial to prevent unauthorized access and ensure the integrity of the events received from BirrLink.

## Signature Verification

Every webhook request from BirrLink includes a signature in the `BirrLink-Signature` header that you should use to verify the request's authenticity:

```
BirrLink-Signature: t=1678886400,v1=9b21f2b3c286d8a515a5d3e759739a1556d8d2f3a4b5c6d7e8f9a0b1c2d3e4f5
```

### Signature Format

The signature header contains:

- `t`: The timestamp of when the webhook was sent (Unix timestamp)
- `v1`: The HMAC-SHA256 signature of the payload using your signing secret

### Verification Process

To verify a webhook signature:

1. Extract the timestamp and signature from the header
2. Prepare the payload string: `t=<timestamp>,v1=<signature>`
3. Compute the HMAC-SHA256 hash of the raw body using your signing secret
4. Compare the computed hash with the signature in the header

### Code Examples

**Node.js:**
```javascript
const crypto = require('crypto');

const webhookSecret = process.env.BIRR_LINK_WEBHOOK_SECRET;

app.post('/webhooks/birrlink', express.raw({type: 'application/json'}), (req, res) => {
  const sigHeader = req.headers['birrlink-signature'];
  const timestamp = req.headers['birrlink-timestamp'];
  const signature = sigHeader.split(',').find(part => part.startsWith('v1=')).split('=')[1];
  
  // Create the payload string to verify
  const payloadString = `t=${timestamp},v1=${crypto
    .createHmac('sha256', webhookSecret)
    .update(req.body)
    .digest('hex')}`;
  
  // Verify the signature
  const expectedSignature = `t=${timestamp},v1=${signature}`;
  const computedSignature = `t=${timestamp},v1=${crypto
    .createHmac('sha256', webhookSecret)
    .update(req.body)
    .digest('hex')}`;
  
  const isValid = crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(expectedSignature)
  );
  
  if (!isValid) {
    return res.status(400).send('Invalid signature');
  }
  
  // Process the webhook event
  const event = JSON.parse(req.body);
  // ... handle event
  
  res.status(200).send('OK');
});
```

**Python:**
```python
import hmac
import hashlib
from flask import Flask, request

webhook_secret = os.getenv('BIRR_LINK_WEBHOOK_SECRET')

@app.route('/webhooks/birrlink', methods=['POST'])
def webhook_handler():
    signature_header = request.headers.get('BirrLink-Signature')
    timestamp = request.headers.get('BirrLink-Timestamp')
    
    # Extract the signature
    signature_parts = signature_header.split(',')
    signature = None
    for part in signature_parts:
        if part.startswith('v1='):
            signature = part.split('=')[1]
            break
    
    # Compute expected signature
    payload = request.get_data()
    expected_signature = f"t={timestamp},v1={hmac.new(
        webhook_secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()}"
    
    # Verify signature
    computed_signature = f"t={timestamp},v1={hmac.new(
        webhook_secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()}"
    
    if not hmac.compare_digest(computed_signature, expected_signature):
        return 'Invalid signature', 400
    
    # Process the webhook event
    event_json = request.get_json()
    # ... handle event
    
    return 'OK', 200
```

## Best Practices

### Secure Your Signing Secret

- Store your signing secret securely (e.g., environment variables, secrets management)
- Never commit signing secrets to version control
- Rotate your signing secret regularly
- Use different secrets for sandbox and production environments

### Validate Event Types

Even with signature verification, validate that the event type is one you expect:

```javascript
const eventTypes = [
  'payment.completed',
  'payment.failed',
  'refund.created'
];

if (!eventTypes.includes(event.type)) {
  console.log('Unexpected event type:', event.type);
  return res.status(400).send('Invalid event type');
}
```

### Implement Idempotency

Handle potential duplicate webhook deliveries by implementing idempotency:

```javascript
// Use the event ID to prevent duplicate processing
const eventId = event.id;

// Check if this event has already been processed
const existingEvent = await db.findWebhookEvent(eventId);
if (existingEvent) {
  return res.status(200).send('Event already processed');
}

// Process the event and save the ID
await processEvent(event);
await db.saveWebhookEvent({ id: eventId, processedAt: new Date() });

res.status(200).send('OK');
```

### Time-Based Validation

Check that the webhook timestamp is within an acceptable range (e.g., 5 minutes) to prevent replay attacks:

```javascript
const now = Math.floor(Date.now() / 1000);
const tolerance = 300; // 5 minutes in seconds

if (Math.abs(now - parseInt(timestamp)) > tolerance) {
  return res.status(400).send('Webhook timestamp too old');
}
```

## Testing Security

### In Development

In development, you can temporarily skip signature verification to test your webhook handling logic, but make sure to implement it before going to production.

### Signature Verification Testing

Use test signatures provided in our testing environment to ensure your verification logic works correctly.

## Handling Webhook Attempts

### Logging

Log all webhook attempts (successful and failed) for debugging and security monitoring:

```javascript
app.post('/webhooks/birrlink', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['birrlink-signature'];
  const timestamp = req.headers['birrlink-timestamp'];
  const sourceIp = req.ip;
  
  console.log(`Webhook attempt from ${sourceIp} at ${new Date().toISOString()}`);
  
  // Verify signature
  // ... verification logic ...
  
  if (isValid) {
    console.log('Webhook signature verified successfully');
    // ... process event ...
  } else {
    console.error('Webhook signature verification failed');
    // Possibly block the IP after multiple failed attempts
  }
});
```

## Security Monitoring

### Anomaly Detection

Monitor for:
- Unusually high volume of webhook requests
- Requests from unexpected IP addresses
- Repeated signature verification failures
- Invalid event types

### Incident Response

Have a plan for when webhook security issues are detected:
- Immediately rotate your signing secret
- Investigate the source of unauthorized requests
- Review your webhook handler for vulnerabilities

Remember: Proper webhook security is essential to prevent unauthorized actions based on fake webhook events. Always verify signatures and validate the data before acting on webhook events.