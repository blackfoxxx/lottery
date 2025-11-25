# Lottery System API Documentation

Complete API documentation for the Belkhair lottery system backend.

## Base URL

```
https://api.belkhair.com/api/v1
```

## Authentication

All admin endpoints require Bearer token authentication.

```
Authorization: Bearer {your_token}
```

---

## Lottery Draws

### Get All Lottery Draws

Get a list of all lottery draws with pagination.

**Endpoint:** `GET /lottery-draws`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 15)
- `status` (optional): Filter by status (upcoming, active, completed)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Golden Draw",
      "prize": 10000,
      "draw_date": "2024-03-01T00:00:00Z",
      "ticket_price": 50,
      "status": "active",
      "tickets_sold": 15420,
      "winner": null,
      "created_at": "2024-02-01T10:00:00Z",
      "updated_at": "2024-02-15T14:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 73
  }
}
```

---

### Get Single Lottery Draw

Get details of a specific lottery draw.

**Endpoint:** `GET /lottery-draws/{id}`

**Response:**
```json
{
  "id": 1,
  "name": "Golden Draw",
  "prize": 10000,
  "draw_date": "2024-03-01T00:00:00Z",
  "ticket_price": 50,
  "status": "active",
  "tickets_sold": 15420,
  "winner": {
    "id": 123,
    "name": "Ahmad K.",
    "ticket_number": "LT-2024-001234",
    "claimed": false
  },
  "created_at": "2024-02-01T10:00:00Z",
  "updated_at": "2024-02-15T14:30:00Z"
}
```

---

### Create Lottery Draw

Create a new lottery draw (Admin only).

**Endpoint:** `POST /lottery-draws`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "name": "Golden Draw",
  "prize": 10000,
  "draw_date": "2024-03-01",
  "ticket_price": 50
}
```

**Validation Rules:**
- `name`: required, string, max:255
- `prize`: required, numeric, min:1
- `draw_date`: required, date, after:today
- `ticket_price`: required, numeric, min:1

**Response:**
```json
{
  "id": 1,
  "name": "Golden Draw",
  "prize": 10000,
  "draw_date": "2024-03-01T00:00:00Z",
  "ticket_price": 50,
  "status": "upcoming",
  "tickets_sold": 0,
  "winner": null,
  "created_at": "2024-02-01T10:00:00Z",
  "updated_at": "2024-02-01T10:00:00Z"
}
```

---

### Update Lottery Draw

Update an existing lottery draw (Admin only).

**Endpoint:** `PUT /lottery-draws/{id}`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "name": "Golden Draw Updated",
  "prize": 12000,
  "draw_date": "2024-03-05",
  "ticket_price": 60
}
```

**Validation Rules:**
- `name`: optional, string, max:255
- `prize`: optional, numeric, min:1
- `draw_date`: optional, date, after:today
- `ticket_price`: optional, numeric, min:1

**Response:**
```json
{
  "id": 1,
  "name": "Golden Draw Updated",
  "prize": 12000,
  "draw_date": "2024-03-05T00:00:00Z",
  "ticket_price": 60,
  "status": "upcoming",
  "tickets_sold": 0,
  "winner": null,
  "created_at": "2024-02-01T10:00:00Z",
  "updated_at": "2024-02-15T15:00:00Z"
}
```

---

### Delete Lottery Draw

Delete a lottery draw (Admin only). Cannot delete draws with sold tickets.

**Endpoint:** `DELETE /lottery-draws/{id}`

**Authentication:** Required (Admin)

**Response:**
```json
{
  "message": "Lottery draw deleted successfully"
}
```

**Error Response (if tickets sold):**
```json
{
  "error": "Cannot delete lottery draw with sold tickets"
}
```

---

### Conduct Lottery Draw

Conduct a lottery draw and select a random winner (Admin only).

**Endpoint:** `POST /lottery-draws/{id}/conduct`

**Authentication:** Required (Admin)

**Response:**
```json
{
  "draw": {
    "id": 1,
    "name": "Golden Draw",
    "prize": 10000,
    "status": "completed"
  },
  "winner": {
    "id": 123,
    "name": "Ahmad K.",
    "email": "ahmad@example.com",
    "ticket_number": "LT-2024-001234",
    "prize": 10000,
    "claimed": false
  },
  "message": "Draw conducted successfully. Winner: Ahmad K."
}
```

**Error Response (if no tickets sold):**
```json
{
  "error": "Cannot conduct draw with no tickets sold"
}
```

---

## Lottery Statistics

### Get Lottery Statistics

Get comprehensive lottery statistics.

**Endpoint:** `GET /lottery-stats`

**Response:**
```json
{
  "total_draws": 25,
  "total_prizes_awarded": 250000,
  "total_tickets_sold": 125430,
  "biggest_win": {
    "prize": 10000,
    "winner": "Ahmad K.",
    "draw_name": "Golden Draw",
    "date": "2024-02-15"
  },
  "top_winners": [
    {
      "id": 1,
      "name": "Ahmad K.",
      "prize": 10000,
      "ticket_number": "LT-2024-001234",
      "draw_name": "Golden Draw",
      "date": "2024-02-15"
    },
    {
      "id": 2,
      "name": "Sarah M.",
      "prize": 8500,
      "ticket_number": "LT-2024-002156",
      "draw_name": "Diamond Prize",
      "date": "2024-02-10"
    }
  ],
  "draw_history": [
    {
      "id": 1,
      "name": "Golden Draw",
      "prize": 10000,
      "date": "2024-02-15",
      "tickets_sold": 15420,
      "winner": "Ahmad K."
    }
  ]
}
```

---

### Get Lottery Winners

Get a list of all lottery winners.

**Endpoint:** `GET /lottery-winners`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 15)
- `claimed` (optional): Filter by claimed status (true/false)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 123,
      "user_name": "Ahmad K.",
      "user_email": "ahmad@example.com",
      "draw_id": 1,
      "draw_name": "Golden Draw",
      "ticket_number": "LT-2024-001234",
      "prize": 10000,
      "claimed": false,
      "claimed_at": null,
      "won_at": "2024-02-15T18:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 15,
    "total": 42
  }
}
```

---

## Lottery Tickets

### Purchase Lottery Ticket

Purchase tickets for a lottery draw (Authenticated user).

**Endpoint:** `POST /lottery-tickets/purchase`

**Authentication:** Required

**Request Body:**
```json
{
  "draw_id": 1,
  "quantity": 5,
  "payment_method": "stripe"
}
```

**Validation Rules:**
- `draw_id`: required, exists:lottery_draws,id
- `quantity`: required, integer, min:1, max:100
- `payment_method`: required, in:stripe,paypal,wallet

**Response:**
```json
{
  "tickets": [
    {
      "id": 1,
      "ticket_number": "LT-2024-001234",
      "draw_id": 1,
      "draw_name": "Golden Draw",
      "user_id": 123,
      "price": 50,
      "status": "active",
      "purchased_at": "2024-02-15T10:00:00Z"
    }
  ],
  "total_amount": 250,
  "payment_status": "completed",
  "message": "5 tickets purchased successfully"
}
```

---

### Get User Tickets

Get all tickets purchased by the authenticated user.

**Endpoint:** `GET /lottery-tickets/my-tickets`

**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter by status (active, won, lost)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "ticket_number": "LT-2024-001234",
      "draw": {
        "id": 1,
        "name": "Golden Draw",
        "prize": 10000,
        "draw_date": "2024-03-01T00:00:00Z",
        "status": "active"
      },
      "price": 50,
      "status": "active",
      "is_winner": false,
      "purchased_at": "2024-02-15T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 15,
    "total": 24
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "message": "The given data was invalid",
  "errors": {
    "name": ["The name field is required"],
    "prize": ["The prize must be at least 1"]
  }
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

API requests are rate-limited to:
- **Public endpoints:** 60 requests per minute
- **Authenticated endpoints:** 120 requests per minute
- **Admin endpoints:** 300 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1614556800
```

---

## Testing with cURL

### Get all lottery draws
```bash
curl -X GET https://api.belkhair.com/api/v1/lottery-draws
```

### Create a lottery draw (Admin)
```bash
curl -X POST https://api.belkhair.com/api/v1/lottery-draws \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Golden Draw",
    "prize": 10000,
    "draw_date": "2024-03-01",
    "ticket_price": 50
  }'
```

### Conduct a draw (Admin)
```bash
curl -X POST https://api.belkhair.com/api/v1/lottery-draws/1/conduct \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Purchase tickets
```bash
curl -X POST https://api.belkhair.com/api/v1/lottery-tickets/purchase \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "draw_id": 1,
    "quantity": 5,
    "payment_method": "stripe"
  }'
```

---

## Database Schema

### lottery_draws
```sql
CREATE TABLE lottery_draws (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    prize DECIMAL(10, 2) NOT NULL,
    draw_date DATETIME NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    status ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming',
    tickets_sold INT DEFAULT 0,
    winner_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### lottery_tickets
```sql
CREATE TABLE lottery_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    draw_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'won', 'lost') DEFAULT 'active',
    purchased_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (draw_id) REFERENCES lottery_draws(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### lottery_winners
```sql
CREATE TABLE lottery_winners (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    draw_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    ticket_id BIGINT UNSIGNED NOT NULL,
    prize DECIMAL(10, 2) NOT NULL,
    claimed BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (draw_id) REFERENCES lottery_draws(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES lottery_tickets(id) ON DELETE CASCADE
);
```

---

## Implementation Notes

1. **Winner Selection Algorithm:**
   - Select a random ticket from all active tickets for the draw
   - Mark the ticket as 'won' and all others as 'lost'
   - Create a winner record
   - Update draw status to 'completed'
   - Send notification to winner

2. **Ticket Number Generation:**
   - Format: `LT-{YEAR}-{6-DIGIT-NUMBER}`
   - Example: `LT-2024-001234`
   - Ensure uniqueness across all draws

3. **Draw Status Management:**
   - `upcoming`: Draw date is in the future, tickets can be purchased
   - `active`: Draw date is today or past, tickets can still be purchased
   - `completed`: Draw has been conducted, winner selected

4. **Security Considerations:**
   - Only admins can create, update, delete, and conduct draws
   - Users can only purchase tickets and view their own tickets
   - Winner selection must be cryptographically random
   - Prevent duplicate ticket purchases in the same transaction

5. **Notifications:**
   - Email notification to winner when draw is conducted
   - Push notification to mobile app users
   - SMS notification (optional)

---

## Support

For API support, contact: api-support@belkhair.com
