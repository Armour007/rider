# UMA Platform Deployment Guide

## Prerequisites

- Docker & Docker Compose
- PostgreSQL 14+
- MongoDB 6+
- Node.js 18+
- Firebase account with Cloud Messaging enabled
- ONDC BAP credentials
- Razorpay account (for payments)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/Armour007/rider.git
cd rider
```

### 2. Configure Environment Variables

#### Backend Configuration

```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server
NODE_ENV=production
PORT=3000

# PostgreSQL
POSTGRES_HOST=your-postgres-host
POSTGRES_PORT=5432
POSTGRES_DB=uma_platform
POSTGRES_USER=uma_user
POSTGRES_PASSWORD=secure-password-here

# MongoDB
MONGODB_URI=mongodb://username:password@your-mongo-host:27017/uma_platform

# ONDC
ONDC_GATEWAY_URL=https://gateway.ondc.org
ONDC_BAP_ID=your-bap-id
ONDC_BAP_URI=https://api.yourdomain.com
ONDC_SUBSCRIBER_ID=your-subscriber-id
ONDC_SUBSCRIBER_URL=https://api.yourdomain.com/ondc

# Firebase
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project",...}'

# JWT
JWT_SECRET=your-very-secure-jwt-secret-change-this

# Razorpay
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
```

## Deployment Options

### Option 1: Docker Compose (Recommended for Development)

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

This will start:
- PostgreSQL on port 5432
- MongoDB on port 27017
- Backend API on port 3000

### Option 2: Manual Deployment

#### PostgreSQL Setup

```bash
# Install PostgreSQL
sudo apt-get install postgresql-14

# Create database
sudo -u postgres psql
CREATE DATABASE uma_platform;
CREATE USER uma_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE uma_platform TO uma_user;
\q
```

#### MongoDB Setup

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Backend Deployment

```bash
# Install dependencies
npm install

# Build backend
cd packages/backend
npm install
npm run build

# Run migrations (if any)
npm run migrate

# Start backend
npm start

# Or with PM2 for production
npm install -g pm2
pm2 start dist/index.js --name uma-backend
pm2 save
pm2 startup
```

### Option 3: Cloud Deployment

#### AWS Deployment

1. **RDS for PostgreSQL**
   - Create PostgreSQL 14 instance
   - Configure security groups
   - Note down endpoint and credentials

2. **DocumentDB for MongoDB**
   - Create DocumentDB cluster
   - Configure VPC and security groups
   - Note down connection string

3. **Elastic Beanstalk for Backend**
   ```bash
   # Install EB CLI
   pip install awsebcli
   
   # Initialize
   eb init uma-backend --platform node.js --region us-east-1
   
   # Create environment
   eb create uma-production
   
   # Configure environment variables
   eb setenv NODE_ENV=production \
     POSTGRES_HOST=your-rds-endpoint \
     MONGODB_URI=your-documentdb-uri \
     # ... other vars
   
   # Deploy
   eb deploy
   ```

4. **CloudFront for CDN**
   - Configure distribution
   - Point to EB endpoint

#### Google Cloud Platform

1. **Cloud SQL for PostgreSQL**
   ```bash
   gcloud sql instances create uma-postgres \
     --database-version=POSTGRES_14 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

2. **Cloud Run for Backend**
   ```bash
   # Build Docker image
   docker build -t gcr.io/your-project/uma-backend ./packages/backend
   
   # Push to GCR
   docker push gcr.io/your-project/uma-backend
   
   # Deploy to Cloud Run
   gcloud run deploy uma-backend \
     --image gcr.io/your-project/uma-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

#### DigitalOcean

1. **Managed PostgreSQL**
   - Create managed database
   - Configure firewall rules

2. **App Platform**
   ```yaml
   # .do/app.yaml
   name: uma-platform
   services:
   - name: backend
     github:
       repo: Armour007/rider
       branch: main
       deploy_on_push: true
     build_command: cd packages/backend && npm install && npm run build
     run_command: cd packages/backend && npm start
     envs:
     - key: NODE_ENV
       value: production
     - key: POSTGRES_HOST
       value: ${db.HOSTNAME}
     - key: POSTGRES_PASSWORD
       value: ${db.PASSWORD}
   
   databases:
   - name: db
     engine: PG
     version: "14"
   ```

## Mobile App Deployment

### iOS Deployment

```bash
cd apps/rider-app  # or business-app

# Install dependencies
npm install

# Build for iOS
expo build:ios

# Or with EAS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android Deployment

```bash
cd apps/rider-app  # or business-app

# Install dependencies
npm install

# Build for Android
expo build:android

# Or with EAS
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

## Production Checklist

### Security

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable SSL/TLS (use Let's Encrypt)
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)
- [ ] Encrypt sensitive environment variables
- [ ] Enable database encryption at rest
- [ ] Configure VPC and security groups
- [ ] Enable MFA for admin accounts

### Performance

- [ ] Configure PostgreSQL connection pooling
- [ ] Enable MongoDB replica set
- [ ] Set up Redis for caching
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Optimize database indexes
- [ ] Configure auto-scaling
- [ ] Set up load balancer

### Monitoring

- [ ] Set up application monitoring (Datadog/New Relic)
- [ ] Configure error tracking (Sentry)
- [ ] Enable database monitoring
- [ ] Set up uptime monitoring
- [ ] Configure alert rules
- [ ] Enable log aggregation (ELK/CloudWatch)
- [ ] Set up performance metrics
- [ ] Configure health checks

### Backup & Recovery

- [ ] Configure automated database backups
- [ ] Test backup restoration
- [ ] Set up point-in-time recovery
- [ ] Configure backup retention policy
- [ ] Document recovery procedures
- [ ] Set up disaster recovery plan
- [ ] Configure multi-region replication

### CI/CD

- [ ] Set up GitHub Actions workflow
- [ ] Configure automated tests
- [ ] Enable code quality checks
- [ ] Set up staging environment
- [ ] Configure blue-green deployment
- [ ] Enable automated rollbacks
- [ ] Set up deployment notifications

## Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/health

# Database connectivity
curl https://api.yourdomain.com/health/db
```

### Logs

```bash
# View application logs
pm2 logs uma-backend

# Or with Docker
docker-compose logs -f backend

# PostgreSQL logs
tail -f /var/log/postgresql/postgresql-14-main.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Metrics

Monitor these key metrics:

1. **Application Metrics**
   - Request rate
   - Response time (p50, p95, p99)
   - Error rate
   - Active connections

2. **Database Metrics**
   - Connection pool usage
   - Query performance
   - Disk I/O
   - Replication lag

3. **Business Metrics**
   - Handshake success rate
   - ONDC API success rate
   - Active users
   - Transaction volume

### Scaling

#### Vertical Scaling
```bash
# Increase instance size
# AWS: Modify instance type
# GCP: Change machine type
# DigitalOcean: Resize droplet
```

#### Horizontal Scaling
```bash
# Add more backend instances
# Configure load balancer
# Enable session affinity if needed
```

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend printenv

# Check database connectivity
docker-compose exec backend npm run db:test
```

### Database connection issues

```bash
# Test PostgreSQL
psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB

# Test MongoDB
mongosh $MONGODB_URI
```

### ONDC integration issues

```bash
# Verify ONDC credentials
curl -X POST https://gateway.ondc.org/search \
  -H "Authorization: Bearer $ONDC_TOKEN" \
  -d '...'

# Check callback endpoint
curl https://api.yourdomain.com/api/ondc/on_search
```

## Support

For deployment issues:
- GitHub Issues: https://github.com/Armour007/rider/issues
- Email: devops@uma.com
- Slack: #uma-deployment

## Rollback Procedure

```bash
# With Docker
docker-compose down
git checkout previous-commit
docker-compose up -d

# With PM2
pm2 stop uma-backend
git checkout previous-commit
cd packages/backend
npm run build
pm2 restart uma-backend
```

## License

MIT License - See LICENSE file
