# UMA Platform - Frequently Asked Questions

## General Questions

### What is UMA?

UMA is a B2B marketing platform that uses ONDC mobility as a fulfillment tool. We're not a ride-hailing app - we help local merchants acquire customers through a unique "Reimbursement Handshake" model.

### How does the Reimbursement Handshake work?

1. User finds a deal on our app
2. User books the deal and gets a QR code
3. User books an ONDC ride and pays the driver directly
4. User shows QR code at merchant location
5. Merchant scans QR → instant wallet transactions
6. Merchant pays (ride + fee), User gets cashback

### Why ONDC?

ONDC is an open network for mobility and commerce in India. It allows us to:
- Access multiple ride providers (Namma Yatri, Chalo, etc.)
- Avoid building our own supply network
- Offer competitive pricing
- Create cross-domain missions (rides + commerce)

## Technical Questions

### What tech stack does UMA use?

**Backend:**
- Node.js + TypeScript + Express
- PostgreSQL (transactional data)
- MongoDB (missions, metadata)
- Firebase (auth, push notifications)

**Mobile:**
- React Native + Expo
- React Navigation
- Mapbox (maps)

### How do you ensure transaction safety?

We use:
- PostgreSQL ACID transactions
- Pessimistic locking on handshake
- One-time QR codes with 24h expiry
- Complete audit trail
- Idempotency keys

### How does the strike system work?

- If a QR code isn't scanned within 24 hours → 1 strike
- 3 strikes → temporary account restriction
- This ensures merchants only get high-intent customers
- Completed bookings reset user's strike count

### What's the difference between CPT and CPA?

- **CPT (Cost Per Trip)**: Fixed fee per verified visit (e.g., ₹20)
- **CPA (Cost Per Acquisition)**: Bonus for NEW customers only (e.g., ₹50)

## Business Questions

### How do merchants benefit?

1. **Guaranteed Footfall**: Pay only for verified visits
2. **Performance Marketing**: 100% measurable ROI
3. **Customer Intel**: New vs. returning customer data
4. **Cost Efficiency**: Better than Zomato/Swiggy CPC ads
5. **Smart Targeting**: Geo-fenced campaigns

### How do users benefit?

1. **Free Rides**: Via cashback after visiting merchant
2. **Discounts**: Additional merchant offers
3. **Missions**: Gamified multi-stop adventures
4. **Wallet**: Instant cashback, easy withdrawal
5. **Badges**: Achievement rewards

### What's your revenue model?

From merchants:
1. CPT fees (₹20 per trip)
2. CPA bonuses (₹50 for new customers)
3. Ride reimbursements (variable)
4. Ad boosts (₹500/week for featured placement)
5. SaaS subscriptions (Pro: ₹999/month)

## Development Questions

### How do I set up the development environment?

```bash
git clone https://github.com/Armour007/rider.git
cd rider
npm install
docker-compose up -d
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### How do I run tests?

```bash
npm test                    # All tests
npm run test:backend        # Backend only
npm run test:watch          # Watch mode
```

### How do I deploy to production?

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for comprehensive guide.

### How do I add a new API endpoint?

1. Create controller in `src/controllers/`
2. Add route in `src/routes/`
3. Register in `src/index.ts`
4. Add tests
5. Update API docs

## ONDC Integration Questions

### What is ONDC?

Open Network for Digital Commerce - India's initiative for decentralized e-commerce and mobility networks.

### What ONDC role does UMA play?

We're a **BAP (Buyer Network Participant)** - we connect users to multiple BPPs (Seller Network Participants).

### Which BPPs do you integrate with?

- **Namma Yatri** (auto-rickshaws)
- **Chalo** (buses, metro)
- **Magicpin** (F&B, commerce)
- More coming soon!

### How do ONDC callbacks work?

ONDC uses async callbacks:
1. We call `/search`
2. BPPs respond via `/on_search` callback
3. We call `/select`
4. BPP responds via `/on_select`
5. And so on...

## Security Questions

### How do you prevent fraud?

1. **Strike System**: Penalizes incomplete bookings
2. **One-time QR codes**: Can't be reused
3. **24-hour expiry**: Limited validity
4. **Transaction monitoring**: Anomaly detection
5. **Merchant wallet**: Pre-loaded, no credit risk

### How is user data protected?

- TLS 1.3 encryption in transit
- AES-256 encryption at rest
- Firebase Auth for secure authentication
- JWT tokens with short expiry
- No PII in logs
- GDPR compliant

### What about payment security?

- Razorpay for secure transactions
- PCI DSS compliant
- No credit card storage
- UPI integration
- 2FA for withdrawals

## Mobile App Questions

### Which platforms are supported?

- iOS 12+
- Android 8.0+

### Do I need both apps?

- **Business App**: For merchants only
- **Rider App**: For users/customers only

### Is offline support available?

Limited offline features:
- View cached deals
- Access QR codes
- View wallet balance
- Full features require internet

## Troubleshooting

### Backend won't start

Check:
1. PostgreSQL is running
2. MongoDB is running
3. Environment variables are set
4. Port 3000 is available

### Database connection fails

Verify:
1. Database credentials in `.env`
2. Database is accessible
3. Firewall rules
4. VPC/security groups (cloud)

### ONDC API errors

Check:
1. ONDC credentials are valid
2. Callback URL is accessible
3. Request signature is correct
4. Network connectivity

### Push notifications not working

Verify:
1. Firebase credentials are correct
2. FCM tokens are registered
3. Notification permissions granted
4. Firebase Cloud Messaging enabled

## Performance Questions

### How many requests can the system handle?

With proper infrastructure:
- 1000+ req/sec on backend
- 10,000+ concurrent users
- < 200ms API response (p95)
- < 500ms handshake execution

### How do you scale?

- Horizontal scaling of backend
- PostgreSQL read replicas
- MongoDB replica sets
- Redis caching layer
- CDN for static assets
- Load balancing

## Future Roadmap

### What's next for UMA?

**Phase 2 (Q1 2024):**
- Multi-city expansion
- Advanced analytics
- ML-powered mission synthesis
- WebSocket real-time updates

**Phase 3 (Q2 2024):**
- Voice-based booking
- Loyalty programs
- B2B2C white-label
- International expansion

## Support

### How do I get help?

- **GitHub Issues**: Bug reports
- **Discussions**: Questions and ideas
- **Email**: support@uma.com
- **Docs**: [Documentation](./docs/README.md)

### How do I contribute?

See [CONTRIBUTING.md](./CONTRIBUTING.md)

### How do I report a security issue?

Email: security@uma.com (PGP key available)

---

**More questions?** Open an issue on GitHub or contact us at dev@uma.com
