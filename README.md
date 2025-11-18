# Tulana Darshaka 🚀

> **Sanskrit**: तुलना दर्शक (Comparison Viewer)

A comprehensive product comparison platform built with modern web technologies. Compare products side-by-side with intelligent highlighting, expert reviews, and community insights to make smarter purchasing decisions.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Vue 3](https://img.shields.io/badge/vue-3.x-brightgreen)](https://vuejs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-10.x-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org/)

## 🎯 Overview

Tulana Darshaka is a production-ready product comparison platform that helps users make informed purchasing decisions through:

- **Smart Product Comparisons** - Side-by-side analysis with intelligent difference highlighting
- **Review System** - User reviews with 5-star ratings, pros/cons, and helpful voting
- **Unified Search** - Search across products, categories, and reviews with autocomplete (⌘K)
- **Product Management** - Complete CRUD with advanced filtering and pagination
- **Beautiful UI** - Notion-inspired design system with dark/light themes
- **SEO Optimized** - Meta tags, OpenGraph, and Twitter Cards for all pages

## 🏗️ Architecture

This is a monorepo project with the following structure:

```
tulana-darshaka/
├── apps/
│   ├── web/          # Nuxt 3 Frontend (Vue 3 + TailwindCSS)
│   └── api/          # NestJS Backend (Node.js + Prisma)
├── docs/            # Comprehensive documentation
│   ├── DEPLOYMENT.md           # Production deployment guide
│   ├── phase-*.md              # Phase documentation
│   └── *-testing.md            # Testing guides
└── docker-compose.yml          # Docker setup
```

**Tech Stack:**
- **Frontend**: Nuxt 3, Vue 3, TailwindCSS, Pinia
- **Backend**: NestJS, TypeScript, Prisma
- **Database**: PostgreSQL
- **Development**: Docker, TypeScript strict mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- (Optional) Docker & Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/tulana-darshaka.git
   cd tulana-darshaka
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd apps/api
   npm install

   # Frontend
   cd ../web
   npm install
   ```

3. **Setup environment variables**

   **Backend** (`apps/api/.env`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/tulana_darshaka"
   NODE_ENV=development
   PORT=3001
   CORS_ORIGIN=http://localhost:3000
   ```

   **Frontend** (`apps/web/.env`):
   ```env
   NUXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start databases** (using Docker Compose)
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma migrate dev
   ```

6. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

7. **Start development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd apps/api
   npm run start:dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd apps/web
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api

## 📦 Tech Stack

### Frontend
- **Framework:** Nuxt 3 (Vue 3 Composition API)
- **Styling:** TailwindCSS + Custom CSS Variables
- **State:** Pinia
- **TypeScript:** Strict mode enabled

### Backend
- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS
- **Database:** PostgreSQL (Prisma ORM)
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger/OpenAPI

### Infrastructure
- **Hosting:** Vercel (Frontend) + Railway/Heroku (Backend)
- **Database:** Railway PostgreSQL / Supabase
- **Deployment:** Docker support included
- **Cost:** $10-25/month for MVP

## ✨ Features

### Core Features (MVP Complete ✅)
- ✅ **Product Management** - Full CRUD with search, filters, pagination
- ✅ **Comparison Engine** - Side-by-side up to 6 products with diff highlighting
- ✅ **Review System** - 5-star ratings, pros/cons, helpful voting
- ✅ **Unified Search** - Search products, categories, reviews with ⌘K shortcut
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Dark/Light Themes** - System-aware with manual toggle
- ✅ **SEO Optimized** - Meta tags, OpenGraph, Twitter Cards

### Key Capabilities
- 📊 **30+ API Endpoints** - Complete REST API with Swagger docs
- 🎨 **15+ Components** - Reusable Vue components
- 📄 **8 Pages** - Full user flow implemented
- 🗄️ **15+ Database Models** - Comprehensive data model
- 🔍 **Smart Search** - Autocomplete, filtering, relevance scoring
- 💾 **State Persistence** - LocalStorage for comparison cart
- ⌨️ **Keyboard Shortcuts** - ⌘K for search, arrows for navigation
- 🚨 **Error Boundaries** - Graceful error handling

## 📚 Documentation

- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Complete production deployment instructions
- **[API Documentation](http://localhost:3001/api)** - Interactive Swagger docs (when running)
- **[Phase Documentation](./docs/)** - Implementation phase guides
  - Phase 1.1: Foundation
  - Phase 1.2: Product Management
  - Phase 1.3: Comparison Engine
  - Phase 1.4: Review System
  - Phase 1.5: Basic Search
  - Phase 1.6: MVP Launch
- **[Testing Guides](./docs/)** - Comprehensive testing instructions

## 🎨 Design System

Our Notion-inspired design system focuses on:

- **Clean & Minimal** - Generous whitespace, focused content
- **Smooth Interactions** - Micro-animations, instant feedback
- **Contextual UI** - Hover menus, inline actions
- **Responsive** - Mobile-first approach
- **Accessible** - WCAG 2.1 AA compliant

See [Design System Guide](./docs/design-system.md) for details.

## 🛠️ Development

### Available Scripts

**Backend** (`apps/api`):
```bash
npm run start:dev     # Start dev server with hot reload
npm run build         # Build for production
npm run start:prod    # Start production server
npx prisma studio     # Open Prisma Studio (DB GUI)
npx prisma migrate    # Run database migrations
npx prisma generate   # Generate Prisma Client
```

**Frontend** (`apps/web`):
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run generate      # Generate static site
npm run preview       # Preview production build
```

### Database Management

```bash
# Create a migration
npx prisma migrate dev --name description

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ Deletes all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Health Checks

```bash
# Backend health
curl http://localhost:3001/health

# Expected response:
{
  "status": "healthy",
  "message": "Tulana Darshaka API is running! 🚀",
  "timestamp": "2025-01-18T...",
  "version": "1.0.0"
}
```

## 📋 Roadmap

### Phase 1: MVP ✅ COMPLETE
- [x] **Phase 1.1**: Foundation - Nuxt 3 + NestJS + Prisma setup
- [x] **Phase 1.2**: Product Management - CRUD, search, filters
- [x] **Phase 1.3**: Comparison Engine - Side-by-side with highlighting
- [x] **Phase 1.4**: Review System - Ratings, votes, statistics
- [x] **Phase 1.5**: Basic Search - Unified search, autocomplete
- [x] **Phase 1.6**: MVP Launch - Polish, SEO, deployment ready

**🎉 MVP Status**: Production-ready with 30+ endpoints, 15+ components, ~15,000 lines of code

### Phase 2: Authentication & Admin (Planned)
- [ ] User authentication (OAuth, JWT)
- [ ] User profiles and settings
- [ ] Admin panel for moderation
- [ ] Content management
- [ ] User management

### Phase 3: Advanced Features (Future)
- [ ] Image upload functionality
- [ ] Email notifications
- [ ] Price drop alerts
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Advanced analytics

### Phase 4: Scale & Monetization (Future)
- [ ] Elasticsearch integration
- [ ] Redis caching
- [ ] CDN setup
- [ ] Affiliate links
- [ ] Premium features
- [ ] API rate limiting tiers

### Phase 5: Mobile & i18n (Future)
- [ ] Progressive Web App (PWA)
- [ ] Mobile applications
- [ ] Multi-language support
- [ ] Localization

## 📈 Stats

- **Lines of Code**: ~15,000+
- **API Endpoints**: 30+
- **Pages**: 8
- **Components**: 15+
- **Database Tables**: 15+
- **Documentation Files**: 9 comprehensive guides

## 🎯 Key Features Walkthrough

### Product Comparison
1. Browse products at `/products`
2. Click "Add to Compare" on 2-6 products
3. Click "View Comparison" in the bottom bar
4. See side-by-side specs with differences highlighted
5. Share comparison via URL

### Reviews & Ratings
1. Navigate to any product detail page
2. Scroll to "Customer Reviews" section
3. Click "Write a Review"
4. Add rating (1-5 stars), title, content, pros, and cons
5. Vote on helpful reviews with thumbs up/down

### Search
1. Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)
2. Type your search query
3. See instant autocomplete suggestions
4. Use arrow keys to navigate
5. Filter by price, rating, or category

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by [Notion](https://notion.so)
- Icons from [Lucide](https://lucide.dev)
- UI patterns from [shadcn/ui](https://ui.shadcn.com)

## 🚢 Deployment

See the comprehensive [Deployment Guide](docs/DEPLOYMENT.md) for production deployment instructions.

**Quick Deploy Options**:
- **Backend**: Railway, Heroku, AWS, DigitalOcean
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: Railway PostgreSQL, Supabase, AWS RDS

**Estimated Cost**: $10-25/month for MVP traffic

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/tulana-darshaka/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tulana-darshaka/discussions)
- **Documentation**: See `/docs` folder

---

**Built with ❤️ by the Tulana Darshaka Team**

⭐ Star us on GitHub if you find this project helpful!

🐛 Found a bug? [Report it](https://github.com/yourusername/tulana-darshaka/issues/new)

💡 Have an idea? [Share it](https://github.com/yourusername/tulana-darshaka/discussions/new)
