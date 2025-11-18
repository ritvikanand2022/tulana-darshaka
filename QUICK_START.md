# Quick Start - Phase 1.1 Foundation

Welcome to Tulana Darshaka! This guide will help you get the Phase 1.1 foundation up and running.

## What's Been Built

✅ **Frontend (Nuxt 3)**
- Vue 3 with Composition API
- TailwindCSS with Notion-inspired design system
- Dark/light theme toggle
- Responsive layout with top bar and footer
- Basic home page

✅ **Backend (NestJS)**
- RESTful API structure
- Prisma ORM integration
- PostgreSQL database schema
- JWT authentication setup
- API documentation with Swagger

✅ **Database Schema**
- Complete data models (Users, Products, Reviews, Comparisons)
- Price tracking system
- Affiliate links
- Categories & wishlists

✅ **Shared Packages**
- TypeScript types for all entities
- Shared utilities

## Prerequisites

Make sure you have:
- Node.js 20+
- npm 10+
- Docker Desktop (recommended)

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces (frontend, backend, and shared packages).

### 2. Setup Environment

```bash
# Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

### 3. Start Database

Using Docker (recommended):

```bash
docker-compose up -d postgres redis
```

Wait for services to start (about 10-15 seconds).

### 4. Initialize Database

```bash
# Navigate to API directory
cd apps/api

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database with sample data
npx prisma db seed

# Go back to root
cd ../..
```

### 5. Start Development Servers

```bash
npm run dev
```

This starts both frontend and backend:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs

## Verify Installation

1. **Frontend**: Visit http://localhost:3000
   - You should see the homepage
   - Click the theme toggle (moon/sun icon) to test dark mode

2. **Backend**: Visit http://localhost:4000/api
   - You should see: `"Tulana Darshaka API is running! 🚀"`

3. **API Docs**: Visit http://localhost:4000/api/docs
   - Interactive Swagger documentation

4. **Database**:
   ```bash
   cd apps/api && npx prisma studio
   ```
   - Opens Prisma Studio at http://localhost:5555
   - You should see sample data (users, products, reviews)

## Sample Data

After seeding, you'll have:

**Users:**
- Admin: admin@tulanadarshaka.com / admin123
- Test User: test@example.com / test123

**Products:**
- 3 sample laptops (MacBook Pro, Dell XPS, ThinkPad)
- With images, specs, and prices

**Categories:**
- Electronics → Laptops

**Reviews:**
- 2 sample reviews on products

**Price History:**
- 30 days of price data for MacBook Pro

## Project Structure

```
tulana-darshaka/
├── apps/
│   ├── web/              # Nuxt 3 Frontend
│   │   ├── components/   # Vue components
│   │   ├── pages/        # Route pages
│   │   ├── layouts/      # Layouts (default, etc.)
│   │   ├── composables/  # Vue composables
│   │   └── assets/       # CSS & static assets
│   │
│   └── api/              # NestJS Backend
│       ├── src/
│       │   ├── modules/  # Feature modules
│       │   ├── common/   # Shared utilities
│       │   └── prisma/   # Prisma service
│       └── prisma/       # Database schema & migrations
│
├── packages/
│   └── shared/           # Shared TypeScript types
│
└── docs/                 # Documentation
```

## Development Workflow

### Frontend Development

```bash
# Start only frontend
npm run dev --filter=web

# Lint
cd apps/web && npm run lint

# Type check
cd apps/web && npm run type-check
```

### Backend Development

```bash
# Start only backend
npm run dev --filter=api

# Run migrations
cd apps/api && npx prisma migrate dev

# View database
cd apps/api && npx prisma studio

# Generate Prisma Client (after schema changes)
cd apps/api && npx prisma generate
```

### Database Management

```bash
# Create new migration
cd apps/api
npx prisma migrate dev --name your_migration_name

# Reset database (development only!)
npx prisma migrate reset

# Seed data
npx prisma db seed

# View data
npx prisma studio
```

## Testing the Setup

### 1. Test Frontend

Navigate to http://localhost:3000:

- ✅ Homepage loads
- ✅ Theme toggle works (click moon/sun icon)
- ✅ Navigation menu appears
- ✅ Footer displays

### 2. Test Backend API

```bash
# Health check
curl http://localhost:4000/api

# Should return: {"message":"Tulana Darshaka API is running! 🚀",...}
```

### 3. Test Database Connection

```bash
cd apps/api
npx prisma studio
```

- Opens web UI at http://localhost:5555
- Verify you can see tables and data

## Next Steps

Now that Phase 1.1 Foundation is complete, here's what's coming next:

### Phase 1.2: Product Management (Next)
- [ ] Products listing page
- [ ] Product detail page
- [ ] Product search
- [ ] Category browsing
- [ ] Admin product CRUD

### Phase 1.3: Comparison Engine
- [ ] Add to compare functionality
- [ ] Comparison table component
- [ ] Share comparisons

### Phase 1.4: Review System
- [ ] Review form
- [ ] Review display
- [ ] Rating system

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Database Connection Error

1. Check PostgreSQL is running:
   ```bash
   docker-compose ps postgres
   ```

2. Verify DATABASE_URL in `apps/api/.env`

3. Test connection:
   ```bash
   cd apps/api
   npx prisma db push
   ```

### Prisma Client Not Generated

```bash
cd apps/api
npx prisma generate
```

Then restart your dev server.

### Module Not Found Errors

```bash
# Clean install
npm run clean
rm -rf node_modules package-lock.json
npm install
```

## Useful Commands

```bash
# View all running Docker services
docker-compose ps

# View logs
docker-compose logs -f postgres

# Stop all services
docker-compose down

# View Prisma Studio
cd apps/api && npx prisma studio

# Format code
npm run format

# Lint all code
npm run lint
```

## Getting Help

- 📖 [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- 🎨 [Design System](./DESIGN_SYSTEM.md)
- 📚 [API Docs](http://localhost:4000/api/docs) (when running)
- 🐛 [Report Issues](https://github.com/your-org/tulana-darshaka/issues)

---

**Happy Coding!** 🎉

You've successfully set up the foundation. Time to build amazing features!
