---
sidebar_position: 1
---

# Payment Methods Overview

BirrLink supports multiple payment methods tailored for the Ethiopian market. This section provides details about each supported payment method.

## Supported Payment Methods

### Mobile Money
- **Telebirr**: Ethiopia's national mobile money service
- **CBE Birr**: Commercial Bank of Ethiopia's mobile money platform
- **Awash**: Awash International Bank's mobile money service
- **Hibret**: Hibret Bank's mobile money solution
- **Dashen**: Dashen Bank's mobile money service

### Cards
- **Visa**: International and local Visa cards
- **Mastercard**: International and local Mastercard cards
- **Ethnicard**: Local Ethiopian bank cards

### Bank Transfers
- Direct transfers from Ethiopian banks
- Inter-bank transfers via BirrLink

## Choosing the Right Payment Method

When integrating, consider the following factors:

- **Customer Demographics**: Mobile money is most popular in Ethiopia
- **Transaction Limits**: Each payment method has different limits
- **Processing Time**: Some methods are instant, others may take time
- **Fees**: Different payment methods have different fee structures

## Integration Considerations

### Mobile Money
- Requires customer phone number
- May require customer confirmation via SMS/USSD
- Processing time is typically 10-30 seconds
- Higher success rates in rural areas

### Cards
- Requires card number, expiry date, and CVV
- May require 3D Secure authentication for international cards
- Processing time is typically instant
- Lower success rates for international cards due to restrictions

## Security Requirements

Each payment method has specific security requirements:

- **PCI DSS compliance** for card transactions
- **Mobile number validation** for mobile money
- **Two-factor authentication** for high-value transactions
- **Rate limiting** based on payment method

## Regional Considerations

- Mobile money is the dominant payment method in Ethiopia
- Card payments are more common in urban areas
- Different mobile money providers may have varying coverage
- Consider offering multiple payment options for maximum reach

## Transaction Flows

### Standard Flow
1. Customer selects payment method
2. Payment request is sent to BirrLink
3. BirrLink processes with the payment provider
4. Result is returned to your application

### Mobile Money Flow
1. Customer enters phone number
2. Payment request is sent to mobile money provider
3. Customer receives confirmation SMS/USSD
4. Payment is processed after customer confirmation
5. Result is returned to your application

## Testing Payment Methods

Each payment method should be tested in the sandbox environment with test credentials provided for each payment provider. The test credentials simulate real-world scenarios without actual money transfers.