---
sidebar_position: 3
---

# Python SDK

The BirrLink Python SDK provides a simple interface to interact with the BirrLink API for Python applications.

## Installation

```bash
pip install birrlink-sdk
```

## Initialization

```python
from birrlink import BirrLink

client = BirrLink(
    api_key=os.getenv('BIRR_LINK_SECRET_KEY'),
    environment='sandbox'  # Use 'production' for live transactions
)
```

## Configuration Options

```python
client = BirrLink(
    api_key='sk_test_1234567890',
    environment='sandbox',  # 'sandbox' or 'production'
    timeout=30,  # Request timeout in seconds (default: 30)
    max_retries=3,  # Number of retry attempts (default: 3)
    base_url='https://api.birrlink.et/v1'  # Override base URL if needed
)
```

## Payment Operations

### Create Payment
```python
try:
    payment = client.payments.create({
        'amount': 100.00,
        'currency': 'ETB',
        'payment_method': 'mobile_money',
        'customer': {
            'email': 'customer@example.com',
            'phone': '+251912345678'
        },
        'description': 'Payment for order #12345',
        'callback_url': 'https://yourwebsite.com/payment-callback'
    })
    
    print(f'Payment created: {payment["id"]}')
    print(f'Payment status: {payment["status"]}')
except BirrLinkError as e:
    if e.type == 'validation_error':
        print(f'Validation failed: {e.details}')
    else:
        print(f'Payment creation failed: {e.message}')
```

### Retrieve Payment
```python
try:
    payment = client.payments.get('pay_123456789')
    print(f'Payment status: {payment["status"]}')
except BirrLinkError as e:
    print(f'Failed to retrieve payment: {e.message}')
```

### List Payments
```python
try:
    payments = client.payments.list(limit=10, offset=0, status='completed')
    
    print(f'Found {len(payments["data"])} payments')
except BirrLinkError as e:
    print(f'Failed to list payments: {e.message}')
```

## Customer Operations

### Create Customer
```python
try:
    customer = client.customers.create({
        'email': 'customer@example.com',
        'phone': '+251912345678',
        'name': 'John Doe',
        'metadata': {
            'customer_type': 'individual'
        }
    })
    
    print(f'Customer created: {customer["id"]}')
except BirrLinkError as e:
    print(f'Customer creation failed: {e.message}')
```

### Update Customer
```python
try:
    customer = client.customers.update('cus_123456789', {
        'email': 'newemail@example.com',
        'phone': '+251987654321'
    })
    
    print(f'Customer updated: {customer["id"]}')
except BirrLinkError as e:
    print(f'Customer update failed: {e.message}')
```

## Refund Operations

### Create Refund
```python
try:
    refund = client.refunds.create({
        'payment_id': 'pay_123456789',
        'amount': 50.00,
        'reason': 'Customer request'
    })
    
    print(f'Refund created: {refund["id"]}')
except BirrLinkError as e:
    print(f'Refund creation failed: {e.message}')
```

## Webhook Verification

Verify webhook signatures to ensure authenticity:

```python
from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/webhooks/birrlink', methods=['POST'])
def webhook_handler():
    payload = request.get_data()
    signature = request.headers.get('BirrLink-Signature')
    
    try:
        event = client.webhooks.construct_event(
            payload,
            signature,
            os.getenv('WEBHOOK_SECRET')
        )
        
        # Process the event
        if event['type'] == 'payment.completed':
            print('Payment completed')
        elif event['type'] == 'payment.failed':
            print('Payment failed')
        else:
            print(f'Unhandled event type: {event["type"]}')
        
        return 'OK', 200
    except BirrLinkError as e:
        print(f'Webhook verification failed: {e.message}')
        return 'Invalid signature', 400
```

## Error Handling

The SDK provides detailed error information:

```python
try:
    payment = client.payments.create(payment_data)
except ValidationError as e:
    print(f'Validation error: {e.message}')
    print(f'Invalid fields: {e.details}')
except AuthenticationError as e:
    print(f'Authentication failed: {e.message}')
except CardError as e:
    print(f'Card processing error: {e.message}')
    print(f'Card code: {e.code}')
except PaymentError as e:
    print(f'Payment error: {e.message}')
except BirrLinkError as e:
    print(f'Unexpected error: {e.message}')
```

## Asynchronous Operations

The Python SDK also supports async operations using aiohttp:

```python
import asyncio
from birrlink import AsyncBirrLink

async def async_example():
    client = AsyncBirrLink(
        api_key=os.getenv('BIRR_LINK_SECRET_KEY'),
        environment='sandbox'
    )
    
    try:
        payment = await client.payments.create({
            'amount': 100.00,
            'currency': 'ETB',
            'description': 'Async payment'
        })
        
        print(f'Async payment created: {payment["id"]}')
    except BirrLinkError as e:
        print(f'Async payment failed: {e.message}')
    finally:
        await client.close()  # Close the async client

# Run the async example
asyncio.run(async_example())
```

## Custom Requests

For advanced use cases, you can make custom API requests:

```python
try:
    response = client.request(
        method='GET',
        path='/custom-endpoint',
        data={'param': 'value'}
    )
    
    print(f'Custom response: {response}')
except BirrLinkError as e:
    print(f'Custom request failed: {e.message}')
```

## Version Information

Check the SDK version:

```python
print(f'SDK Version: {client.version}')
```

## Environment Variables

Recommended approach for storing credentials:

```python
from birrlink import BirrLink
import os

client = BirrLink(
    api_key=os.getenv('BIRR_LINK_SECRET_KEY'),
    environment='production' if os.getenv('ENVIRONMENT') == 'production' else 'sandbox'
)
```

## Testing Considerations

When testing, use test API keys and enable debug mode:

```python
client = BirrLink(
    api_key=os.getenv('BIRR_LINK_TEST_KEY'),
    environment='sandbox',
    debug=True  # Enable debug logging
)
```

## Django Integration

For Django applications, you can integrate the SDK in your views:

```python
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["POST"])
def create_payment(request):
    try:
        data = json.loads(request.body)
        
        payment = client.payments.create({
            'amount': data['amount'],
            'currency': data['currency'],
            'description': data['description']
        })
        
        return JsonResponse({'payment': payment})
    except BirrLinkError as e:
        return JsonResponse({'error': str(e)}, status=400)

# In your Django settings, make sure to add the webhook URL to allowed hosts
# if you're receiving webhooks
```

## Flask Integration

For Flask applications:

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/create-payment', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()
        
        payment = client.payments.create({
            'amount': data['amount'],
            'currency': data['currency'],
            'description': data['description']
        })
        
        return jsonify({'payment': payment})
    except BirrLinkError as e:
        return jsonify({'error': str(e)}), 400
```

For comprehensive testing, use the SDK in combination with BirrLink's sandbox environment to simulate various payment scenarios without real money transfers.