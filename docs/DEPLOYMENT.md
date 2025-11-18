# Tulana Darshaka - Deployment Guide

Complete guide for deploying the Tulana Darshaka product comparison platform to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Production Checklist](#production-checklist)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: v14.x or higher
- **Git**: v2.x or higher
- **Docker** (optional): v20.x or higher
- **Docker Compose** (optional): v2.x or higher

### Required Accounts

- **Hosting Provider**: Vercel, Netlify, Railway, or AWS
- **Database Provider**: Railway, Supabase, or Amazon RDS
- **Domain Name**: Optional but recommended

## Environment Configuration

### Backend (.env)

Create `/apps/api/.env.production`:

```env
# Application
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL="postgresql://user:password@host:5432/tulana_darshaka?schema=public"

# CORS
CORS_ORIGIN=https://your-domain.com

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info

# Optional: Analytics
ANALYTICS_ID=your-analytics-id

# Optional: Error Tracking
SENTRY_DSN=your-sentry-dsn
```

### Frontend (.env)

Create `/apps/web/.env.production`:

```env
# API
NUXT_PUBLIC_API_URL=https://api.your-domain.com

# Site
NUXT_PUBLIC_SITE_URL=https://your-domain.com
NUXT_PUBLIC_SITE_NAME=Tulana Darshaka

# Optional: Analytics
NUXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Error Tracking
NUXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Database Setup

### 1. Create Database

**Option A: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Add PostgreSQL
railway add postgresql

# Get connection string
railway variables
```

**Option B: Supabase**
```bash
# Create project at https://supabase.com
# Navigate to Settings > Database
# Copy connection string (use connection pooling for production)
```

**Option C: Local PostgreSQL**
```bash
# Install PostgreSQL
sudo apt-get install postgresql  # Ubuntu/Debian
brew install postgresql           # macOS

# Create database
createdb tulana_darshaka

# Set password
psql tulana_darshaka
\password your_user
```

### 2. Run Migrations

```bash
cd apps/api

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run seed
```

### 3. Verify Database

```bash
# Check tables
npx prisma studio

# Or via psql
psql $DATABASE_URL -c "SELECT count(*) FROM \"Product\";"
```

## Backend Deployment

### Option A: Railway (Recommended)

**1. Prepare for Deployment**

```bash
cd apps/api

# Create railway.json
cat > railway.json << EOF
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
```

**2. Deploy**

```bash
# Initialize Railway project
railway init

# Link to database (if not already linked)
railway link

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3001

# Deploy
railway up

# Get URL
railway domain
```

**3. Configure Custom Domain**

```bash
# Add custom domain
railway domain add api.your-domain.com

# Update DNS records (in your domain registrar):
# Type: CNAME
# Name: api
# Value: [railway-provided-domain]
```

### Option B: Heroku

```bash
cd apps/api

# Login to Heroku
heroku login

# Create app
heroku create tulana-darshaka-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-domain.com

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Check logs
heroku logs --tail
```

### Option C: Docker + AWS/DigitalOcean

See [Docker Deployment](#docker-deployment) section below.

## Frontend Deployment

### Option A: Vercel (Recommended)

**1. Install Vercel CLI**

```bash
npm install -g vercel
```

**2. Deploy**

```bash
cd apps/web

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables (in Vercel Dashboard)
# Or via CLI:
vercel env add NUXT_PUBLIC_API_URL production
# Enter: https://api.your-domain.com
```

**3. Configure Custom Domain**

```bash
# Add domain in Vercel Dashboard
# Or via CLI:
vercel domains add your-domain.com

# Vercel will provide DNS records to add to your registrar
```

### Option B: Netlify

**1. Install Netlify CLI**

```bash
npm install -g netlify-cli
```

**2. Deploy**

```bash
cd apps/web

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod

# Set environment variables
netlify env:set NUXT_PUBLIC_API_URL https://api.your-domain.com
```

**3. Configure Build Settings**

Create `/apps/web/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option C: Static Hosting (Cloudflare Pages, GitHub Pages)

```bash
cd apps/web

# Build for static hosting
npm run generate

# Output will be in .output/public
# Upload this directory to your static host
```

## Docker Deployment

### 1. Build Images

**Backend Dockerfile** (`apps/api/Dockerfile`):

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

**Frontend Dockerfile** (`apps/web/Dockerfile`):

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY package*.json ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

### 2. Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: tulana_darshaka
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/tulana_darshaka
      NODE_ENV: production
      PORT: 3001
    depends_on:
      - postgres
    networks:
      - app-network
    restart: unless-stopped

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    environment:
      NUXT_PUBLIC_API_URL: http://api:3001
    depends_on:
      - api
    ports:
      - "80:3000"
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### 3. Deploy with Docker

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

## Production Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Rate limiting configured
- [ ] SSL/TLS certificates obtained
- [ ] Domain DNS configured
- [ ] Backup strategy in place

### Security

- [ ] Change default passwords
- [ ] Enable HTTPS only
- [ ] Configure CSP headers
- [ ] Set up CORS properly
- [ ] Enable rate limiting
- [ ] Remove debug logs
- [ ] Set secure cookie flags
- [ ] Configure helmet.js (backend)
- [ ] Enable SQL injection protection
- [ ] Set up DDoS protection

### Performance

- [ ] Enable gzip/brotli compression
- [ ] Configure CDN (Cloudflare, etc.)
- [ ] Set up caching headers
- [ ] Optimize images
- [ ] Minify assets
- [ ] Enable database connection pooling
- [ ] Configure database indexes
- [ ] Set up Redis cache (optional)

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics, Plausible)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure log aggregation (Datadog, Logtail)
- [ ] Set up performance monitoring (New Relic, AppSignal)
- [ ] Create alerts for critical errors
- [ ] Set up database monitoring

### Documentation

- [ ] API documentation published
- [ ] User guides created
- [ ] Admin documentation written
- [ ] Changelog maintained
- [ ] Incident response plan documented

## Monitoring & Maintenance

### Health Checks

**Backend Health Endpoints:**
- GET `/` - Basic health check
- GET `/health` - Detailed health with uptime and memory
- GET `/api` - Swagger documentation

**Test Health:**
```bash
curl https://api.your-domain.com/health
```

### Logging

**View Production Logs:**

```bash
# Railway
railway logs

# Heroku
heroku logs --tail

# Docker
docker-compose logs -f api
```

### Database Backups

**Automated Backups:**

```bash
# PostgreSQL backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
# Upload to S3 or other storage
```

**Set up cron job:**
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup-script.sh
```

### Updates

**Update Dependencies:**

```bash
# Check for updates
npm outdated

# Update all
npm update

# Update Prisma
npm install @prisma/client@latest prisma@latest

# Regenerate client
npx prisma generate

# Test locally
npm test

# Deploy
```

## Troubleshooting

### Common Issues

**1. Database Connection Errors**

```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1"

# Verify SSL settings
# Add ?sslmode=require to DATABASE_URL if needed
```

**2. CORS Errors**

```javascript
// apps/api/src/main.ts
app.enableCors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
});
```

**3. Build Failures**

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Clear Prisma cache
rm -rf node_modules/.prisma
npx prisma generate
```

**4. Out of Memory**

```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**5. Slow Queries**

```sql
-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Add indexes
CREATE INDEX idx_product_name ON "Product"(name);
CREATE INDEX idx_review_product ON "Review"("productId");
```

### Getting Help

- **Documentation**: https://docs.tulana-darshaka.com
- **GitHub Issues**: https://github.com/your-org/tulana-darshaka/issues
- **Discord**: https://discord.gg/tulana-darshaka
- **Email**: support@tulana-darshaka.com

## Rollback Procedure

**If deployment fails:**

```bash
# Railway
railway rollback

# Heroku
heroku releases:rollback

# Vercel
vercel rollback

# Docker
docker-compose down
docker-compose up -d --build [previous-tag]
```

## Performance Benchmarks

**Target Metrics:**
- API response time: < 200ms (95th percentile)
- Page load time: < 2s (First Contentful Paint)
- Time to Interactive: < 3s
- Database queries: < 100ms (average)
- Uptime: 99.9%

**Measure Performance:**

```bash
# Backend
curl -w "@curl-format.txt" -o /dev/null -s https://api.your-domain.com/health

# Frontend (Lighthouse)
npx lighthouse https://your-domain.com --view
```

## Security Hardening

### SSL/TLS Configuration

```nginx
# Nginx configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
```

### Security Headers

```typescript
// apps/api/src/main.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Rate Limiting

Already configured in `app.module.ts`:
- 60-second window
- 100 requests per window
- Adjust based on traffic needs

## Scaling Strategies

### Horizontal Scaling

```bash
# Railway: Scale via dashboard
# Or multiple instances in docker-compose:

services:
  api:
    deploy:
      replicas: 3
```

### Database Scaling

- Enable read replicas
- Set up connection pooling (PgBouncer)
- Implement caching (Redis)
- Optimize indexes

### CDN Setup

```bash
# Cloudflare
# 1. Add site to Cloudflare
# 2. Update nameservers
# 3. Enable caching and optimization

# Or AWS CloudFront
aws cloudfront create-distribution \
  --origin-domain-name your-domain.com
```

## Cost Optimization

**Expected Monthly Costs (MVP):**

- **Railway**: $5-20/month (database + hosting)
- **Vercel**: $0 (hobby tier)
- **Domain**: $10-15/year
- **Total**: ~$10-25/month

**Scaling Costs:**

- **Railway Pro**: $20-50/month (higher limits)
- **Vercel Pro**: $20/month (team features)
- **Database**: $10-100/month (based on size)
- **CDN**: $0-20/month (based on traffic)

## Conclusion

Your Tulana Darshaka MVP is now deployed and production-ready! Monitor the health endpoints, set up alerts, and iterate based on user feedback.

For questions or issues, refer to the troubleshooting section or reach out to the development team.

Happy deploying! 🚀
