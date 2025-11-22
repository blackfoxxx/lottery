# QiCard Payment Gateway Integration Guide

## Overview

The Belkhair E-Commerce Platform now supports QiCard payment gateway integration, enabling secure payment processing for Iraqi customers using Iraq's trusted payment infrastructure.

## Architecture

### Backend (Laravel)

**Location:** `/home/ubuntu/belkhair-backend/`

**Key Components:**

1. **QiCardPaymentService** (`app/Services/QiCardPaymentService.php`)
   - Handles all QiCard API communications
   - Creates payments, retrieves payment status
   - Verifies webhook signatures using RSA SHA256

2. **QiCardPaymentController** (`app/Http/Controllers/Api/QiCardPaymentController.php`)
   - `POST /api/v1/qicard/initialize` - Initialize payment and get payment URL
   - `GET /api/v1/qicard/status/{paymentId}` - Check payment status
   - `POST /api/v1/qicard/webhook` - Receive payment status updates (public endpoint)

3. **Payments Table** (database)
   - Stores payment records with QiCard payment IDs
   - Tracks payment status (CREATED, SUCCESS, FAILED, AUTHENTICATION_FAILED)
   - Links payments to orders

### Frontend (React)

**Location:** `/home/ubuntu/belkhair-web/client/src/`

**Key Components:**

1. **Checkout Page** (`pages/Checkout.tsx`)
   - QiCard payment option (set as default)
   - Initializes payment when user clicks "Place Order"
   - Redirects to QiCard payment page

2. **Payment Complete Page** (`pages/PaymentComplete.tsx`)
   - Handles redirect from QiCard after payment
   - Verifies payment status with backend
   - Shows success/failure message
   - Awards loyalty points on success

## Configuration

### Required Credentials

You need to obtain the following from QiCard:

1. **Terminal ID** - Your merchant terminal identifier
2. **Username** - API authentication username
3. **Password** - API authentication password
4. **Public Key** - RSA public key for webhook verification (PEM format)

### Backend Configuration

**File:** `/home/ubuntu/belkhair-backend/.env`

```env
# QiCard Payment Gateway Configuration
QICARD_API_URL=https://uat-sandbox-3ds-api.qi.iq/api/v1
QICARD_TERMINAL_ID=your_terminal_id_here
QICARD_USERNAME=your_username_here
QICARD_PASSWORD=your_password_here
QICARD_PUBLIC_KEY_PATH=/home/ubuntu/belkhair-backend/storage/app/qicard-public-key.pem

# Frontend URL for payment redirects
FRONTEND_URL=https://3000-i1gsqlojk4l922n82631o-c4e07aaa.manusvm.computer
```

**Public Key Setup:**

1. Contact QiCard support to obtain the public key
2. Save it to: `/home/ubuntu/belkhair-backend/storage/app/qicard-public-key.pem`
3. Ensure the file has proper PEM format:
   ```
   -----BEGIN PUBLIC KEY-----
   [Your actual public key content]
   -----END PUBLIC KEY-----
   ```

## Payment Flow

### 1. Customer Initiates Checkout

- Customer fills shipping information
- Selects "QiCard Payment Gateway" (default option)
- Clicks "Place Order"

### 2. Order Creation

- Frontend creates order via Laravel API
- Order status: `pending_payment`
- Order ID stored in localStorage

### 3. Payment Initialization

- Frontend calls `/api/v1/qicard/initialize` with:
  - Order ID
  - Amount (in IQD)
  - Customer information
- Backend creates payment request to QiCard
- QiCard returns `formUrl` (payment page link)

### 4. Payment Page Redirect

- Customer redirected to QiCard payment page
- Customer enters card details on QiCard's secure page
- QiCard processes payment

### 5. Payment Completion

- QiCard redirects customer to: `{FRONTEND_URL}/payment/complete?order_id={orderId}`
- Frontend shows "Processing Payment" loader

### 6. Webhook Notification

- QiCard sends POST request to `/api/v1/qicard/webhook`
- Backend verifies webhook signature
- Updates payment status in database
- Updates order status to `confirmed` if payment successful

### 7. Payment Verification

- Frontend polls backend to check payment status
- Shows success or failure message
- On success:
  - Clears shopping cart
  - Awards loyalty points
  - Shows order confirmation

## API Endpoints

### Initialize Payment

**Endpoint:** `POST /api/v1/qicard/initialize`

**Request:**
```json
{
  "order_id": 123,
  "amount": 150.50,
  "customer_info": {
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "email": "ahmed@example.com",
    "phone": "009647xxxxxxxxx",
    "address": "Baghdad Street 123",
    "city": "Baghdad"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "f2bb43a8-488a-4281-977b-5b3418fc3c67",
    "formUrl": "https://uat-sandbox-3ds-api.qi.iq/api/v1/payment/f2bb43a8-488a-4281-977b-5b3418fc3c67",
    "status": "CREATED",
    "amount": 150.50,
    "currency": "IQD"
  }
}
```

### Get Payment Status

**Endpoint:** `GET /api/v1/qicard/status/{paymentId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "f2bb43a8-488a-4281-977b-5b3418fc3c67",
    "status": "SUCCESS",
    "amount": 150.50,
    "currency": "IQD",
    "creationDate": "2025-11-22T03:00:00Z"
  }
}
```

### Webhook Notification

**Endpoint:** `POST /api/v1/qicard/webhook` (Public - No Auth)

**Headers:**
- `X-Signature`: Base64-encoded RSA signature

**Request Body:**
```json
{
  "requestId": "20250113-212519-073",
  "paymentId": "f2bb43a8-488a-4281-977b-5b3418fc3c67",
  "status": "SUCCESS",
  "amount": 150.50,
  "currency": "IQD",
  "creationDate": "2025-11-22T03:00:00Z"
}
```

**Signature Verification:**

The webhook signature is verified using:
1. Construct data string: `{paymentId}|{amount}.000|{currency}|{creationDate}|{status}`
2. Decode base64 signature
3. Verify using RSA SHA256 with QiCard public key

## Testing

### Sandbox Environment

**API URL:** `https://uat-sandbox-3ds-api.qi.iq/api/v1`

### Test Flow

1. **Update credentials** in `.env` with QiCard sandbox credentials
2. **Add test product** to cart
3. **Go to checkout** and fill shipping information
4. **Select QiCard payment** (should be pre-selected)
5. **Click "Place Order"**
6. **Verify redirect** to QiCard payment page
7. **Enter test card** details (provided by QiCard)
8. **Complete payment** on QiCard page
9. **Verify redirect** back to `/payment/complete`
10. **Check payment status** updates correctly
11. **Verify order status** changed to `confirmed`
12. **Check lottery tickets** were generated

### Database Verification

```sql
-- Check payment record
SELECT * FROM payments WHERE order_id = {order_id};

-- Check order status
SELECT id, status, payment_status, total_amount 
FROM orders WHERE id = {order_id};

-- Check lottery tickets
SELECT * FROM lottery_tickets WHERE order_id = {order_id};
```

## Production Deployment

### Checklist

- [ ] Obtain production QiCard credentials
- [ ] Update `QICARD_API_URL` to production URL
- [ ] Update `QICARD_TERMINAL_ID`, `QICARD_USERNAME`, `QICARD_PASSWORD`
- [ ] Download and install production public key
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Test complete payment flow in production
- [ ] Monitor webhook logs for successful processing
- [ ] Set up error alerting for failed payments

### Security Considerations

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Verify webhook signatures** before processing
4. **Use HTTPS** for all API communications
5. **Log all payment transactions** for audit trail
6. **Implement rate limiting** on payment endpoints
7. **Monitor for suspicious activity**

## Troubleshooting

### Payment Initialization Fails

**Symptoms:** Error when clicking "Place Order"

**Checks:**
- Verify QiCard credentials in `.env`
- Check Laravel logs: `/home/ubuntu/belkhair-backend/storage/logs/laravel.log`
- Verify network connectivity to QiCard API
- Check order was created successfully

### Webhook Not Received

**Symptoms:** Payment stuck in "Processing" state

**Checks:**
- Verify webhook URL is publicly accessible
- Check firewall rules allow QiCard IP addresses
- Review Laravel logs for webhook errors
- Verify signature verification is working
- Test webhook manually with curl

### Payment Status Not Updating

**Symptoms:** Order remains in `pending_payment` status

**Checks:**
- Verify webhook endpoint is processing correctly
- Check database for payment record
- Review webhook payload in database
- Verify order ID matches between frontend and backend

### Signature Verification Fails

**Symptoms:** Webhook returns 401 Unauthorized

**Checks:**
- Verify public key file exists and is readable
- Check public key format (must be PEM)
- Ensure public key matches QiCard's private key
- Review signature construction logic

## Support

### QiCard Support

- **Documentation:** https://developers-gate.qi.iq/docs
- **Support Email:** Contact QiCard for support email
- **Phone:** Contact QiCard for support phone

### Internal Support

- **Backend API:** Laravel logs at `/home/ubuntu/belkhair-backend/storage/logs/`
- **Frontend:** Browser console for client-side errors
- **Database:** MySQL at `belkhair_db` database

## Future Enhancements

1. **Refund Support** - Implement QiCard refund API
2. **Recurring Payments** - Support subscription-based payments
3. **Payment Analytics** - Dashboard for payment metrics
4. **Multi-Currency** - Support USD and other currencies
5. **Payment Links** - Generate payment links for invoices
6. **Installment Plans** - Support split payments
