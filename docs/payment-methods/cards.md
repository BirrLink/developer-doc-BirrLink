---
sidebar_position: 3
---

# Card Integration

BirrLink supports credit and debit card payments from major card networks. This includes local Ethiopian cards as well as international cards.

## Supported Card Networks

- **Ethnicard**: Local Ethiopian bank cards
- **Visa**: International and local Visa cards
- **Mastercard**: International and local Mastercard cards

## Integration Process

### 1. Create Payment Request

To initiate a card payment, create a payment request with the required information:

```json
{
  "amount": 100.00,
  "currency": "ETB",
  "payment_method": "card",
  "card": {
    "number": "4111111111111111",
    "expiry_month": "12",
    "expiry_year": "2027",
    "cvv": "123",
    "holder_name": "John Doe"
  },
  "customer": {
    "email": "john@example.com",
    "phone": "+251912345678"
  },
  "description": "Payment for order #12345"
}
```

> **Important**: Card details should be collected via our secure client-side SDK to remain PCI DSS compliant.

### 2. Secure Card Collection

For security reasons, never send raw card details to your server. Instead, use one of our client-side SDKs:

**JavaScript:**
```html
<form id="payment-form">
  <div id="card-element">
    <!-- Card element will be inserted here -->
  </div>
  <button type="submit">Pay Now</button>
</form>

<script>
  const elements = birrlink.elements();
  const cardElement = elements.create('card');
  cardElement.mount('#card-element');

  const form = document.getElementById('payment-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const {token, error} = await birrlink.createToken(cardElement);

    if (error) {
      // Show error to customer
      console.error('Card validation error:', error.message);
    } else {
      // Send token to your server to create payment
      createPayment(token.id);
    }
  });
</script>
```

### 3. Server-Side Processing

After obtaining a card token, process the payment on your server:

**JavaScript (Node.js):**
```javascript
const payment = await birrlink.payments.create({
  amount: 100.00,
  currency: 'ETB',
  source: token_id, // Use the token ID received from the frontend
  description: 'Payment for order #12345'
});
```

**Python:**
```python
payment = client.payments.create({
    'amount': 100.00,
    'currency': 'ETB',
    'source': token_id,  # Use the token ID received from the frontend
    'description': 'Payment for order #12345'
})
```

## Card Verification

### Client-Side Validation
- Card number format
- Expiry date validity
- CVV format (3-4 digits)

### Server-Side Verification
- Card authentication with issuing bank
- 3D Secure authentication for international cards
- Risk assessment checks

## Security Requirements

### PCI DSS Compliance
When handling card data, ensure compliance with PCI DSS standards:

- Never store full card numbers
- Use tokenization for card data
- Encrypt all card data in transit
- Implement secure storage for tokens

### 3D Secure Authentication
For international cards and high-risk transactions, 3D Secure authentication may be required:

- Customer will be redirected to their bank's authentication page
- Provides additional security and reduces fraud risk
- May impact conversion rates slightly

## Error Handling

Common card payment errors include:

- `card_declined`: Card was declined by issuing bank
- `insufficient_funds`: Customer has insufficient balance
- `invalid_card`: Card details are invalid
- `processing_error`: Error during processing
- `card_not_supported`: Card type not supported
- `three_d_secure_required`: 3D Secure authentication required

## Testing Card Payments

Use test card numbers provided by card networks:

**Visa Test Cards:**
- `4111111111111111`
- `4242424242424242`
- `4000056655665556`

**Mastercard Test Cards:**
- `5555555555554444`
- `5200828282828210`
- `5105105105105100`

**Ethnicard Test Cards:**
- `376008000000000`

## Best Practices

### User Experience
- Collect only necessary card information
- Implement real-time validation
- Provide clear error messages
- Use auto-formatting for card numbers
- Minimize form fields required

### Security
- Use HTTPS for all payment pages
- Implement client-side validation
- Never log card numbers
- Regularly update security certificates
- Monitor for suspicious activity

### Performance
- Implement proper error handling
- Cache static card assets
- Use optimized client libraries
- Test across different browsers

## Transaction Flows

### Standard Card Payment
1. Customer enters card details in secure form
2. Card is tokenized via client SDK
3. Token is sent to your server
4. Payment is created via BirrLink API
5. Card is charged with issuing bank
6. Result is returned to your application

### 3D Secure Card Payment
1. Customer enters card details in secure form
2. Card is tokenized via client SDK
3. Payment is initiated
4. Customer is redirected for authentication
5. Bank authenticates customer
6. Payment is completed
7. Customer is redirected back