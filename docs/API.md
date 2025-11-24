# Belkhair E-Commerce API Documentation

Complete API reference for the Belkhair E-Commerce Platform.

## Base URL

```
Development: http://localhost:8000/api/v1
Production: https://api.belkhair.com/v1
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Get Token

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Use Token

Include the token in the Authorization header:

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## Rate Limiting

- **Limit**: 60 requests per minute per user
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

## Pagination

List endpoints support pagination:

```http
GET /api/v1/products?page=1&per_page=20
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 100,
    "last_page": 5
  }
}
```

---

## Authentication Endpoints

### Register User

```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Login

```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {...},
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Product Endpoints

### List Products

```http
GET /api/v1/products
```

**Query Parameters:**
- `page` (integer): Page number
- `per_page` (integer): Items per page
- `category` (string): Filter by category
- `search` (string): Search query

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Nike Air Max 270",
      "description": "Comfortable running shoes",
      "price": 149.99,
      "original_price": 179.99,
      "discount": 17,
      "image": "https://example.com/image.jpg",
      "category": "Shoes",
      "stock": 50,
      "rating": 4.5,
      "reviews_count": 234
    }
  ],
  "meta": {...}
}
```

### Get Product

```http
GET /api/v1/products/{id}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Nike Air Max 270",
  ...
}
```

### Create Product (Admin)

```http
POST /api/v1/products
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "original_price": 129.99,
  "image": "https://example.com/image.jpg",
  "category": "Electronics",
  "stock": 100
}
```

### Update Product (Admin)

```http
PUT /api/v1/products/{id}
Authorization: Bearer {token}
```

### Delete Product (Admin)

```http
DELETE /api/v1/products/{id}
Authorization: Bearer {token}
```

---

## Lottery Endpoints

### List Draws

```http
GET /api/v1/lottery/draws
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Golden Draw",
    "prize_amount": 10000,
    "draw_date": "2024-12-31T23:59:59Z",
    "ticket_price": 5,
    "tickets_sold": 15420,
    "status": "active"
  }
]
```

### Purchase Tickets

```http
POST /api/v1/lottery/purchase
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "draw_id": 1,
  "quantity": 5
}
```

**Response (201):**
```json
{
  "tickets": [
    {
      "id": 1,
      "ticket_number": "GD-2024-001234",
      "draw_id": 1,
      "status": "active"
    }
  ],
  "total_cost": 25
}
```

### Get My Tickets

```http
GET /api/v1/lottery/my-tickets
Authorization: Bearer {token}
```

### Get Results

```http
GET /api/v1/lottery/results
```

---

## Gift Card Endpoints

### List Gift Cards

```http
GET /api/v1/gift-cards
Authorization: Bearer {token}
```

### Purchase Gift Card

```http
POST /api/v1/gift-cards/purchase
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "amount": 50,
  "recipient_email": "recipient@example.com",
  "recipient_name": "Jane Doe",
  "message": "Happy Birthday!"
}
```

**Response (201):**
```json
{
  "id": 1,
  "code": "GC-XXXX-XXXX-XXXX",
  "amount": 50,
  "balance": 50,
  "recipient_email": "recipient@example.com",
  "status": "active",
  "expires_at": "2025-12-31T23:59:59Z"
}
```

### Check Balance

```http
GET /api/v1/gift-cards/balance?code=GC-XXXX-XXXX-XXXX
```

**Response (200):**
```json
{
  "code": "GC-XXXX-XXXX-XXXX",
  "balance": 50,
  "status": "active"
}
```

### Redeem Gift Card

```http
POST /api/v1/gift-cards/redeem
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "code": "GC-XXXX-XXXX-XXXX",
  "amount": 25
}
```

---

## Bundle Endpoints

### List Bundles

```http
GET /api/v1/bundles
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Tech Essentials Bundle",
    "description": "Everything you need for work",
    "products": [...],
    "total_price": 299.99,
    "discount_percentage": 15,
    "savings": 52.94
  }
]
```

### Get Bundle

```http
GET /api/v1/bundles/{id}
```

---

## Social Proof Endpoints

### Track Product View

```http
POST /api/v1/social-proof/track
```

**Request Body:**
```json
{
  "product_id": 1,
  "action": "view"
}
```

### Get Product Activity

```http
GET /api/v1/social-proof/activity/{product_id}
```

**Response (200):**
```json
{
  "product_id": 1,
  "viewing_count": 12,
  "recent_purchases": 5,
  "trending": true
}
```

---

## Order Endpoints

### Create Order

```http
POST /api/v1/orders
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "shipping_address": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "zip": "10001",
    "country": "USA"
  },
  "payment_method": "stripe",
  "gift_card_code": "GC-XXXX-XXXX-XXXX"
}
```

### List Orders

```http
GET /api/v1/orders
Authorization: Bearer {token}
```

### Get Order

```http
GET /api/v1/orders/{id}
Authorization: Bearer {token}
```

---

## Admin Endpoints

### Dashboard Statistics

```http
GET /api/v1/admin/dashboard
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "total_revenue": 125000,
  "total_orders": 1250,
  "total_customers": 850,
  "pending_orders": 15,
  "low_stock_products": 8
}
```

### Analytics

```http
GET /api/v1/admin/analytics
Authorization: Bearer {admin_token}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request",
  "errors": {
    "field": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid",
  "errors": {
    "email": ["The email field is required"],
    "password": ["The password must be at least 8 characters"]
  }
}
```

### 429 Too Many Requests
```json
{
  "message": "Too many requests"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Webhooks

Configure webhooks in the admin dashboard to receive real-time notifications.

### Webhook Events

- `order.created`
- `order.updated`
- `payment.successful`
- `payment.failed`
- `lottery.draw_completed`
- `gift_card.purchased`
- `product.low_stock`

### Webhook Payload

```json
{
  "event": "order.created",
  "timestamp": "2024-12-25T10:30:00Z",
  "data": {
    "order_id": 123,
    "customer_id": 456,
    "total": 299.99
  }
}
```

---

## Testing

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get products
curl -X GET http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Import the OpenAPI specification from `docs/openapi.yaml`
2. Set up environment variables for base URL and token
3. Test endpoints with "Try it out" feature

---

## Support

For API support:
- Email: api@belkhair.com
- Documentation: https://docs.belkhair.com
- GitHub Issues: https://github.com/blackfoxxx/lottery/issues

---

**Last Updated**: December 2024  
**Version**: 1.0.0
