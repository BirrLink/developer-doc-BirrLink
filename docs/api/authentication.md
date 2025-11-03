---
sidebar_position: 2
---

# API Authentication

All BirrLink API requests require authentication using your secret API key. This ensures that only authorized parties can access your account data and initiate transactions.

## Getting Your API Keys

You can find your API keys in your [BirrLink Dashboard](https://dashboard.birrlink.et):

1. Log in to your BirrLink merchant account
2. Navigate to **Settings** → **API Keys**
3. You'll find both test and live keys

> **Important**: Keep your API keys secure and never expose them in client-side code or public repositories.

## Authentication Header

Include your secret API key in the `Authorization` header of each request:

```
Authorization: Bearer YOUR_SECRET_API_KEY
```

### Example

```bash
curl https://api.birrlink.et/v1/payments \
  -H "Authorization: Bearer sk_test_1234567890" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "currency": "ETB",
    "description": "Payment for order #12345"
  }'
```

## Environment Keys

BirrLink provides separate API keys for different environments:

- **Test keys** (start with `sk_test_`): For use in sandbox environments
- **Live keys** (start with `sk_live_`): For use in production

Using test keys in the production environment (or vice versa) will result in authentication errors.

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** to store API keys
3. **Implement proper access control** for who can access your API keys
4. **Rotate keys regularly** for enhanced security
5. **Monitor API usage** for unusual activity

### Using Environment Variables

Store your API keys as environment variables in your application:

**Node.js:**
```javascript
const birrlink = require('@birrlink/sdk');

const birrlinkClient = new birrlink({
  apiKey: process.env.BIRR_LINK_SECRET_KEY,
  environment: 'production'
});
```

**Python:**
```python
import os
from birrlink import BirrLink

client = BirrLink(
    api_key=os.getenv('BIRR_LINK_SECRET_KEY'),
    environment='production'
)
```

## API Key Permissions

Your API keys have permissions based on your account role:

- **Admin**: Full access to all API endpoints
- **Developer**: Access to create and view transactions
- **Read-only**: Access to view only

Contact your account administrator to change your permissions if needed.