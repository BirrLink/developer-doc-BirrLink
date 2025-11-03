---
sidebar_position: 2
---

# Quickstart Guide

Get started with BirrLink in minutes. This guide will walk you through the basic integration steps.

## Prerequisites

Before you begin, you'll need:

- A BirrLink merchant account (sign up at [birrlink.com](https://birrlink.com))
- Your API keys (found in your merchant dashboard)
- Basic knowledge of HTTP requests or your preferred programming language

## Integration Steps

### 1. Install the SDK

BirrLink provides SDKs for popular programming languages:

**JavaScript/Node.js:**
```bash
npm install @birrlink/sdk
```

**Python:**
```bash
pip install birrlink-sdk
```

**Java:**
```bash
# Add to your pom.xml
<dependency>
  <groupId>com.birrlink</groupId>
  <artifactId>sdk</artifactId>
  <version>1.0.0</version>
</dependency>
```

### 2. Initialize the SDK

**JavaScript:**
```javascript
const BirrLink = require('@birrlink/sdk');

const birrlink = new BirrLink({
  apiKey: 'your_secret_api_key',
  environment: 'sandbox' // Use 'production' for live transactions
});
```

**Python:**
```python
from birrlink import BirrLink

client = BirrLink(
    api_key='your_secret_api_key',
    environment='sandbox'  # Use 'production' for live transactions
)
```

**Java:**
```java
import com.birrlink.BirrLink;

BirrLink client = new BirrLink("your_secret_api_key", Environment.SANDBOX);
```

### 3. Create a Payment Request

**JavaScript:**
```javascript
const payment = await birrlink.charge.create({
  amount: 100.00,
  currency: 'ETB',
  customer: {
    email: 'customer@example.com',
    phone: '+251912345678'
  },
  description: 'Payment for order #12345',
  callback_url: 'https://yourwebsite.com/payment-callback'
});

console.log('Payment created:', payment.id);
```

**Python:**
```python
payment = client.charge.create(
    amount=100.00,
    currency='ETB',
    customer={
        'email': 'customer@example.com',
        'phone': '+251912345678'
    },
    description='Payment for order #12345',
    callback_url='https://yourwebsite.com/payment-callback'
)

print(f'Payment created: {payment["id"]}')
```

### 4. Handle Payment Response

The response will contain a payment ID and payment method specific details (like a payment link or QR code).

## Testing Your Integration

Use our sandbox environment to test your integration:

- Base URL: `https://sandbox.birrlink.com/api/v1`
- Test API keys: Available in your sandbox dashboard
- Test payment methods: Various test credentials available in documentation

## Moving to Production

When you're ready to go live:

1. Verify your integration works with all payment methods
2. Ensure all security requirements are met
3. Contact our team to enable production access
4. Update your API keys and base URL to production values

## Need Help?

- Check our [API Reference](./api/overview) for detailed endpoint documentation
- Join our [developer community](https://discord.gg/birrlink)
- Contact our [support team](mailto:support@birrlink.com)