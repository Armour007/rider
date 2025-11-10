# UMA Platform API Reference

## Base URL
```
Development: http://localhost:3000
Production: https://api.uma.com
```

## Authentication
Most endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Core Endpoints

### Health Check
```http
GET /health
```
Returns service health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2023-11-10T07:09:12.250Z",
  "service": "UMA Backend"
}
```

---

## Handshake API

### Execute Handshake
```http
POST /api/handshake/execute
```

Execute the reimbursement handshake when merchant scans rider QR.

**Request Body:**
```json
{
  "qrData": "UMA-RIDE-12345-abcde"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "apply_discount": "10%",
  "message": "Verified! Apply 10% discount",
  "cashbackAmount": 150
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid QR code or QR already used"
}
```

---

## Ride API

### Book Deal
```http
POST /api/rides/book
```

Book a deal and generate unique QR code for rider.

**Request Body:**
```json
{
  "userId": "user-uuid",
  "campaignId": "campaign-uuid"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "ride": {
    "id": "ride-uuid",
    "qrCode": "UMA-RIDE-12345-abcde",
    "qrDataUrl": "data:image/png;base64,iVBOR...",
    "campaignId": "campaign-uuid",
    "merchantName": "Manipal Masala",
    "rideReimbursement": 150,
    "discount": 10
  }
}
```

### Get Ride
```http
GET /api/rides/:rideId
```

Retrieve ride details.

**Success Response (200):**
```json
{
  "success": true,
  "ride": {
    "id": "ride-uuid",
    "userId": "user-uuid",
    "campaignId": "campaign-uuid",
    "status": "pending_scan",
    "qrCode": "UMA-RIDE-12345-abcde",
    "createdAt": "2023-11-10T07:00:00.000Z"
  }
}
```

---

## ONDC API

### Search Rides
```http
POST /api/ondc/search
```

Search for available rides on ONDC network.

**Request Body:**
```json
{
  "pickupLocation": {
    "lat": 13.3501,
    "lng": 74.7949
  },
  "dropLocation": {
    "lat": 13.3560,
    "lng": 74.7860
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "transactionId": "txn-uuid",
  "messageId": "msg-uuid",
  "response": {
    "context": {...},
    "message": {...}
  }
}
```

### Select Ride
```http
POST /api/ondc/select
```

Select a specific ride option from search results.

**Request Body:**
```json
{
  "transactionId": "txn-uuid",
  "bppId": "nammayatri.bpp.id",
  "bppUri": "https://api.nammayatri.in",
  "itemId": "auto-123",
  "fulfillmentId": "fulfillment-1"
}
```

### Initialize Ride
```http
POST /api/ondc/init
```

Initialize ride booking with customer details.

**Request Body:**
```json
{
  "transactionId": "txn-uuid",
  "bppId": "nammayatri.bpp.id",
  "bppUri": "https://api.nammayatri.in",
  "itemId": "auto-123",
  "fulfillmentId": "fulfillment-1",
  "customerDetails": {
    "name": "John Doe",
    "phone": "+919876543210"
  }
}
```

### Confirm Ride
```http
POST /api/ondc/confirm
```

Confirm the ride booking.

**Request Body:**
```json
{
  "transactionId": "txn-uuid",
  "bppId": "nammayatri.bpp.id",
  "bppUri": "https://api.nammayatri.in",
  "orderId": "order-uuid"
}
```

---

## ONDC Callbacks

These endpoints receive callbacks from ONDC network:

```http
POST /api/ondc/on_search
POST /api/ondc/on_select
POST /api/ondc/on_init
POST /api/ondc/on_confirm
POST /api/ondc/on_status
```

All callbacks return:
```json
{
  "message": {
    "ack": {
      "status": "ACK"
    }
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Webhooks

UMA can send webhooks for important events:

### Handshake Success
```json
{
  "event": "handshake.success",
  "data": {
    "rideId": "ride-uuid",
    "merchantId": "merchant-uuid",
    "userId": "user-uuid",
    "amount": 150
  },
  "timestamp": "2023-11-10T07:09:12.250Z"
}
```

### Campaign Completed
```json
{
  "event": "campaign.completed",
  "data": {
    "campaignId": "campaign-uuid",
    "totalVisits": 100,
    "totalSpend": 15000
  },
  "timestamp": "2023-11-10T07:09:12.250Z"
}
```

---

## SDKs

Coming soon:
- JavaScript/TypeScript SDK
- Python SDK
- React Native SDK
