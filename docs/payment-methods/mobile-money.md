---
sidebar_position: 2
---

# Mobile Money Integration

Mobile money is the most popular payment method in Ethiopia. BirrLink supports integration with major mobile money providers including Telebirr, CBE Birr, and others.

## Supported Providers

- **Telebirr**: Ethiopia's national mobile money service
- **CBE Birr**: Commercial Bank of Ethiopia's mobile money platform
- **Awash**: Awash International Bank's mobile money service
- **Hibret**: Hibret Bank's mobile money solution
- **Dashen**: Dashen Bank's mobile money service

## Integration Process

### 1. Create Payment Request

To initiate a mobile money payment, create a payment request with the required information:

```json
{
  "amount": 100.00,
  "currency": "ETB",
  "payment_method": "mobile_money",
  "customer": {
    "phone": "+251912345678"
  },
  "description": "Payment for order #12345",
  "mobile_money_provider": "telebirr"
}
```

### 2. Payment Initiation

The payment flow for mobile money typically involves:

1. Your application sends payment request to BirrLink
2. BirrLink forwards to the selected mobile money provider
3. Customer receives SMS/USSD prompt to confirm payment
4. Mobile money provider processes the transaction
5. Status is updated in real-time

### 3. Handling Payment Responses

Mobile money payments may have different statuses:

- `pending`: Payment initiated, waiting for customer confirmation
- `processing`: Customer has confirmed, payment being processed
- `completed`: Payment successfully completed
- `failed`: Payment failed due to various reasons (insufficient funds, etc.)
- `cancelled`: Customer declined or timed out

## Webhook Notifications

Mobile money transactions send webhook notifications with the following event types:

- `mobile_money.pending`: Payment initiated
- `mobile_money.processing`: Customer confirmed payment
- `mobile_money.completed`: Funds transferred successfully
- `mobile_money.failed`: Payment failed

## Error Handling

Common mobile money errors include:

- `insufficient_funds`: Customer has insufficient balance
- `invalid_phone`: Phone number format is invalid
- `provider_unavailable`: Mobile money provider temporarily unavailable
- `customer_declined`: Customer declined the payment request

## Testing Mobile Money

For testing purposes, use the sandbox environment with test credentials provided by each mobile money provider:

**Telebirr Test Credentials:**
- Phone: `+251900000000`
- PIN: `1234`

**CBE Birr Test Credentials:**
- Phone: `+251900000001`
- PIN: `5678`

## Best Practices

### User Experience
- Clearly indicate that customer action is required (SMS/USSD confirmation)
- Provide estimated time for completion
- Allow customers to cancel pending payments
- Show clear instructions for the confirmation process

### Error Handling
- Provide user-friendly error messages
- Implement retry logic for temporary failures
- Log transaction IDs for troubleshooting
- Handle partial failures gracefully

### Security
- Validate phone numbers before initiating payments
- Never store sensitive mobile money information
- Implement rate limiting to prevent abuse
- Monitor for suspicious transaction patterns

## Provider-Specific Considerations

### Telebirr
- Minimum transaction amount: 1 ETB
- Maximum transaction amount: 20,000 ETB
- Daily limit: 50,000 ETB per customer
- Confirmation timeout: 10 minutes

### CBE Birr
- Minimum transaction amount: 1 ETB
- Maximum transaction amount: 15,000 ETB
- Daily limit: 30,000 ETB per customer
- Confirmation timeout: 15 minutes

### Other Providers
Each provider has different limits and requirements. Check the provider's API documentation for specific details.