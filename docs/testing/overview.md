---
sidebar_position: 1
---

# Testing & Sandbox Overview

Testing is a critical part of integrating with BirrLink. Our sandbox environment provides a safe space to test your integration without processing real transactions.

## Sandbox Environment

The BirrLink sandbox environment is a complete replica of our production system, designed specifically for testing:

- **Base URL**: `https://sandbox.birrlink.et/api/v1`
- **API Keys**: Different from production keys
- **Test Data**: All data exists only in the sandbox
- **No Real Money**: Transactions don't involve actual funds

## Getting Sandbox Credentials

To access the sandbox environment:

1. Register for a BirrLink merchant account
2. Navigate to your [Dashboard](https://dashboard.birrlink.et)
3. Switch to the **Sandbox** environment
4. Find your test API keys under **Settings** → **API Keys**

## Test Credentials

### Mobile Money Test Credentials

**Telebirr:**
- Phone: `+251900000000`
- PIN: `1234`

**CBE Birr:**
- Phone: `+251900000001`
- PIN: `5678`

### Card Test Numbers

**Visa:**
- `4111111111111111`
- `4242424242424242`
- `4000056655665556`

**Mastercard:**
- `5555555555554444`
- `5200828282828210`
- `5105105105105100`

**Ethnicard:**
- `376008000000000`

### Test Scenarios

You can use special card numbers to simulate different scenarios:

- **Successful payment**: `4242424242424242`
- **Insufficient funds**: `4000000000009995`
- **Card declined**: `4000000000000002`
- **Processing error**: `4000000000000119`

## Testing Best Practices

### 1. Start Simple
Begin with basic payment creation to verify your integration works:

```javascript
// Test with minimal payment data
const testPayment = await client.payments.create({
  amount: 10.00,  // Small amount for testing
  currency: 'ETB',
  description: 'Test payment',
  customer: {
    email: 'test@example.com',
    phone: '+251900000000'  // Use test phone number for mobile money
  },
  payment_method: 'mobile_money'
});
```

### 2. Test Error Scenarios
Ensure your application handles errors gracefully:

```javascript
try {
  // Try to create a payment with invalid data
  const payment = await client.payments.create({
    amount: -10.00,  // Invalid negative amount
    currency: 'ETB',
    customer: {
      email: 'invalid-email'  // Invalid email format
    }
  });
} catch (error) {
  console.log('Error caught:', error.message);
  // Verify your error handling logic works correctly
}
```

### 3. Webhook Testing
Test webhook delivery and processing:

```javascript
// Simulate webhook events in the dashboard or with API
const testEvent = {
  id: 'evt_test_123456789',
  type: 'payment.completed',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'pay_test_987654321',
      status: 'completed',
      amount: 10.00,
      currency: 'ETB',
      description: 'Test webhook payment'
    }
  }
};

// Send the test event to your webhook endpoint
// Verify your application processes it correctly
```

## Test Data Guidelines

### Customer Information
- Use test email addresses: `test@example.com`, `user@example.org`
- Use test phone numbers: `+251900000000` to `+251900000009`
- Avoid using real personal information

### Amounts
- Start with small amounts (1-10 ETB)
- Test boundary values (minimum, maximum)
- Test decimal precision (e.g., 10.99 ETB)

## Environment Switching

Make your application configurable to switch between environments:

```javascript
const isProduction = process.env.NODE_ENV === 'production';
const birrlink = new BirrLink({
  apiKey: isProduction 
    ? process.env.BIRR_LINK_LIVE_KEY 
    : process.env.BIRR_LINK_TEST_KEY,
  environment: isProduction ? 'production' : 'sandbox'
});
```

## Testing Checklist

### Before Going Live

- [ ] All API endpoints tested with valid data
- [ ] Error handling tested with invalid data
- [ ] Webhook endpoints tested with various event types
- [ ] Mobile money flows tested with different providers
- [ ] Card payment flows tested including 3D Secure
- [ ] Refund operations tested
- [ ] Customer management tested
- [ ] Rate limits handled appropriately
- [ ] Security measures implemented (webhook verification, etc.)

### Integration Tests

Create comprehensive integration tests:

```javascript
describe('BirrLink Integration', () => {
  test('should create a payment successfully', async () => {
    const payment = await client.payments.create({
      amount: 10.00,
      currency: 'ETB',
      description: 'Test payment'
    });
    
    expect(payment.status).toBe('pending');
    expect(payment.amount).toBe(10.00);
  });
  
  test('should handle validation errors', async () => {
    await expect(
      client.payments.create({
        amount: -10.00,  // Invalid negative amount
        currency: 'ETB'
      })
    ).rejects.toThrow();
  });
});
```

## Debugging Tips

### Enable Debug Logging
Most SDKs support debug mode:

```javascript
const client = new BirrLink({
  apiKey: process.env.BIRR_LINK_TEST_KEY,
  environment: 'sandbox',
  debug: true  // Enable detailed logging
});
```

### Log Important Information
Keep detailed logs during testing:

```javascript
console.log('Payment request:', paymentData);
const payment = await client.payments.create(paymentData);
console.log('Payment response:', payment);
```

## Support During Testing

If you encounter issues during testing:

- Check the [API Reference](../api/overview) for correct parameter formats
- Review your webhook logs for delivery issues
- Verify your authentication credentials
- Contact our [support team](mailto:support@birrlink.et) with specific details about the issue

Remember: The sandbox environment is designed to mirror production exactly, so if your integration works correctly in sandbox, it should work in production too.