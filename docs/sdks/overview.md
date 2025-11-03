---
sidebar_position: 1
---

# SDKs Overview

BirrLink provides official SDKs for popular programming languages to simplify integration and handle common tasks like authentication, request formatting, and response parsing.

## Available SDKs

### Official SDKs
- [JavaScript/Node.js](./javascript) - For server-side and client-side JavaScript applications
- [Python](./python) - For Python applications
- [Java](./java) - For Java applications

### Community SDKs
- PHP SDK (Community maintained)
- Ruby SDK (Community maintained)
- Go SDK (Community maintained)

## Installation

### JavaScript/Node.js
```bash
npm install @birrlink/sdk
```

### Python
```bash
pip install birrlink-sdk
```

### Java
```xml
<dependency>
  <groupId>com.birrlink</groupId>
  <artifactId>sdk</artifactId>
  <version>1.0.0</version>
</dependency>
```

## Configuration

### JavaScript/Node.js
```javascript
const BirrLink = require('@birrlink/sdk');

const client = new BirrLink({
  apiKey: process.env.BIRR_LINK_SECRET_KEY,
  environment: 'sandbox' // Use 'production' for live transactions
});
```

### Python
```python
from birrlink import BirrLink

client = BirrLink(
    api_key=os.getenv('BIRR_LINK_SECRET_KEY'),
    environment='sandbox'  # Use 'production' for live transactions
)
```

### Java
```java
import com.birrlink.BirrLink;

BirrLink client = new BirrLink(
    System.getenv("BIRR_LINK_SECRET_KEY"), 
    Environment.SANDBOX
);
```

## Common Operations

### Creating a Payment

**JavaScript:**
```javascript
const payment = await client.payments.create({
  amount: 100.00,
  currency: 'ETB',
  customer: {
    email: 'customer@example.com',
    phone: '+251912345678'
  },
  description: 'Payment for order #12345'
});

console.log('Payment created:', payment.id);
```

**Python:**
```python
payment = client.payments.create({
    'amount': 100.00,
    'currency': 'ETB',
    'customer': {
        'email': 'customer@example.com',
        'phone': '+251912345678'
    },
    'description': 'Payment for order #12345'
})

print(f'Payment created: {payment["id"]}')
```

**Java:**
```java
Map<String, Object> customer = new HashMap<>();
customer.put("email", "customer@example.com");
customer.put("phone", "+251912345678");

Map<String, Object> paymentData = new HashMap<>();
paymentData.put("amount", 100.00);
paymentData.put("currency", "ETB");
paymentData.put("customer", customer);
paymentData.put("description", "Payment for order #12345");

Map<String, Object> payment = client.payments.create(paymentData);
System.out.println("Payment created: " + payment.get("id"));
```

### Retrieving a Payment

**JavaScript:**
```javascript
const payment = await client.payments.get('pay_123456789');
console.log('Payment status:', payment.status);
```

**Python:**
```python
payment = client.payments.get('pay_123456789')
print(f'Payment status: {payment["status"]}')
```

## Error Handling

All SDKs provide consistent error handling:

**JavaScript:**
```javascript
try {
  const payment = await client.payments.create(paymentData);
} catch (error) {
  if (error.type === 'validation_error') {
    console.error('Validation error:', error.message);
    console.error('Invalid fields:', error.details);
  } else if (error.type === 'authentication_error') {
    console.error('Authentication failed');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

**Python:**
```python
try:
    payment = client.payments.create(payment_data)
except BirrLinkError as e:
    if e.type == 'validation_error':
        print(f'Validation error: {e.message}')
        print(f'Invalid fields: {e.details}')
    elif e.type == 'authentication_error':
        print('Authentication failed')
    else:
        print(f'Unexpected error: {e.message}')
```

## Configuration Options

### Timeout Settings

**JavaScript:**
```javascript
const client = new BirrLink({
  apiKey: process.env.BIRR_LINK_SECRET_KEY,
  timeout: 30000, // 30 seconds
  environment: 'sandbox'
});
```

**Python:**
```python
client = BirrLink(
    api_key=os.getenv('BIRR_LINK_SECRET_KEY'),
    timeout=30,  # 30 seconds
    environment='sandbox'
)
```

### Custom Base URL

For testing or special configurations:

**JavaScript:**
```javascript
const client = new BirrLink({
  apiKey: process.env.BIRR_LINK_SECRET_KEY,
  baseUrl: 'https://custom-api.birrlink.et',
  environment: 'sandbox'
});
```

## Webhook Helper Functions

SDKs include utilities to help verify webhook signatures:

**JavaScript:**
```javascript
const isValid = client.webhooks.verify(
  rawBody,
  signatureHeader,
  secret
);

if (isValid) {
  // Process webhook
}
```

**Python:**
```python
is_valid = client.webhooks.verify(
    raw_body,
    signature_header,
    secret
)

if is_valid:
    # Process webhook
```

## Versioning and Updates

### Checking SDK Version

**JavaScript:**
```javascript
console.log('BirrLink SDK Version:', client.version);
```

**Python:**
```python
print(f'BirrLink SDK Version: {client.version}')
```

### Keeping SDKs Updated

Regularly update your SDKs to get the latest features and security patches. Check the release notes before upgrading to understand any breaking changes.

## Community Contributions

The source code for official SDKs is available on GitHub. Contributions are welcome:

- Bug reports and fixes
- Feature requests and implementations
- Documentation improvements
- Sample code and examples

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure API key is correctly configured
2. **Network Errors**: Check your network connection and firewall settings
3. **SSL/TLS Issues**: Ensure your environment has up-to-date certificates
4. **Rate Limiting**: Implement appropriate retry logic with exponential backoff

### Enable Debugging

Most SDKs support debug logging:

**JavaScript:**
```javascript
const client = new BirrLink({
  apiKey: process.env.BIRR_LINK_SECRET_KEY,
  debug: true
});
```

**Python:**
```python
client = BirrLink(
    api_key=os.getenv('BIRR_LINK_SECRET_KEY'),
    debug=True
)
```

For more details on specific SDK usage, check the language-specific documentation.