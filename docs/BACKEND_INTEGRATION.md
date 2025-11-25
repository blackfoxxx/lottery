# Backend Integration Guide

## Overview

The Belkhair E-Commerce Platform backend is built with **Laravel 10** and provides a complete REST API for all frontend features including lottery system, e-commerce, gift cards, bundles, and admin management.

## Backend Repository

**Location:** `/home/ubuntu/belkhair-backend`

## Already Implemented Features

### ✅ Lottery System
- Complete lottery draw CRUD operations
- Automatic ticket generation on product purchase
- Winner selection algorithm
- Ticket tracking and management
- Winner notifications
- Category-based draws (Bronze, Silver, Golden)

### ✅ E-Commerce Core
- Product management
- Order processing
- Payment integration
- Inventory tracking
- Customer management

### ✅ Notifications
- Email notifications
- SMS notifications (Twilio)
- Push notifications
- Winner announcements
- Order confirmations

## API Endpoints

### Lottery Endpoints

#### Public Endpoints

```
GET    /api/v1/lottery/draws
GET    /api/v1/lottery/draws/{id}
GET    /api/v1/lottery/winners
POST   /api/v1/lottery/tickets/generate
GET    /api/v1/lottery/users/{userId}/tickets
```

#### Protected Endpoints (Admin)

```
POST   /api/v1/lottery/draws
PUT    /api/v1/lottery/draws/{id}
POST   /api/v1/lottery/draws/{id}/perform
GET    /api/v1/lottery/tickets
```

### Frontend Integration

#### 1. API Base URL Configuration

Update your frontend `.env` file:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

#### 2. Lottery API Integration

**Fetch Active Draws:**
```typescript
const response = await fetch(`${import.meta.env.VITE_API_URL}/lottery/draws?status=upcoming`);
const data = await response.json();
```

**Get User Tickets:**
```typescript
const response = await fetch(`${import.meta.env.VITE_API_URL}/lottery/users/${userId}/tickets`);
const data = await response.json();
```

**Admin: Create Draw:**
```typescript
const response = await fetch(`${import.meta.env.VITE_API_URL}/lottery/draws`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Golden Draw December',
    category: 'golden',
    draw_date: '2024-12-31 20:00:00',
    prize_amount: 10000,
    prize_description: '$10,000 Cash Prize'
  })
});
```

**Admin: Conduct Draw:**
```typescript
const response = await fetch(`${import.meta.env.VITE_API_URL}/lottery/draws/${drawId}/perform`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Database Schema

### lottery_draws Table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Draw name |
| category | enum | bronze, silver, golden |
| draw_date | datetime | Scheduled draw date |
| prize_amount | decimal(10,2) | Prize money |
| prize_description | text | Prize details |
| status | enum | upcoming, in_progress, completed |
| total_tickets | integer | Total tickets sold |
| winner_ticket | varchar(50) | Winning ticket number |
| winner_user_id | bigint | Winner user ID |
| drawn_at | timestamp | When draw was conducted |

### lottery_tickets Table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| ticket_number | varchar(50) | Unique ticket number (e.g., BLK-ABC-123456) |
| user_id | bigint | Owner user ID |
| order_id | bigint | Associated order |
| draw_id | bigint | Associated draw (nullable) |
| category | enum | bronze, silver, golden |
| status | enum | active, winner, expired |
| purchase_amount | decimal(10,2) | Product price |
| metadata | json | Additional data |
| expires_at | timestamp | Expiration date |
| drawn_at | timestamp | When used in draw |

### lottery_winners Table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| draw_id | bigint | Draw ID |
| user_id | bigint | Winner user ID |
| ticket_id | bigint | Winning ticket ID |
| prize | decimal(10,2) | Prize amount |
| claimed | boolean | Prize claimed status |
| claimed_at | timestamp | When prize was claimed |

## Ticket Generation Logic

Tickets are automatically generated when a customer purchases a product:

1. Customer completes checkout
2. Order is created
3. Backend generates lottery tickets based on product category:
   - Bronze products → Bronze lottery tickets
   - Silver products → Silver lottery tickets  
   - Golden products → Golden lottery tickets
4. Ticket number format: `BLK-XXX-XXXXXX` (e.g., BLK-ABC-123456)
5. Tickets are assigned to upcoming draws of matching category
6. Customer receives email with ticket numbers

## Winner Selection Algorithm

```php
// Get all active tickets for the draw category
$tickets = LotteryTicket::where('category', $draw->category)
    ->where('status', 'active')
    ->get();

// Select random winner
$winningTicket = $tickets->random();

// Update draw with winner
$draw->update([
    'status' => 'completed',
    'winner_ticket' => $winningTicket->ticket_number,
    'winner_user_id' => $winningTicket->user_id,
    'drawn_at' => now()
]);

// Update winning ticket
$winningTicket->update([
    'status' => 'winner',
    'draw_id' => $draw->id
]);
```

## Authentication

The backend uses **Laravel Sanctum** for API authentication.

### Login Request

```typescript
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});

const { token, user } = await response.json();
```

### Authenticated Requests

```typescript
const response = await fetch(`${API_URL}/lottery/draws`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Running the Backend

### Development

```bash
cd /home/ubuntu/belkhair-backend

# Install dependencies
composer install

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

Backend will be available at `http://localhost:8000`

### Production

See `BACKEND_INSTALLATION.md` for production deployment instructions.

## Environment Variables

Required `.env` variables for lottery system:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=belkhair
DB_USERNAME=root
DB_PASSWORD=

# Email (for winner notifications)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@belkhair.com
MAIL_FROM_NAME="Belkhair E-Commerce"

# SMS (Twilio for winner notifications)
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# App
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

## Testing the Integration

### 1. Test Lottery Draws

```bash
# Get all draws
curl http://localhost:8000/api/v1/lottery/draws

# Get specific draw
curl http://localhost:8000/api/v1/lottery/draws/1
```

### 2. Test Ticket Generation

```bash
curl -X POST http://localhost:8000/api/v1/lottery/tickets/generate \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "user_id": 1,
    "tickets": [
      {
        "category": "golden",
        "product_name": "iPhone 15 Pro Max",
        "quantity": 1
      }
    ]
  }'
```

### 3. Test Winner Selection (Admin)

```bash
curl -X POST http://localhost:8000/api/v1/lottery/draws/1/perform \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Next Steps

1. **Update Frontend API Client:** Update `/home/ubuntu/belkhair-web/client/src/lib/api.ts` with correct backend URL
2. **Test Integration:** Run both frontend and backend, test lottery flow end-to-end
3. **Configure Notifications:** Set up email/SMS credentials for winner notifications
4. **Deploy Backend:** Follow production deployment guide in `BACKEND_INSTALLATION.md`

## Support

For backend issues or questions:
- Check Laravel logs: `/home/ubuntu/belkhair-backend/storage/logs/laravel.log`
- Review API documentation: `/docs/LOTTERY_API.md`
- Contact backend team

---

**Last Updated:** November 25, 2024
