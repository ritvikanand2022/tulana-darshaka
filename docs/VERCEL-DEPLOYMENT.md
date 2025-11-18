# Vercel Deployment Guide for Tulana Darshaka

This guide will walk you through deploying the Tulana Darshaka application to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Git repository with your code pushed to GitHub, GitLab, or Bitbucket
- Database deployed (Railway PostgreSQL, Supabase, or other provider)
- Backend API deployed (Railway, Heroku, or other provider)

## Architecture Overview

Tulana Darshaka uses a separate frontend and backend architecture:
- **Frontend (Nuxt 3)**: Deploy to Vercel
- **Backend (NestJS)**: Deploy to Railway, Heroku, or similar
- **Database (PostgreSQL)**: Railway, Supabase, or AWS RDS

## Step 1: Prepare Your Backend API

Before deploying the frontend, ensure your backend API is deployed and accessible:

### Deploy Backend to Railway (Recommended)

1. Go to https://railway.app and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and choose the `apps/api` directory
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```
5. Railway will automatically detect NestJS and deploy
6. Note your API URL (e.g., `https://your-app.up.railway.app`)

### Alternative: Deploy Backend to Heroku

```bash
# From the repository root
cd apps/api
heroku create tulana-api
heroku addons:create heroku-postgresql:hobby-dev
git subtree push --prefix apps/api heroku main
```

## Step 2: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com and sign in
   - Click "Add New" → "Project"

2. **Import Git Repository**
   - Select your Git provider (GitHub, GitLab, Bitbucket)
   - Import the `tulana-darshaka` repository
   - Vercel will detect it as a Nuxt.js project

3. **Configure Project Settings**
   - **Framework Preset**: Nuxt.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`
   - **Install Command**: `npm install`

4. **Set Environment Variables**

   Add the following environment variables in the Vercel dashboard:

   ```
   NUXT_PUBLIC_API_URL=https://your-api-url.up.railway.app
   NUXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   ```

   Replace:
   - `https://your-api-url.up.railway.app` with your actual backend API URL
   - `https://your-app.vercel.app` with your Vercel deployment URL (you can use the auto-generated one)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - First deployment takes 2-3 minutes

6. **Update CORS Settings**

   Once deployed, update your backend API's CORS settings to allow requests from your Vercel URL:

   In `apps/api/src/main.ts` or environment variables:
   ```typescript
   app.enableCors({
     origin: [
       'http://localhost:3000',
       'https://your-app.vercel.app',
       'https://your-app-*.vercel.app' // For preview deployments
     ],
     credentials: true,
   });
   ```

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to the web app directory
cd apps/web

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: tulana-darshaka
# - Directory: ./
# - Override settings? N

# Add environment variables
vercel env add NUXT_PUBLIC_API_URL
# Enter: https://your-api-url.up.railway.app

vercel env add NUXT_PUBLIC_SITE_URL
# Enter: https://your-app.vercel.app

# Deploy to production
vercel --prod
```

## Step 3: Verify Deployment

After deployment, verify everything works:

1. **Check Homepage**: Visit your Vercel URL
2. **Test API Connection**: Try browsing products
3. **Test Features**:
   - Product listing and filtering
   - Product detail pages
   - Comparison functionality
   - Search (⌘K or Ctrl+K)
   - Dark/light theme toggle

## Step 4: Configure Custom Domain (Optional)

1. **Add Custom Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `tulana-darshaka.com`)

2. **Update DNS Records**

   Add these DNS records at your domain provider:

   **For apex domain (example.com)**:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www subdomain**:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Update Environment Variables**

   Update `NUXT_PUBLIC_SITE_URL` to your custom domain:
   ```
   NUXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

## Step 5: Set Up Continuous Deployment

Vercel automatically sets up continuous deployment:

- **Production**: Pushes to `main` branch deploy to production
- **Preview**: Pull requests get preview deployments
- **Development**: Pushes to other branches get development deployments

### Preview Deployments

Every pull request gets its own preview URL:
```
https://tulana-darshaka-git-feature-branch.vercel.app
```

This is perfect for:
- Testing new features
- Sharing work with team members
- QA before merging to main

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NUXT_PUBLIC_API_URL` | Backend API base URL | `https://api.tulana.com` |
| `NUXT_PUBLIC_SITE_URL` | Frontend site URL | `https://tulana-darshaka.com` |

## Build Settings Reference

| Setting | Value |
|---------|-------|
| Framework Preset | Nuxt.js |
| Build Command | `npm run build` |
| Output Directory | `.output/public` |
| Install Command | `npm install` |
| Node Version | 18.x |
| Root Directory | `apps/web` |

## Troubleshooting

### Build Fails with "Module not found"

**Solution**: Ensure all dependencies are in `package.json` and run `npm install` locally first.

### API Requests Fail (CORS errors)

**Problem**: Backend not allowing requests from Vercel domain

**Solution**: Update CORS configuration in backend to include:
```
https://your-app.vercel.app
https://your-app-*.vercel.app
```

### Environment Variables Not Working

**Solution**:
1. Check that variables are prefixed with `NUXT_PUBLIC_`
2. Redeploy after adding/changing environment variables
3. Use `console.log(useRuntimeConfig().public)` to debug

### Build Succeeds But Site Shows 500 Error

**Possible Causes**:
1. Missing or incorrect environment variables
2. Backend API not accessible
3. Database connection issues

**Solution**:
1. Check Vercel Functions logs in dashboard
2. Verify all environment variables are set
3. Test API URL directly in browser
4. Check backend API logs

### TypeScript Build Errors

**Solution**: We've already fixed all TypeScript errors. If you encounter new ones:
1. Run `npm run build` locally first
2. Fix any type errors in your code
3. Ensure `vue-tsc` and `typescript` are installed

## Performance Optimization

### Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

In `app.vue`:
```typescript
import { inject } from '@vercel/analytics'
inject()
```

### Enable Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

### Configure Caching

Create `vercel.json` in `apps/web`:
```json
{
  "headers": [
    {
      "source": "/_nuxt/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Monitoring and Logs

### View Build Logs

1. Go to Vercel Dashboard → Your Project
2. Click on a deployment
3. View "Building" tab for build logs

### View Runtime Logs

1. Go to Vercel Dashboard → Your Project
2. Click "Functions" tab
3. View server-side logs

### Set Up Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Datadog for APM

## Production Checklist

Before going live, ensure:

- [ ] Backend API is deployed and accessible
- [ ] Database is provisioned with proper backups
- [ ] All environment variables are set
- [ ] CORS is configured correctly
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is active (automatic with Vercel)
- [ ] All features tested in production environment
- [ ] Error tracking is set up
- [ ] Analytics are configured

## Cost Estimate

### Free Tier (Hobby)
- **Vercel**: Free for personal projects
- **Limitations**:
  - 100 GB bandwidth/month
  - Serverless function execution: 100 GB-hours
  - Perfect for MVP and testing

### Pro Tier ($20/month)
- **Vercel Pro**: For production applications
- **Includes**:
  - 1 TB bandwidth
  - Unlimited serverless function execution
  - Team collaboration features
  - Better performance and support

### Total Monthly Cost (Production)
- Vercel Pro: $20/month
- Railway (Backend + DB): $5-20/month
- **Total**: ~$25-40/month for full stack deployment

## Next Steps

After deployment:

1. **Monitor Performance**: Use Vercel Analytics
2. **Set Up CI/CD**: Already automatic with Vercel
3. **Add Custom Domain**: Follow Step 4 above
4. **Enable Preview Deployments**: Test PRs before merging
5. **Set Up Monitoring**: Add Sentry or similar
6. **Scale**: Upgrade to Pro tier when needed

## Support

- Vercel Documentation: https://vercel.com/docs
- Nuxt 3 Deployment: https://nuxt.com/docs/getting-started/deployment
- Community Support: GitHub Issues

---

**Deployment Status**: ✅ Ready for production deployment

Your application is now configured for Vercel deployment with zero build errors!
