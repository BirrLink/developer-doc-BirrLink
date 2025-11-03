---
sidebar_position: 2
---

# Sandbox Testing

The BirrLink sandbox environment is a complete, isolated replica of our production system. It allows you to develop and test your integration without processing real transactions or affecting live data.

## Accessing the Sandbox

### API Credentials
- Sandbox API keys are different from your production keys
- Find your sandbox credentials in the [BirrLink Dashboard](https://dashboard.birrlink.et) under the Sandbox section
- Test keys follow the format `sk_test_...` and `pk_test_...`

### Base URLs
- **API**: `https://sandbox.birrlink.et/api/v1`
- **Payment Pages**: `https://pay.sandbox.birrlink.et`
- **Dashboard**: `https://dashboard.sandbox.birrlink.et`

## Setting up Your Application

### Environment Configuration
Configure your application to work with the sandbox:

**JavaScript/Node.js:**
```javascript
const BirrLink = require('@birrlink/sdk');

const client = new BirrLink({
  apiKey: process.env.BIRR_LINK_TEST_KEY,
  environment: 'sandbox'
});
```

**Python:**
```python
from birrlink import BirrLink

client = BirrLink(
    api_key=os.getenv('BIRR_LINK_TEST_KEY'),
    environment='sandbox'
)
```

**Java:**
```java
import com.birrlink.BirrLink;
import com.birrlink.Environment;

BirrLink client = new BirrLink(
    System.getenv("BIRR_LINK_TEST_KEY"),
    Environment.SANDBOX
);
```

## Testing Payment Flows

### Mobile Money Testing
When testing mobile money payments in sandbox, use these test credentials:

**Telebirr Test Flow:**
```javascript
const payment = await client.payments.create({
  amount: 10.00,
  currency: 'ETB',
  payment_method: 'mobile_money',
  mobile_money_provider: 'telebirr',
  customer: {
    phone: '+251900000000'  // Use test phone number
  },
  description: 'Telebirr test payment'
});
```

- Phone: `+251900000000`
- PIN: `1234`
- The sandbox will automatically complete the payment without requiring actual confirmation

**CBE Birr Test Flow:**
```javascript
const payment = await client.payments.create({
  amount: 15.50,
  currency: 'ETB',
  payment_method: 'mobile_money',
  mobile_money_provider: 'cbe_birr',
  customer: {
    phone: '+251900000001'  // Use CBE test phone number
  },
  description: 'CBE Birr test payment'
});
```

- Phone: `+251900000001`
- PIN: `5678`

### Card Payment Testing
For card payments, use these test card numbers:

```javascript
const payment = await client.payments.create({
  amount: 25.99,
  currency: 'ETB',
  payment_method: 'card',
  card: {
    number: '4242424242424242',  // Visa test card
    expiry_month: '12',
    expiry_year: '2027',
    cvv: '123',
    holder_name: 'Test User'
  },
  description: 'Card test payment'
});
```

### Test Card Numbers
- `4242424242424242` - Standard Visa (valid)
- `4000056655665556` - Visa with specific decline codes
- `5555555555554444` - Mastercard
- `376008000000000` - Ethnicard

## Simulating Different Scenarios

### Successful Payments
Use standard test card numbers to simulate successful transactions:
- `4242424242424242`
- `5555555555554444`

### Failed Payments
To test error handling, use these card numbers:

```javascript
// Card declined
const declinedPayment = await client.payments.create({
  amount: 20.00,
  currency: 'ETB',
  card: {
    number: '4000000000000002',  // Card will be declined
    expiry_month: '12',
    expiry_year: '2027',
    cvv: '123'
  }
});

// Insufficient funds
const insufficientFundsPayment = await client.payments.create({
  amount: 50.00,
  currency: 'ETB',
  card: {
    number: '4000000000009995',  // Insufficient funds
    expiry_month: '12',
    expiry_year: '2027',
    cvv: '123'
  }
});
```

### Testing Different Payment Statuses
The sandbox allows you to test different payment lifecycle events:

```javascript
// Create a payment
const payment = await client.payments.create({
  amount: 10.00,
  currency: 'ETB',
  payment_method: 'mobile_money',
  customer: {
    phone: '+251900000000'
  },
  description: 'Test payment status flow'
});

// Check initial status
console.log('Initial status:', payment.status);  // Should be 'pending'

// In sandbox, status updates may happen immediately based on your test scenario
const updatedPayment = await client.payments.get(payment.id);
console.log('Updated status:', updatedPayment.status);
```

## Webhook Testing

### Simulating Webhook Events
The sandbox environment allows you to trigger webhook events manually:

**Via Dashboard:**
1. Navigate to **Sandbox Dashboard** → **Webhooks**
2. Click "Test Webhook"
3. Select the event type and provide parameters
4. The event will be sent to your registered webhook URL

**Via API:**
```javascript
// Trigger a test webhook event
const testEvent = await client.webhooks.test({
  url: 'https://yourwebhook.com/birrlink',
  event: 'payment.completed',
  payload: {
    id: 'pay_test_123456789',
    status: 'completed',
    amount: 10.00,
    currency: 'ETB'
  }
});
```

### Testing Webhook Reliability
Test your webhook endpoint's ability to handle:

- Duplicate events (the sandbox may send the same event multiple times)
- Out-of-order events
- Invalid signatures
- Slow response times
- Errors and retries

```javascript
// Test webhook with simulated delay
app.post('/webhooks/birrlink', express.raw({type: 'application/json'}), async (req, res) => {
  // Simulate processing delay to test timeout handling
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  try {
    const event = JSON.parse(req.body);
    // Process webhook normally
    res.status(200).send('OK');
  } catch (error) {
    res.status(400).send('Invalid');
  }
});
```

## Sandbox Limitations

### Differences from Production
- No real monetary transactions
- Test credentials are used instead of real customer information
- Some advanced fraud detection may be simplified or disabled
- Rate limits may differ from production

### Data Persistence
- Sandbox data is regularly cleaned and reset
- Do not rely on sandbox data for long-term storage
- Sandbox data is completely separate from production

## Best Practices for Sandbox Testing

### 1. Comprehensive Scenario Testing
Test all possible scenarios in the sandbox:

```javascript
// Test different amount ranges
const amounts = [1.00, 10.50, 100.00, 999.99];
for (const amount of amounts) {
  const payment = await client.payments.create({
    amount: amount,
    currency: 'ETB',
    customer: { email: 'test@example.com' },
    description: `Test payment for ${amount} ETB`
  });
  console.log(`Payment for ${amount} ETB: ${payment.status}`);
}
```

### 2. Error Handling Validation
Ensure your error handling works correctly:

```javascript
const testCases = [
  { amount: -10.00, expectedError: 'validation_error' },
  { card: { number: 'invalid' }, expectedError: 'invalid_card' },
  { amount: 0, expectedError: 'validation_error' }
];

for (const testCase of testCases) {
  try {
    await client.payments.create(testCase);
    console.error(`Expected error but got success for: ${JSON.stringify(testCase)}`);
  } catch (error) {
    if (error.type === testCase.expectedError) {
      console.log(`Correctly handled: ${testCase.expectedError}`);
    } else {
      console.error(`Unexpected error type: ${error.type}`);
    }
  }
}
```

### 3. Edge Case Testing
Test with edge cases:

```javascript
// Maximum amount
const maxPayment = await client.payments.create({
  amount: 999999.99,  // Maximum possible amount
  currency: 'ETB',
  customer: { email: 'test@example.com' },
  description: 'Max amount test'
});

// Minimum amount
const minPayment = await client.payments.create({
  amount: 0.01,  // Minimum possible amount
  currency: 'ETB',
  customer: { email: 'test@example.com' },
  description: 'Min amount test'
});
```

### 4. Integration Testing
Test your complete integration flow:

```javascript
// Full payment flow test
async function completePaymentFlow() {
  // Create customer
  const customer = await client.customers.create({
    email: 'test@example.com',
    phone: '+251900000000',
    name: 'Test Customer'
  });
  
  // Create payment
  const payment = await client.payments.create({
    amount: 25.00,
    currency: 'ETB',
    customer: { id: customer.id },
    description: 'Complete flow test'
  });
  
  // Verify payment was created
  expect(payment.status).toBe('pending');
  
  // Retrieve payment details
  const retrievedPayment = await client.payments.get(payment.id);
  console.log('Payment retrieved successfully:', retrievedPayment.id);
  
  return retrievedPayment;
}
```

## Troubleshooting Sandbox Issues

### Common Problems
1. **Authentication Errors**: Verify you're using test API keys, not live keys
2. **Invalid Parameter Errors**: Check the API documentation for correct formats
3. **Webhook Delivery Issues**: Ensure your webhook URL is accessible and returns 200

### Debugging Tips
1. Enable logging in your SDK
2. Check your request/response headers
3. Verify timestamp and signature calculations for webhooks
4. Use the sandbox dashboard logs to troubleshoot

## Transitioning to Production

Before moving to production:

1. Update API keys to live credentials
2. Change base URL from sandbox to production
3. Update webhook URLs to production endpoints
4. Test with real payment methods in a limited way
5. Ensure all error handling works with real scenarios

Remember that the sandbox environment is designed to match production as closely as possible, so if your integration works correctly in sandbox, it should work in production as well.