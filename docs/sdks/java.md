---
sidebar_position: 4
---

# Java SDK

The BirrLink Java SDK provides a simple interface to interact with the BirrLink API for Java applications.

## Installation

### Maven
Add the following dependency to your `pom.xml`:

```xml
<dependency>
  <groupId>com.birrlink</groupId>
  <artifactId>sdk</artifactId>
  <version>1.0.0</version>
</dependency>
```

### Gradle
Add the following to your `build.gradle`:

```gradle
implementation 'com.birrlink:sdk:1.0.0'
```

## Initialization

```java
import com.birrlink.BirrLink;
import com.birrlink.Environment;

// Initialize with your secret key
BirrLink client = new BirrLink(
    System.getenv("BIRR_LINK_SECRET_KEY"),
    Environment.SANDBOX  // Use Environment.PRODUCTION for live transactions
);
```

## Configuration Options

```java
import com.birrlink.BirrLinkOptions;

BirrLinkOptions options = BirrLinkOptions.builder()
    .setApiKey(System.getenv("BIRR_LINK_SECRET_KEY"))
    .setEnvironment(Environment.SANDBOX)
    .setTimeout(30)  // Request timeout in seconds (default: 30)
    .setMaxRetries(3)  // Number of retry attempts (default: 3)
    .setBaseUrl("https://api.birrlink.com/v1")  // Override base URL if needed
    .build();

BirrLink client = new BirrLink(options);
```

## Payment Operations

### Create Payment
```java
import java.util.HashMap;
import java.util.Map;

try {
    Map<String, Object> customer = new HashMap<>();
    customer.put("email", "customer@example.com");
    customer.put("phone", "+251912345678");
    
    Map<String, Object> paymentData = new HashMap<>();
    paymentData.put("amount", 100.00);
    paymentData.put("currency", "ETB");
    paymentData.put("payment_method", "mobile_money");
    paymentData.put("customer", customer);
    paymentData.put("description", "Payment for order #12345");
    paymentData.put("callback_url", "https://yourwebsite.com/payment-callback");
    
    Map<String, Object> payment = client.payments().create(paymentData);
    
    System.out.println("Payment created: " + payment.get("id"));
    System.out.println("Payment status: " + payment.get("status"));
} catch (BirrLinkException e) {
    if (e.getType().equals("validation_error")) {
        System.out.println("Validation failed: " + e.getDetails());
    } else {
        System.out.println("Payment creation failed: " + e.getMessage());
    }
}
```

### Retrieve Payment
```java
try {
    Map<String, Object> payment = client.payments().get("pay_123456789");
    System.out.println("Payment status: " + payment.get("status"));
} catch (BirrLinkException e) {
    System.out.println("Failed to retrieve payment: " + e.getMessage());
}
```

### List Payments
```java
try {
    Map<String, Object> params = new HashMap<>();
    params.put("limit", 10);
    params.put("offset", 0);
    params.put("status", "completed");
    
    Map<String, Object> payments = client.payments().list(params);
    
    List<Map<String, Object>> paymentsList = (List<Map<String, Object>>) payments.get("data");
    System.out.println("Found " + paymentsList.size() + " payments");
} catch (BirrLinkException e) {
    System.out.println("Failed to list payments: " + e.getMessage());
}
```

## Customer Operations

### Create Customer
```java
try {
    Map<String, Object> customerData = new HashMap<>();
    customerData.put("email", "customer@example.com");
    customerData.put("phone", "+251912345678");
    customerData.put("name", "John Doe");
    
    Map<String, Object> metadata = new HashMap<>();
    metadata.put("customer_type", "individual");
    customerData.put("metadata", metadata);
    
    Map<String, Object> customer = client.customers().create(customerData);
    
    System.out.println("Customer created: " + customer.get("id"));
} catch (BirrLinkException e) {
    System.out.println("Customer creation failed: " + e.getMessage());
}
```

### Update Customer
```java
try {
    Map<String, Object> updateData = new HashMap<>();
    updateData.put("email", "newemail@example.com");
    updateData.put("phone", "+251987654321");
    
    Map<String, Object> customer = client.customers().update("cus_123456789", updateData);
    
    System.out.println("Customer updated: " + customer.get("id"));
} catch (BirrLinkException e) {
    System.out.println("Customer update failed: " + e.getMessage());
}
```

## Refund Operations

### Create Refund
```java
try {
    Map<String, Object> refundData = new HashMap<>();
    refundData.put("payment_id", "pay_123456789");
    refundData.put("amount", 50.00);
    refundData.put("reason", "Customer request");
    
    Map<String, Object> refund = client.refunds().create(refundData);
    
    System.out.println("Refund created: " + refund.get("id"));
} catch (BirrLinkException e) {
    System.out.println("Refund creation failed: " + e.getMessage());
}
```

## Webhook Verification

Verify webhook signatures to ensure authenticity:

```java
import com.birrlink.Webhook;
import spark.Spark;

public class WebhookHandler {
    public static void setupWebhookHandler(BirrLink client) {
        Spark.post("/webhooks/birrlink", (request, response) -> {
            String payload = request.body();
            String signature = request.headers("BirrLink-Signature");
            String secret = System.getenv("WEBHOOK_SECRET");
            
            try {
                Map<String, Object> event = Webhook.constructEvent(payload, signature, secret);
                
                // Process the event
                String eventType = (String) event.get("type");
                if ("payment.completed".equals(eventType)) {
                    System.out.println("Payment completed");
                } else if ("payment.failed".equals(eventType)) {
                    System.out.println("Payment failed");
                } else {
                    System.out.println("Unhandled event type: " + eventType);
                }
                
                response.status(200);
                return "OK";
            } catch (BirrLinkException e) {
                System.out.println("Webhook verification failed: " + e.getMessage());
                response.status(400);
                return "Invalid signature";
            }
        });
    }
}
```

## Error Handling

The SDK provides detailed error information:

```java
try {
    Map<String, Object> payment = client.payments().create(paymentData);
} catch (ValidationError e) {
    System.out.println("Validation error: " + e.getMessage());
    System.out.println("Invalid fields: " + e.getDetails());
} catch (AuthenticationException e) {
    System.out.println("Authentication failed: " + e.getMessage());
} catch (CardException e) {
    System.out.println("Card processing error: " + e.getMessage());
    System.out.println("Card code: " + e.getCode());
} catch (PaymentException e) {
    System.out.println("Payment error: " + e.getMessage());
} catch (BirrLinkException e) {
    System.out.println("Unexpected error: " + e.getMessage());
}
```

## Asynchronous Operations

The Java SDK also supports async operations:

```java
import java.util.concurrent.CompletableFuture;

// Create payment asynchronously
CompletableFuture<Map<String, Object>> futurePayment = client.payments().createAsync(paymentData);

futurePayment
    .thenAccept(payment -> System.out.println("Payment created: " + payment.get("id")))
    .exceptionally(throwable -> {
        System.out.println("Payment creation failed: " + throwable.getMessage());
        return null;
    });
```

## Custom Requests

For advanced use cases, you can make custom API requests:

```java
try {
    Map<String, Object> response = client.request("GET", "/custom-endpoint", 
        Collections.singletonMap("param", "value"));
    
    System.out.println("Custom response: " + response);
} catch (BirrLinkException e) {
    System.out.println("Custom request failed: " + e.getMessage());
}
```

## Version Information

Check the SDK version:

```java
String version = client.getVersion();
System.out.println("SDK Version: " + version);
```

## Spring Boot Integration

For Spring Boot applications, you can configure the SDK as a bean:

```java
// BirrLinkConfig.java
@Configuration
public class BirrLinkConfig {
    
    @Bean
    public BirrLink birrLinkClient(@Value("${birrlink.api.key}") String apiKey) {
        return new BirrLink(apiKey, Environment.SANDBOX);
    }
}

// PaymentService.java
@Service
public class PaymentService {
    
    private final BirrLink client;
    
    public PaymentService(BirrLink client) {
        this.client = client;
    }
    
    public Map<String, Object> createPayment(double amount, String currency, String description) 
            throws BirrLinkException {
        
        Map<String, Object> paymentData = new HashMap<>();
        paymentData.put("amount", amount);
        paymentData.put("currency", currency);
        paymentData.put("description", description);
        
        return client.payments().create(paymentData);
    }
}
```

## Testing Considerations

When testing, use test API keys and enable debug mode:

```java
BirrLinkOptions options = BirrLinkOptions.builder()
    .setApiKey(System.getenv("BIRR_LINK_TEST_KEY"))
    .setEnvironment(Environment.SANDBOX)
    .setDebug(true)  // Enable debug logging
    .build();

BirrLink client = new BirrLink(options);
```

## Connection Pooling

For high-traffic applications, configure connection pooling:

```java
BirrLinkOptions options = BirrLinkOptions.builder()
    .setApiKey(System.getenv("BIRR_LINK_SECRET_KEY"))
    .setEnvironment(Environment.PRODUCTION)
    .setConnectionPoolSize(20)  // Size of the connection pool
    .setMaxRetries(3)
    .build();

BirrLink client = new BirrLink(options);
```

For comprehensive testing, use the SDK in combination with BirrLink's sandbox environment to simulate various payment scenarios without real money transfers. The SDK handles connection management and request/response formatting automatically, allowing you to focus on implementing payment functionality in your application.