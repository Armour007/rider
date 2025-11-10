# UMA Platform Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         UMA Platform                            │
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  Business App    │              │   Rider App      │        │
│  │  (React Native)  │              │  (React Native)  │        │
│  │                  │              │                  │        │
│  │  • ROI Dashboard │              │  • Discovery     │        │
│  │  • QR Scanner    │              │  • Missions      │        │
│  │  • Campaign Mgmt │              │  • ONDC Booking  │        │
│  │  • Analytics     │              │  • Gamification  │        │
│  └────────┬─────────┘              └────────┬─────────┘        │
│           │                                 │                  │
│           └─────────────┬───────────────────┘                  │
│                         │                                      │
│                         ▼                                      │
│              ┌──────────────────────┐                          │
│              │   API Gateway        │                          │
│              │   (Express)          │                          │
│              └──────────┬───────────┘                          │
│                         │                                      │
│         ┌───────────────┼───────────────┐                      │
│         │               │               │                      │
│         ▼               ▼               ▼                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │  Handshake  │ │    ONDC     │ │Gamification │              │
│  │   Engine    │ │   Gateway   │ │   Service   │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│         │               │               │                      │
│         └───────────────┼───────────────┘                      │
│                         │                                      │
│              ┌──────────┴───────────┐                          │
│              │                      │                          │
│              ▼                      ▼                          │
│      ┌──────────────┐      ┌──────────────┐                   │
│      │  PostgreSQL  │      │   MongoDB    │                   │
│      │              │      │              │                   │
│      │ • Users      │      │ • Missions   │                   │
│      │ • Merchants  │      │ • Badges     │                   │
│      │ • Campaigns  │      │ • Cache      │                   │
│      │ • Rides      │      │              │                   │
│      │ • Txns       │      │              │                   │
│      └──────────────┘      └──────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   ONDC Network       │
              │                      │
              │  • Namma Yatri (BPP) │
              │  • Chalo (BPP)       │
              │  • Magicpin (BPP)    │
              └──────────────────────┘
```

## Component Architecture

### Backend Services

```
packages/backend/
├── src/
│   ├── services/
│   │   ├── handshake.service.ts      # Core transaction logic
│   │   ├── ondc-gateway.service.ts   # ONDC BAP implementation
│   │   └── gamification.service.ts   # Strikes, badges, missions
│   │
│   ├── models/
│   │   ├── postgres.ts               # Sequelize models
│   │   └── mongodb.ts                # Mongoose schemas
│   │
│   ├── controllers/
│   │   ├── handshake.controller.ts
│   │   ├── ride.controller.ts
│   │   └── ondc.controller.ts
│   │
│   ├── routes/
│   │   └── *.routes.ts
│   │
│   └── utils/
│       ├── notifications.ts           # Firebase push
│       └── qrcode.ts                  # QR generation
```

## Data Flow

### Handshake Flow (Core IP)

```
1. Merchant scans QR
   ↓
2. POST /api/handshake/execute
   ↓
3. Handshake Engine validates QR
   ↓
4. BEGIN TRANSACTION
   ├─→ Debit Merchant Wallet
   ├─→ Credit User Wallet
   ├─→ Update Ride Status
   └─→ Log Transaction
   ↓
5. COMMIT TRANSACTION
   ↓
6. Send Push Notification
   ↓
7. Return Success Response
```

### ONDC Booking Flow

```
1. User searches for ride
   ↓
2. BAP → /search → ONDC Gateway
   ↓
3. Gateway → Multiple BPPs (Namma Yatri, Chalo)
   ↓
4. BPPs → /on_search → BAP (callback)
   ↓
5. User selects ride
   ↓
6. BAP → /select → BPP
   ↓
7. BPP → /on_select → BAP
   ↓
8. BAP → /init → BPP
   ↓
9. BPP → /on_init → BAP
   ↓
10. BAP → /confirm → BPP
    ↓
11. BPP → /on_confirm → BAP
    ↓
12. Ride booked!
```

## Security Architecture

### Authentication
- Firebase Auth for phone OTP
- JWT tokens for API authentication
- Refresh token rotation

### Transaction Safety
- PostgreSQL ACID compliance
- Pessimistic locking on handshake
- Idempotency keys for critical operations

### Data Protection
- TLS 1.3 for all communications
- Encrypted secrets (Firebase, ONDC keys)
- PII data encryption at rest

## Scalability

### Horizontal Scaling
```
Load Balancer
    │
    ├──→ Backend Instance 1
    ├──→ Backend Instance 2
    └──→ Backend Instance N
         │
         ├──→ PostgreSQL Primary
         │    └──→ Read Replicas
         │
         └──→ MongoDB Cluster
```

### Caching Strategy
- Redis for session management
- MongoDB for ONDC response caching
- CDN for static assets

### Performance Targets
- Handshake execution: < 500ms
- ONDC search: < 2s
- API response: < 200ms (p95)

## Monitoring & Observability

### Metrics
- Transaction success rate
- ONDC API latency
- Wallet balance integrity
- Campaign ROI calculations

### Logging
- Winston for structured logs
- Centralized log aggregation (ELK/Datadog)
- Error tracking (Sentry)

### Alerts
- Failed handshake > 5%
- Low merchant wallet balances
- ONDC API failures
- Database connection issues

## Deployment Zones

### Multi-City Architecture
```
Mumbai Zone          Bangalore Zone         Delhi Zone
     │                    │                      │
     ├─ Local DB          ├─ Local DB            ├─ Local DB
     ├─ Cache             ├─ Cache               ├─ Cache
     └─ Backend           └─ Backend             └─ Backend
           │                    │                      │
           └────────────────────┴──────────────────────┘
                              │
                    Central Analytics DB
```

## Disaster Recovery

### Backup Strategy
- PostgreSQL: Continuous WAL archiving
- MongoDB: Replica set with 3 nodes
- Daily full backups to S3
- Point-in-time recovery capability

### Failover
- Automatic PostgreSQL failover (Patroni)
- MongoDB automatic replica election
- Multi-region deployment for critical services

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Backend | Node.js + TypeScript | API server |
| API Framework | Express | REST API |
| Transactional DB | PostgreSQL 14 | Users, rides, wallets |
| Metadata DB | MongoDB 6 | Missions, badges |
| Cache | Redis (future) | Session, ONDC cache |
| Auth | Firebase Auth | Phone OTP |
| Push | Firebase FCM | Notifications |
| Mobile | React Native | iOS & Android apps |
| Maps | Mapbox | Discovery map |
| QR | react-native-camera | QR scanning |
| Payments | Razorpay | Wallet withdrawals |
| ONDC | Custom BAP | Mobility orchestration |

## Future Enhancements

### Phase 2
- GraphQL API for better mobile performance
- WebSocket for real-time updates
- ML-powered mission synthesis
- Advanced fraud detection

### Phase 3
- Multi-language support
- Voice-based booking
- Loyalty program integration
- B2B2C white-label solution
