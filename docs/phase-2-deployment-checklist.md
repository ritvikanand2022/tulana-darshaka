# Phase 2 Deployment Checklist

## Overview

This checklist ensures a smooth deployment of the Phase 2 authentication and user management system to production.

**Target:** Vercel (Frontend) + Your hosting platform (Backend API)
**Prerequisites:** Phase 2 implementation complete and tested
**Estimated Time:** 2-4 hours for first deployment

---

## Pre-Deployment Checklist

### Code Quality
- [x] All Phase 2 code committed to git
- [x] Web app builds successfully (no TypeScript errors)
- [ ] API builds successfully (fix bcrypt/node-pre-gyp warnings if needed)
- [ ] No console errors in development
- [ ] Code reviewed for security vulnerabilities
- [ ] Sensitive data not committed to git

### Testing
- [ ] Manual testing completed (see phase-2-testing-guide.md)
- [ ] All critical user flows tested
- [ ] Mobile responsiveness verified
- [ ] Token refresh mechanism tested
- [ ] Error handling verified
- [ ] Cross-browser compatibility checked

### Documentation
- [x] Phase 2 completion summary created
- [x] Testing guide created
- [x] Deployment checklist created (this document)
- [ ] API documentation updated
- [ ] User documentation created (if needed)

---

## Environment Configuration

### Required Environment Variables

#### Backend API (.env)
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT Secrets (MUST be different from development)
JWT_SECRET="<32+ character random string>"
JWT_REFRESH_SECRET="<32+ character random string>"

# Server
NODE_ENV=production
PORT=4000

# CORS
CORS_ORIGIN="https://yourdomain.com"

# Optional but recommended
LOG_LEVEL=info
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

**Generate Secrets:**
```bash
# Generate strong JWT secrets
openssl rand -base64 32
# Run this twice for JWT_SECRET and JWT_REFRESH_SECRET
```

#### Frontend Web (.env or Vercel Environment Variables)
```bash
# API URL (your production API)
NUXT_PUBLIC_API_URL=https://api.yourdomain.com

# Site URL
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Security Best Practices

1. **Never use default/example secrets in production**
2. **Use different secrets for staging and production**
3. **Store secrets in secure environment variable systems**
4. **Rotate secrets periodically (every 90 days)**
5. **Use secrets management service (AWS Secrets Manager, etc.)**

---

## Database Setup

### 1. Production Database

**Create Production Database:**
```bash
# Using PostgreSQL (example)
createdb tulana_darshaka_production
```

**Or use managed database:**
- AWS RDS PostgreSQL
- Digital Ocean Managed PostgreSQL
- Heroku Postgres
- Supabase
- Neon

### 2. Run Migrations

```bash
cd apps/api

# Set production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Run migrations (deploy mode - no prompts)
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

**Verify:**
```bash
# Check migration status
npx prisma migrate status

# Expected output: All migrations applied
```

### 3. Backup Strategy

**Before deployment:**
```bash
# Create database backup
pg_dump -U user -d tulana_darshaka_production > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Set up automated backups:**
- Configure daily automated backups
- Test restore procedure
- Store backups in secure location (S3, etc.)

---

## Backend API Deployment

### Option 1: Deploy to Railway

**Steps:**
1. Create account at railway.app
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub:
   ```bash
   # Railway auto-detects monorepo
   # Set root directory: apps/api
   ```
5. Set environment variables in Railway dashboard
6. Deploy and verify

**Railway Configuration:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Option 2: Deploy to Heroku

**Steps:**
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create tulana-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your-secret"
heroku config:set JWT_REFRESH_SECRET="your-secret"
heroku config:set CORS_ORIGIN="https://yourdomain.com"

# Deploy
git subtree push --prefix apps/api heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Check logs
heroku logs --tail
```

### Option 3: Deploy to VPS (Digital Ocean, AWS EC2, etc.)

**Prerequisites:**
- Ubuntu 22.04 LTS server
- Node.js 18+ installed
- PostgreSQL installed
- Nginx installed

**Steps:**
```bash
# SSH into server
ssh user@your-server-ip

# Clone repository
git clone <your-repo-url>
cd tulana-darshaka/apps/api

# Install dependencies
npm install

# Set up environment variables
nano .env
# Add production environment variables

# Run migrations
npx prisma migrate deploy

# Build application
npm run build

# Install PM2 for process management
npm install -g pm2

# Start application with PM2
pm2 start dist/main.js --name tulana-api

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Set up Nginx reverse proxy (see below)
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**SSL Certificate (Let's Encrypt):**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

### Verify API Deployment

**Health Check:**
```bash
curl https://api.yourdomain.com/health

# Expected: { "status": "ok", ... }
```

**Test Authentication:**
```bash
# Test registration
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User"
  }'

# Should return user object and tokens
```

---

## Frontend Deployment (Vercel)

### 1. Prepare for Deployment

**Verify Build:**
```bash
cd apps/web
npm run build

# Should build successfully with no errors
```

**Update Environment Variables:**
```bash
# In Vercel dashboard or .env
NUXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Deploy to Vercel

**Option A: Vercel Dashboard**
1. Login to vercel.com
2. Import Git repository
3. Configure project:
   - Framework Preset: Nuxt.js
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.output`
4. Add environment variables
5. Deploy

**Option B: Vercel CLI**
```bash
cd apps/web

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NUXT_PUBLIC_API_URL production
# Enter: https://api.yourdomain.com
```

### 3. Configure Custom Domain

**In Vercel Dashboard:**
1. Project Settings → Domains
2. Add custom domain: `yourdomain.com`
3. Update DNS records as instructed
4. Wait for DNS propagation (can take up to 48 hours)

### 4. Verify Frontend Deployment

**Tests:**
1. Visit `https://yourdomain.com`
2. Navigate to `/auth/login`
3. Try to register new account
4. Verify registration works end-to-end
5. Check network tab - API calls should go to production API
6. Test on mobile device
7. Verify all pages load correctly

---

## Post-Deployment Configuration

### 1. CORS Configuration

**In API server:**
```typescript
// Verify CORS_ORIGIN in .env matches frontend domain
CORS_ORIGIN=https://yourdomain.com

// Or multiple domains
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

**Test CORS:**
```bash
curl -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://api.yourdomain.com/api/auth/login
```

### 2. Rate Limiting

**Configure rate limiting for auth endpoints:**

```typescript
// In NestJS (example)
@UseGuards(ThrottlerGuard)
@Throttle(5, 60) // 5 requests per 60 seconds
@Post('login')
async login() { ... }
```

**Or use Nginx rate limiting:**
```nginx
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

location /api/auth {
    limit_req zone=auth burst=10;
    proxy_pass http://localhost:4000;
}
```

### 3. Monitoring Setup

**Backend Monitoring:**
- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Configure logging (Winston, Pino)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure alerts for errors/downtime

**Frontend Monitoring:**
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Configure performance monitoring
- [ ] Set up user analytics (optional)

**Example Sentry Setup:**
```typescript
// In main.ts (NestJS)
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 4. Logging

**Configure production logging:**
```typescript
// Winston example
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

**Log important events:**
- User registrations
- Login attempts (failed and successful)
- Token refreshes
- Logout events
- Password changes
- Role changes
- Errors and exceptions

---

## Security Hardening

### 1. SSL/TLS Certificates

- [ ] SSL certificate installed on API domain
- [ ] SSL certificate installed on frontend domain
- [ ] Force HTTPS (redirect HTTP to HTTPS)
- [ ] Verify SSL with SSL Labs test

**Test SSL:**
```bash
# Should return A or A+ rating
https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

### 2. Security Headers

**Add security headers to Nginx:**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

**Or in Nuxt config:**
```typescript
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      },
    },
  },
})
```

### 3. Database Security

- [ ] Database not publicly accessible
- [ ] Strong database password (20+ characters)
- [ ] Database firewall configured
- [ ] Only API server can connect to database
- [ ] SSL/TLS enabled for database connections
- [ ] Regular security updates applied

### 4. API Security

- [ ] JWT secrets are strong and unique
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (via Prisma)
- [ ] XSS protection enabled
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Error messages don't leak info

### 5. Dependency Security

**Run security audits:**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix

# Check for outdated packages
npm outdated
```

**Set up automated security checks:**
- Enable Dependabot on GitHub
- Run npm audit in CI/CD pipeline
- Monitor security advisories

---

## Performance Optimization

### 1. Frontend Optimization

**Nuxt Build Optimization:**
```typescript
export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
  },
  experimental: {
    payloadExtraction: true,
  },
})
```

**Enable Vercel Edge Network:**
- Vercel automatically uses CDN
- Verify assets served from CDN
- Check response headers for `x-vercel-cache`

### 2. Backend Optimization

**Database Indexing:**
```sql
-- Verify indexes exist (created by Prisma)
\d users
\d refresh_tokens

-- Should see indexes on:
-- users: id (PK), email (unique)
-- refresh_tokens: id (PK), token (unique), userId
```

**API Response Caching:**
```typescript
// Cache public endpoints
@CacheKey('products')
@CacheTTL(300) // 5 minutes
@Get('products')
async getProducts() { ... }
```

### 3. Database Connection Pooling

```typescript
// In Prisma schema
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Connection pool settings
  pool = {
    min = 2
    max = 10
    timeout = 20
    idleTimeout = 300
  }
}
```

---

## Rollback Plan

### If Deployment Fails

**Frontend (Vercel):**
1. In Vercel dashboard → Deployments
2. Find previous working deployment
3. Click "Promote to Production"
4. Verify rollback successful

**Backend:**
```bash
# If using Git-based deployment
git revert <commit-hash>
git push origin main

# If using PM2
pm2 stop tulana-api
git checkout <previous-commit>
npm install
npm run build
pm2 restart tulana-api

# If database migration failed
npx prisma migrate resolve --rolled-back <migration-name>
# Restore from backup if needed
psql -U user -d database < backup.sql
```

**Checklist:**
- [ ] Identify what failed
- [ ] Rollback to previous version
- [ ] Verify rollback successful
- [ ] Test critical flows
- [ ] Fix issue before re-deploying
- [ ] Document what went wrong

---

## Post-Deployment Testing

### Smoke Tests (Run Immediately After Deploy)

1. **Registration:**
   - [ ] Can create new account
   - [ ] Receives success message
   - [ ] Redirects to home page
   - [ ] User is logged in

2. **Login:**
   - [ ] Can login with credentials
   - [ ] Receives auth tokens
   - [ ] Redirects properly
   - [ ] Session persists on refresh

3. **Profile:**
   - [ ] Can access profile page
   - [ ] User data displays correctly
   - [ ] Can navigate to other pages

4. **Logout:**
   - [ ] Can logout successfully
   - [ ] Redirects to login
   - [ ] Tokens cleared
   - [ ] Cannot access protected pages

### Load Testing (Optional)

**Use Artillery or similar tool:**
```yaml
# artillery.yml
config:
  target: 'https://api.yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Auth load test"
    flow:
      - post:
          url: "/api/auth/register"
          json:
            email: "user{{ $randomString() }}@test.com"
            password: "TestPass123!"
            name: "Test User"
```

```bash
# Run load test
artillery run artillery.yml
```

---

## Maintenance Tasks

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review failed login attempts

### Weekly
- [ ] Review security logs
- [ ] Check database size/growth
- [ ] Verify backups are running

### Monthly
- [ ] Update dependencies
- [ ] Run security audit
- [ ] Review performance metrics
- [ ] Rotate JWT secrets (optional)
- [ ] Clean up old refresh tokens

**Clean old tokens:**
```sql
-- Delete expired refresh tokens
DELETE FROM refresh_tokens
WHERE "expiresAt" < NOW();
```

### Quarterly
- [ ] Security audit
- [ ] Load testing
- [ ] Dependency updates (major versions)
- [ ] Review and update documentation

---

## Success Metrics

### Deployment Success Indicators
- [ ] Frontend accessible at production URL
- [ ] API accessible and responding
- [ ] Database migrations applied
- [ ] Users can register and login
- [ ] All critical flows working
- [ ] No errors in logs
- [ ] SSL certificates valid
- [ ] Monitoring active

### Performance Targets
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Zero downtime deployment
- [ ] 99.9% uptime

### Security Targets
- [ ] All secrets properly configured
- [ ] SSL/TLS enabled everywhere
- [ ] Rate limiting active
- [ ] No security vulnerabilities (npm audit)
- [ ] Security headers configured

---

## Troubleshooting Common Issues

### Issue: CORS errors in production
**Solution:**
- Verify CORS_ORIGIN in API .env matches frontend domain
- Include www and non-www versions if needed
- Check for trailing slashes
- Restart API server after changes

### Issue: 502 Bad Gateway
**Solution:**
- Check if API server is running
- Verify Nginx proxy configuration
- Check API server logs
- Verify port numbers match

### Issue: Database connection failed
**Solution:**
- Verify DATABASE_URL is correct
- Check database server is running
- Verify firewall allows connections
- Check connection limits not exceeded

### Issue: Tokens not working
**Solution:**
- Verify JWT secrets match between environments
- Check token expiry times
- Clear localStorage and login again
- Verify system clocks are synchronized

### Issue: Slow API responses
**Solution:**
- Enable database query logging
- Check for missing indexes
- Review N+1 query issues
- Enable caching for frequent queries
- Check database connection pool settings

---

## Deployment Completion Checklist

### Pre-Go-Live
- [ ] All environment variables set
- [ ] Database migrated successfully
- [ ] SSL certificates installed
- [ ] DNS records configured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Rollback plan documented

### Go-Live
- [ ] Frontend deployed to production
- [ ] Backend deployed to production
- [ ] Smoke tests passing
- [ ] No errors in logs
- [ ] Monitoring showing healthy status

### Post-Go-Live
- [ ] Test all critical user flows
- [ ] Verify email notifications work (if implemented)
- [ ] Check analytics are tracking
- [ ] Monitor for 24 hours
- [ ] Document any issues
- [ ] Update team on status

### Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Monitoring URLs documented
- [ ] Rollback procedure documented
- [ ] Troubleshooting guide updated

---

## Support & Escalation

### If Issues Arise:
1. Check logs immediately
2. Verify with smoke tests
3. Rollback if critical
4. Document the issue
5. Fix and re-deploy

### Useful Commands:
```bash
# Check API logs
pm2 logs tulana-api

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Check database connections
SELECT count(*) FROM pg_stat_activity;

# Restart API
pm2 restart tulana-api

# Check process status
pm2 status
```

---

## Conclusion

This deployment checklist ensures Phase 2 is deployed safely and successfully to production. Follow each step carefully and verify at each stage.

**Estimated Timeline:**
- Environment setup: 1 hour
- Backend deployment: 1-2 hours
- Frontend deployment: 30 minutes
- Testing and verification: 1 hour
- Monitoring setup: 30 minutes
- **Total: 4-6 hours**

**Remember:**
- Test thoroughly before deploying
- Have a rollback plan ready
- Monitor closely after deployment
- Document everything
- Don't skip security steps

**Status After Completion:**
✅ Phase 2 deployed to production
✅ Authentication system live
✅ User profiles accessible
✅ Monitoring active
✅ Ready for user onboarding
