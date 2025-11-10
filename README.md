# UMA Platform

> B2B Marketing Platform with ONDC Mobility Fulfillment

## 🎯 What is UMA?

UMA is **not** a ride-hailing app. UMA is a **B2B marketing platform** that uses ONDC mobility as a fulfillment tool. Our #1 customer is the **local merchant**. Our product for the user (the rider) is a **"deal-breaker" discovery app**.

## 🚀 Core Innovation: The Reimbursement Handshake

Unlike traditional ride-hailing or deal platforms, UMA operates on a unique 6-step "Reimbursement Handshake" model:

1. **Discover**: Student finds "FREE ₹150 Ride + 10% Off at Manipal Masala"
2. **Book**: Student books deal, receives unique QR code
3. **Ride**: Student books ONDC ride (Namma Yatri), pays driver ₹150 directly
4. **Arrive**: Student reaches the restaurant
5. **Scan**: Merchant scans student's QR code
6. **Handshake**: Instant simultaneous actions:
   - Merchant wallet debited (₹150 + ₹20 CPT fee)
   - Student wallet credited (₹150 cashback)

## 🏗️ Architecture

### Monorepo Structure
```
uma-platform/
├── packages/
│   └── backend/          # Node.js backend services
│       ├── services/     # ONDC Gateway, Handshake Engine, Gamification
│       ├── models/       # PostgreSQL & MongoDB models
│       ├── controllers/  # API controllers
│       └── routes/       # Express routes
├── apps/
│   ├── business-app/     # React Native app for merchants
│   └── rider-app/        # React Native app for users
└── docs/                 # Comprehensive documentation
```

### Tech Stack

**Backend**
- Node.js + TypeScript + Express
- PostgreSQL (transactional data)
- MongoDB (missions, badges, metadata)
- Firebase (auth, push notifications)
- ONDC integration

**Mobile Apps**
- React Native
- React Native Camera (QR scanning)
- Mapbox (discovery map)
- Firebase Auth

## 💡 Key Features

### For Merchants (Business App)

✅ **ROI Engine Dashboard** - Prove value in 5 seconds
- Guaranteed footfall tracking
- Cost-per-customer metrics
- "Zomato Killer" comparison widget
- Customer intelligence (new vs. returning)

✅ **QR Scanner** - One-tap verification
✅ **Campaign Manager** - Full control over offers
✅ **4 Revenue Streams**: CPT, CPA, Ride Reimbursement, Ad Boosts

### For Users (Rider App)

✅ **Discovery Engine** - Beautiful map & list views
✅ **Missions Hub** - AI-synthesized cross-domain deals
✅ **ONDC Mobility** - Integrated Namma Yatri/Chalo booking
✅ **Gamification** - Strikes, badges, wallet rewards

## 🔌 ONDC Integration

UMA is a **Buyer Network Participant (BAP)** that orchestrates supply from multiple BPPs:

- **Namma Yatri** (Mobility) - Auto-rickshaws
- **Chalo** (Mobility) - Public transport
- **Magicpin** (Commerce) - F&B deals

This creates an **unassailable moat** through cross-domain mission bundling.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- MongoDB 6+
- Docker (optional)

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

# Run with Docker (recommended)
cd ../..
docker-compose up -d

# Or run manually
npm run dev:backend
```

### Quick Test

```bash
# Health check
curl http://localhost:3000/health

# Test handshake (with mock data)
curl -X POST http://localhost:3000/api/handshake/execute \
  -H "Content-Type: application/json" \
  -d '{"qrData": "test-qr-code"}'
```

## 📊 Revenue Model

### From Merchants (4 Streams)

1. **CPT (Cost Per Trip)**: ₹20 per verified visit
2. **CPA (Cost Per Acquisition)**: ₹50 bonus for new customers
3. **Ride Reimbursement**: Variable (e.g., ₹150)
4. **Ad Boosts**: ₹500/week for featured placement

### SaaS Subscription
- Basic: ₹0/month
- Pro: ₹999/month
- Enterprise: Custom pricing

## 🎮 Gamification System

### Strike System
- 1 strike = QR not scanned within 24 hours
- 3 strikes = Temporary account ban
- Ensures high-intent customers for merchants

### Badge System
- "Coffee Hopper" - Visit 3 cafes (₹50 reward)
- "Night Owl" - 3 missions after 9 PM (₹75 reward)
- "Manipal Pro" - 10 unique venues (₹100 reward)

## 📖 Documentation

Comprehensive documentation available in `/docs`:
- [Developer Guide](./docs/README.md)
- API Reference
- ONDC Integration Guide
- Deployment Guide

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- [x] Core backend services
- [x] Database schemas
- [x] ONDC Gateway
- [x] Handshake Engine
- [ ] Business App UI
- [ ] Rider App UI

### Phase 2: Launch
- [ ] Firebase integration
- [ ] Push notifications
- [ ] Analytics dashboard
- [ ] Mission synthesizer AI

### Phase 3: Scale
- [ ] Multi-city expansion
- [ ] Advanced analytics
- [ ] Merchant self-serve portal
- [ ] API for third-party integrations

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- ONDC for the mobility network
- Namma Yatri for the partnership vision
- Local merchants who make communities vibrant

---

**Built with ❤️ for local businesses and smart students**