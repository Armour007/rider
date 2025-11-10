# UMA Platform - Verification & Testing Guide

## Pre-Installation Checks

Before running the platform, verify you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Docker & Docker Compose installed (`docker --version`)
- [ ] Git installed (`git --version`)
- [ ] PostgreSQL 14+ (if running manually)
- [ ] MongoDB 6+ (if running manually)

## Installation Verification

### Method 1: Docker (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/Armour007/rider.git
cd rider

# 2. Start services
docker-compose up -d

# 3. Verify services are running
docker-compose ps

# Expected output:
# NAME              STATUS       PORTS
# uma-backend       Up           0.0.0.0:3000->3000/tcp
# uma-postgres      Up (healthy) 0.0.0.0:5432->5432/tcp
# uma-mongodb       Up (healthy) 0.0.0.0:27017->27017/tcp

# 4. Test health endpoint
curl http://localhost:3000/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2023-11-10T...",
#   "service": "UMA Backend"
# }

# 5. View logs
docker-compose logs -f backend
```

### Method 2: Manual Installation

```bash
# 1. Clone repository
git clone https://github.com/Armour007/rider.git
cd rider

# 2. Install root dependencies
npm install

# 3. Setup backend
cd packages/backend
npm install

# 4. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 5. Start PostgreSQL and MongoDB
# (Ensure they're running on ports 5432 and 27017)

# 6. Run backend
npm run dev

# Expected output:
# PostgreSQL connection established successfully.
# MongoDB connection established successfully.
# 🚀 UMA Backend Server running on port 3000

# 7. Test (in another terminal)
curl http://localhost:3000/health
```

## Feature Verification

### 1. Database Connectivity

```bash
# Test PostgreSQL connection
docker-compose exec postgres psql -U postgres -d uma_platform -c "SELECT version();"

# Test MongoDB connection
docker-compose exec mongodb mongosh --eval "db.version()"
```

### 2. API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Handshake endpoint (will fail without valid QR, but endpoint exists)
curl -X POST http://localhost:3000/api/handshake/execute \
  -H "Content-Type: application/json" \
  -d '{"qrData": "test"}'

# Expected: 400 Bad Request (because QR is invalid)
# This confirms the endpoint is working
```

### 3. TypeScript Compilation

```bash
cd packages/backend
npm run build

# Expected: Creates 'dist' folder with compiled JavaScript
ls -la dist/
```

### 4. Test Suite

```bash
cd packages/backend
npm test

# Expected: Jest runs tests
# Some tests may be skipped (placeholder tests)
```

## Code Quality Checks

### Linting
```bash
cd packages/backend
npm run lint || echo "Lint command not fully configured yet"
```

### Type Checking
```bash
cd packages/backend
npx tsc --noEmit

# Note: Will show errors until dependencies are installed
# After npm install, should show no errors
```

## Troubleshooting

### Issue: Docker containers won't start

**Solution:**
```bash
# Check Docker is running
docker info

# Remove old containers
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

### Issue: Port already in use

**Solution:**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process or change port in docker-compose.yml
# Change: "3001:3000" to use port 3001 instead
```

### Issue: Database connection failed

**Solution:**
```bash
# Verify database is running
docker-compose ps

# Check logs
docker-compose logs postgres
docker-compose logs mongodb

# Restart services
docker-compose restart
```

### Issue: TypeScript errors

**Solution:**
```bash
# Install dependencies
cd packages/backend
npm install

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

## Testing Scenarios

### Scenario 1: Book a Deal

```bash
# 1. Create a test user (manually insert into DB)
docker-compose exec postgres psql -U postgres -d uma_platform

INSERT INTO users (id, phone_number, firebase_uid, wallet, strike_count)
VALUES ('user-123', '+919876543210', 'firebase-uid-123', 0, 0);

# 2. Create a test merchant
INSERT INTO merchants (id, business_name, phone_number, email, wallet, location)
VALUES ('merchant-123', 'Test Restaurant', '+919876543211', 'test@restaurant.com', 10000, '{"lat":13.35,"lng":74.79,"address":"Test"}');

# 3. Create a test campaign
INSERT INTO campaigns (id, merchant_id, offer_title, discount_percentage, ride_reimbursement, cpt_fee)
VALUES ('campaign-123', 'merchant-123', 'Test Offer', 10, 150, 20);

# 4. Book via API
curl -X POST http://localhost:3000/api/rides/book \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "campaignId": "campaign-123"
  }'

# Expected: Returns QR code and ride details
```

### Scenario 2: Execute Handshake

```bash
# Using the QR code from previous scenario
curl -X POST http://localhost:3000/api/handshake/execute \
  -H "Content-Type: application/json" \
  -d '{
    "qrData": "UMA-RIDE-<from-previous-response>"
  }'

# Expected: Success response with discount info
# User wallet credited, merchant wallet debited
```

## Performance Verification

### Load Testing (Optional)

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test health endpoint
ab -n 1000 -c 10 http://localhost:3000/health

# Expected: 
# - Requests per second > 100
# - No failed requests
```

## Security Verification

```bash
# 1. Check environment variables are not exposed
curl http://localhost:3000/api/config
# Should return 404 or access denied

# 2. Verify CORS is configured
curl -I http://localhost:3000/health
# Should show CORS headers

# 3. Check for SQL injection protection
curl -X POST http://localhost:3000/api/handshake/execute \
  -H "Content-Type: application/json" \
  -d '{"qrData": "'; DROP TABLE users; --"}'
# Should handle safely without error
```

## Verification Checklist

- [ ] Docker containers start successfully
- [ ] Health endpoint returns 200 OK
- [ ] PostgreSQL connection works
- [ ] MongoDB connection works
- [ ] TypeScript compiles without errors (after npm install)
- [ ] API endpoints respond correctly
- [ ] Database tables are created
- [ ] Tests run (even if skipped)
- [ ] Logs show no critical errors
- [ ] Documentation is accessible

## Success Criteria

✅ **Minimum Success:**
- Backend starts without errors
- Health check returns 200
- Databases connect successfully

✅ **Full Success:**
- All API endpoints respond
- Database transactions work
- Tests pass
- No TypeScript errors
- Docker builds successfully

## Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify configuration: Review `.env` file
3. Read documentation: See `docs/` folder
4. Check FAQ: See `FAQ.md`
5. Open an issue: GitHub Issues

## Next Steps After Verification

1. **Development**: Start building mobile app UI
2. **Testing**: Add comprehensive test coverage
3. **Deployment**: Follow `docs/DEPLOYMENT.md`
4. **Monitoring**: Set up logging and alerts
5. **Launch**: Onboard first merchants

---

**Verification Date**: November 2023  
**Platform Version**: 1.0.0  
**Status**: Backend Ready for Testing ✅
