# UMA Platform - Developer Documentation

## Overview

UMA is a B2B marketing platform that uses ONDC mobility as a fulfillment tool. It connects local merchants with customers through a unique "Reimbursement Handshake" model.

## Core Concept: The Reimbursement Handshake

The platform operates on a 6-step transaction loop:

1. **Discover**: User finds a deal (e.g., "FREE ₹150 Ride + 10% Off at Manipal Masala")
2. **Book & Generate**: User books the deal and receives a unique QR code
3. **Ride**: User books ONDC ride (via Namma Yatri/Chalo) and pays driver directly
4. **Arrive**: User arrives at the merchant location
5. **Scan**: Merchant scans the user's QR code with Business App
6. **Handshake**: Two simultaneous actions:
   - Merchant's wallet is debited (ride cost + CPT fee)
   - User's wallet is credited (ride cashback)

## Architecture

### Monorepo Structure
```
uma-platform/
├── packages/
│   └── backend/          # Node.js backend services
├── apps/
│   ├── business-app/     # React Native app for merchants
│   └── rider-app/        # React Native app for users
└── docs/                 # Documentation
```

### Backend Services

#### 1. ONDC Gateway Service
- Handles all ONDC network communication
- Acts as Buyer Network Participant (BAP)
- Orchestrates Namma Yatri (mobility) and other BPPs
- Endpoints: `/search`, `/select`, `/init`, `/confirm`, `/status`

#### 2. Handshake Engine (Core IP)
- Executes the reimbursement handshake transaction
- Validates QR codes
- Manages wallet transactions (merchant debit, user credit)
- Enforces business rules (CPA, CPT, ad boosts)
- Endpoint: `POST /api/handshake/execute`

#### 3. Gamification Service
- **Strike System**: Penalizes incomplete bookings
- **Badge System**: Rewards user achievements
- **Mission Synthesizer**: AI-powered cross-domain deal bundling
- Runs scheduled cron jobs

#### 4. Analytics Engine
- Pre-calculates ROI metrics for merchants
- Generates customer intelligence reports
- Tracks campaign performance

### Database Schema

#### PostgreSQL (Transactional Data)
- **users**: User accounts, wallets, strike counts
- **merchants**: Merchant accounts, wallets, subscriptions
- **campaigns**: Merchant offers and settings
- **rides**: Booking records and QR codes
- **transactions**: Complete audit trail

#### MongoDB (Metadata)
- **missions**: Cross-domain deal bundles
- **badges**: Achievement definitions
- **user_badges**: User achievement tracking
- **ondc_cache**: ONDC response caching

## Revenue Streams

UMA has 4 revenue streams from merchants:

1. **CPT (Cost Per Trip)**: Fixed fee per verified visit (e.g., ₹20)
2. **CPA (Cost Per Acquisition)**: Bonus for new customers (e.g., ₹50)
3. **Ride Reimbursement**: The actual cashback amount (e.g., ₹150)
4. **Ad Boosts**: Featured placement in discovery feed (e.g., ₹500/week)

## API Endpoints

### Core Endpoints

#### Handshake
```
POST /api/handshake/execute
Body: { "qrData": "UMA-RIDE-..." }
Response: { 
  "success": true, 
  "apply_discount": "10%",
  "cashbackAmount": 150 
}
```

#### Ride Booking
```
POST /api/rides/book
Body: { "userId": "...", "campaignId": "..." }
Response: { 
  "success": true,
  "ride": {
    "id": "...",
    "qrCode": "UMA-RIDE-...",
    "qrDataUrl": "data:image/png;base64,..."
  }
}
```

#### ONDC Mobility
```
POST /api/ondc/search
Body: {
  "pickupLocation": { "lat": 13.3501, "lng": 74.7949 },
  "dropLocation": { "lat": 13.3560, "lng": 74.7860 }
}
```

### ONDC Callbacks
The system listens for ONDC callbacks:
- `POST /api/ondc/on_search` - Ride options from BPPs
- `POST /api/ondc/on_select` - Selection confirmation
- `POST /api/ondc/on_init` - Order initialization
- `POST /api/ondc/on_confirm` - Booking confirmation
- `POST /api/ondc/on_status` - Order status updates

## Key Features

### For Merchants (Business App)

1. **ROI Engine Dashboard**
   - Real-time footfall metrics
   - Cost-per-customer tracking
   - Comparison with Zomato/Swiggy CPC ads
   - Customer intelligence (new vs. returning)

2. **QR Scanner**
   - Camera-based QR scanning
   - Instant verification
   - Automatic wallet transactions

3. **Campaign Manager**
   - Create/edit offers
   - Set ride reimbursement caps
   - Enable/disable CPA and ad boosts
   - Smart scheduling (days/hours)

4. **Analytics**
   - Verified visits over time
   - Spend breakdown
   - Fraud prevention reports

### For Users (Rider App)

1. **Discovery Engine**
   - Map view with merchant pins
   - List view with filters
   - Featured carousel for boosted merchants

2. **Missions Hub**
   - AI-synthesized multi-domain deals
   - Cross-platform bundling (Namma Yatri + Magicpin + local merchants)
   - Story-style presentation

3. **ONDC Mobility Module**
   - Integrated ride booking
   - Support for Namma Yatri, Chalo, etc.
   - Seamless user experience

4. **Gamification**
   - **Strike System**: Max 3 strikes for incomplete bookings
   - **Badges**: Achievements with wallet rewards
   - **Wallet**: Instant cashback, easy withdrawal

## ONDC Integration Strategy

### As a BAP (Buyer Network Participant)

UMA orchestrates supply from multiple BPPs:

1. **Namma Yatri** (Mobility BPP)
   - Primary auto-rickshaw supplier
   - Symbiotic relationship (they want our volume)
   - Zero commission, driver pays SaaS fee

2. **Chalo** (Mobility BPP)
   - Public transport (bus, metro)
   - Enable multi-modal missions

3. **Magicpin** (Commerce BAP/BPP)
   - F&B deals
   - Cross-domain mission bundling

### ONDC Flow Example
```
1. User searches for ride (BAP → Gateway → BPP)
2. BPP responds with options (BPP → Gateway → BAP)
3. User selects option (BAP → BPP)
4. User books ride (BAP → BPP)
5. Ride completed
6. User shows QR at merchant
7. Handshake executes (UMA internal)
```

## Security Considerations

1. **QR Code Validation**
   - One-time use only
   - 24-hour expiration
   - Unique cryptographic format

2. **Transaction Safety**
   - Pessimistic locking on handshake
   - ACID compliance (PostgreSQL)
   - Complete audit trail

3. **Fraud Prevention**
   - Strike system for low-intent users
   - Merchant wallet pre-loading
   - Transaction monitoring

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- MongoDB 6+
- Firebase account (for auth & push notifications)

### Installation
```bash
# Clone repository
git clone https://github.com/Armour007/rider.git
cd rider

# Install dependencies
npm install

# Setup backend
cd packages/backend
cp .env.example .env
# Edit .env with your credentials
npm install

# Run migrations
npm run dev
```

### Running Services
```bash
# Start backend
npm run dev:backend

# Start Business App
npm run dev:business

# Start Rider App
npm run dev:rider
```

## Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run app tests
npm run test:apps
```

## Deployment

### Production Checklist
- [ ] Configure production database credentials
- [ ] Set up Firebase production project
- [ ] Configure ONDC production endpoints
- [ ] Enable SSL/TLS
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Configure auto-scaling
- [ ] Set up backup strategy
- [ ] Enable rate limiting
- [ ] Configure CDN for static assets

## Monitoring

### Key Metrics to Track
- Handshake success rate
- ONDC API response times
- Wallet transaction volumes
- Campaign ROI metrics
- User retention rates
- Strike/ban rates

## Support

For questions or issues:
- GitHub Issues: https://github.com/Armour007/rider/issues
- Email: support@uma.com

## License

MIT License - See LICENSE file for details
