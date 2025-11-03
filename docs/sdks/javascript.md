---
sidebar_position: 2
---

# JavaScript SDK

The BirrLink JavaScript SDK provides a simple interface to interact with the BirrLink API. It includes both server-side Node.js functionality and client-side browser components.

## Installation

### Node.js
```bash
npm install @birrlink/sdk
```

### Browser
```html
<script src="https://cdn.birrlink.et/sdk/v1/birrlink.min.js"></script>
```

## Initialization

### Server-Side (Node.js)
```javascript
const BirrLink = require('@birrlink/sdk');

const client = new BirrLink({
  apiKey: process.env.BIRR_LINK_SECRET_KEY,
  environment: 'sandbox' // Use 'production' for live transactions
});
```

### Client-Side (Browser)
```javascript
// Only for client-side components like card elements
const birrlink = BirrLink('pk_test_your_publishable_key');
```

## Configuration Options

```javascript
const client = new BirrLink({
  apiKey: 'sk_test_1234567890',
  environment: 'sandbox', // 'sandbox' or 'production'
  timeout: 30000, // Request timeout in milliseconds (default: 30000)
  maxRetries: 3, // Number of retry attempts (default: 3)
  baseUrl: 'https://api.birrlink.et/v1' // Override base URL if needed
});
```

## Payment Operations

### Create Payment
```javascript
try {
  const payment = await client.payments.create({
    amount: 100.00,
    currency: 'ETB',
    payment_method: 'mobile_money',
    customer: {
      email: 'customer@example.com',
      phone: '+251912345678'
    },
    description: 'Payment for order #12345',
    callback_url: 'https://yourwebsite.com/payment-callback'
  });
  
  console.log('Payment created:', payment.id);
  console.log('Payment status:', payment.status);
} catch (error) {
  if (error.type === 'validation_error') {
    console.error('Validation failed:', error.details);
  } else {
    console.error('Payment creation failed:', error.message);
  }
}
```

### Retrieve Payment
```javascript
try {
  const payment = await client.payments.get('pay_123456789');
  console.log('Payment status:', payment.status);
} catch (error) {
  console.error('Failed to retrieve payment:', error.message);
}
```

### List Payments
```javascript
try {
  const payments = await client.payments.list({
    limit: 10,
    offset: 0,
    status: 'completed'
  });
  
  console.log(`Found ${payments.data.length} payments`);
} catch (error) {
  console.error('Failed to list payments:', error.message);
}
```

## Customer Operations

### Create Customer
```javascript
try {
  const customer = await client.customers.create({
    email: 'customer@example.com',
    phone: '+251912345678',
    name: 'John Doe',
    metadata: {
      customer_type: 'individual'
    }
  });
  
  console.log('Customer created:', customer.id);
} catch (error) {
  console.error('Customer creation failed:', error.message);
}
```

### Update Customer
```javascript
try {
  const customer = await client.customers.update('cus_123456789', {
    email: 'newemail@example.com',
    phone: '+251987654321'
  });
  
  console.log('Customer updated:', customer.id);
} catch (error) {
  console.error('Customer update failed:', error.message);
}
```

## Refund Operations

### Create Refund
```javascript
try {
  const refund = await client.refunds.create({
    payment_id: 'pay_123456789',
    amount: 50.00,
    reason: 'Customer request'
  });
  
  console.log('Refund created:', refund.id);
} catch (error) {
  console.error('Refund creation failed:', error.message);
}
```

## Webhook Verification

Verify webhook signatures to ensure authenticity:

```javascript
// Express.js example
app.post('/webhooks/birrlink', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['birrlink-signature'];
  
  try {
    const event = client.webhooks.constructEvent(
      req.body,
      signature,
      process.env.WEBHOOK_SECRET
    );
    
    // Process the event
    switch (event.type) {
      case 'payment.completed':
        console.log('Payment completed');
        break;
      case 'payment.failed':
        console.log('Payment failed');
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook verification failed:', error.message);
    res.status(400).send('Invalid signature');
  }
});
```

## Client-Side Card Component

For secure card collection in the browser:

```html
<div id="payment-form">
  <div id="card-element">
    <!-- Card element will be inserted here -->
  </div>
  <button id="submit-btn">Pay Now</button>
</div>
```

```javascript
// Initialize elements
const elements = birrlink.elements();

// Create card element
const cardElement = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
});

// Mount card element to DOM
cardElement.mount('#card-element');

// Handle form submission
document.getElementById('submit-btn').addEventListener('click', async (event) => {
  event.preventDefault();
  
  const {token, error} = await birrlink.createToken(cardElement);
  
  if (error) {
    console.error('Card validation error:', error.message);
    // Show error to customer
  } else {
    // Send token to your server
    createPayment(token.id);
  }
});

function createPayment(tokenId) {
  // Send token to your server to create payment
  fetch('/create-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 100.00,
      currency: 'ETB',
      source: tokenId
    })
  })
  .then(response => response.json())
  .then(data => console.log('Payment created:', data));
}
```

## Error Handling

The SDK provides detailed error information:

```javascript
try {
  const payment = await client.payments.create(paymentData);
} catch (error) {
  switch (error.type) {
    case 'validation_error':
      console.error('Validation error:', error.message);
      console.error('Invalid fields:', error.details);
      break;
      
    case 'authentication_error':
      console.error('Authentication failed:', error.message);
      break;
      
    case 'card_error':
      console.error('Card processing error:', error.message);
      console.error('Card code:', error.code);
      break;
      
    case 'payment_error':
      console.error('Payment error:', error.message);
      break;
      
    default:
      console.error('Unexpected error:', error.message);
  }
}
```

## Custom Requests

For advanced use cases, you can make custom API requests:

```javascript
try {
  const response = await client.request({
    method: 'GET',
    path: '/custom-endpoint',
    data: { param: 'value' }
  });
  
  console.log('Custom response:', response);
} catch (error) {
  console.error('Custom request failed:', error.message);
}
```

## Version Information

Check the SDK version:

```javascript
console.log('SDK Version:', client.version);
```

## Environment Variables

Recommended approach for storing credentials:

```javascript
require('dotenv').config(); // If using dotenv

const client = new BirrLink({
  apiKey: process.env.BIRR_LINK_SECRET_KEY,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
});
```

## Testing Considerations

When testing, use test API keys and enable debug mode:

```javascript
const client = new BirrLink({
  apiKey: process.env.BIRR_LINK_TEST_KEY,
  environment: 'sandbox',
  debug: true // Enable debug logging
});
```

For comprehensive testing, use the SDK in combination with BirrLink's sandbox environment to simulate various payment scenarios without real money transfers.