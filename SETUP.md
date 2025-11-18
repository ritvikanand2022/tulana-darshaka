# Quick Setup Guide

This guide will help you set up Tulana Darshaka for local development in under 10 minutes.

## Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js 20+** - [Download](https://nodejs.org/)
- ✅ **npm 10+** - Comes with Node.js
- ✅ **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop) (recommended)
- ✅ **Git** - [Download](https://git-scm.com/)

### Verify Installation
```bash
node --version  # Should be v20.x.x or higher
npm --version   # Should be v10.x.x or higher
docker --version # Should be 20.x.x or higher
```

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/tulana-darshaka.git
cd tulana-darshaka
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This will install all dependencies for the monorepo (frontend + backend).

---

## Step 3: Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Open .env and update values if needed
# For local development, the defaults should work fine
```

**Note:** For local development, you don't need to change most values. The defaults will work with Docker.

---

## Step 4: Start Database Services

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL, Redis, and other services
docker-compose up -d

# Verify services are running
docker-compose ps
```

You should see:
- ✅ PostgreSQL running on port 5432
- ✅ Redis running on port 6379
- ✅ Meilisearch running on port 7700
- ✅ MailHog running on port 8025

### Option B: Manual Installation

If you prefer not to use Docker:

1. **Install PostgreSQL**
   - macOS: `brew install postgresql@15`
   - Ubuntu: `sudo apt install postgresql-15`
   - Windows: [Download installer](https://www.postgresql.org/download/windows/)

2. **Install Redis**
   - macOS: `brew install redis`
   - Ubuntu: `sudo apt install redis`
   - Windows: Use WSL or [Redis for Windows](https://github.com/microsoftarchive/redis/releases)

3. **Create Database**
   ```bash
   createdb tulana_darshaka
   ```

---

## Step 5: Initialize the Database

```bash
# Run Prisma migrations
cd apps/api
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Seed with sample data
npx prisma db seed

# Go back to root
cd ../..
```

---

## Step 6: Start Development Servers

### Start All Services
```bash
npm run dev
```

This will start:
- 🎨 **Frontend (Nuxt)** - http://localhost:3000
- 🔧 **Backend (NestJS)** - http://localhost:4000
- 📚 **API Docs** - http://localhost:4000/api/docs

### Start Individual Services
```bash
# Frontend only
npm run dev --filter=web

# Backend only
npm run dev --filter=api
```

---

## Step 7: Verify Setup

Open your browser and visit:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **API Documentation:** http://localhost:4000/api/docs
- **Prisma Studio:** Run `npm run db:studio` and visit http://localhost:5555
- **MailHog (Email testing):** http://localhost:8025

---

## Useful Commands

### Development
```bash
npm run dev              # Start all apps
npm run build            # Build for production
npm test                 # Run all tests
npm run lint             # Lint code
npm run format           # Format code with Prettier
```

### Database
```bash
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
```

### Docker
```bash
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
docker-compose ps        # List running services
```

---

## Troubleshooting

### Port Already in Use

If you see errors about ports being in use:

```bash
# Find and kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9
```

### Database Connection Issues

1. Make sure PostgreSQL is running:
   ```bash
   docker-compose ps postgres
   ```

2. Check your DATABASE_URL in `.env`:
   ```
   DATABASE_URL="postgresql://tulana:tulana_dev_password@localhost:5432/tulana_darshaka?schema=public"
   ```

3. Test connection:
   ```bash
   cd apps/api
   npx prisma db push
   ```

### Redis Connection Issues

1. Make sure Redis is running:
   ```bash
   docker-compose ps redis
   ```

2. Test connection:
   ```bash
   redis-cli -h localhost -p 6379 -a tulana_redis_password ping
   # Should return: PONG
   ```

### Node Modules Issues

If you encounter strange errors, try cleaning and reinstalling:

```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

If you see TypeScript errors:

```bash
# Regenerate Prisma Client
cd apps/api
npx prisma generate
cd ../..

# Restart your IDE/editor
```

---

## Next Steps

Now that you have the project running:

1. 📖 **Read the docs** - Check out [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
2. 🎨 **Explore the UI** - Visit http://localhost:3000
3. 🔧 **Try the API** - Visit http://localhost:4000/api/docs
4. 💾 **Browse the database** - Run `npm run db:studio`
5. 🚀 **Start coding** - See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Getting Help

- 📝 **Issues:** [GitHub Issues](https://github.com/your-org/tulana-darshaka/issues)
- 💬 **Discord:** [Join our server](https://discord.gg/tulana)
- 📧 **Email:** dev@tulanadarshaka.com

---

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- Vue Language Features (Volar)
- Prisma
- Tailwind CSS IntelliSense
- GitLens
- Docker

### Browser Extensions

- Vue.js devtools
- React DevTools (for some dependencies)
- Wappalyzer (to analyze tech stack)

---

Happy coding! 🎉
