# Tulana Darshaka

> Product Comparison Platform with Vue.js & Notion-like UI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Vue 3](https://img.shields.io/badge/vue-3.x-brightgreen)](https://vuejs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-10.x-red)](https://nestjs.com/)

## 🎯 Overview

Tulana Darshaka is a comprehensive product comparison platform that helps users make informed purchasing decisions through:

- **Smart Product Comparisons** - Side-by-side analysis with intelligent highlighting
- **Price Tracking** - Historical price graphs with drop alerts
- **User & Expert Reviews** - Community-driven insights and professional analysis
- **Advanced Search** - Elasticsearch-powered with smart filters
- **Affiliate Integration** - Multi-vendor price comparison
- **Beautiful UI** - Notion-inspired design system

## 🏗️ Architecture

This is a monorepo project using Turborepo with the following structure:

```
tulana-darshaka/
├── apps/
│   ├── web/          # Nuxt 3 Frontend (Vue 3 + TailwindCSS)
│   └── api/          # NestJS Backend (Node.js + Prisma)
├── packages/
│   ├── shared/       # Shared types & utilities
│   └── config/       # Shared configurations
└── docs/            # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm 10+
- PostgreSQL 15+
- Redis 7+
- (Optional) Docker & Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/tulana-darshaka.git
   cd tulana-darshaka
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Frontend (apps/web/.env)
   cp apps/web/.env.example apps/web/.env

   # Backend (apps/api/.env)
   cp apps/api/.env.example apps/api/.env
   ```

4. **Start databases** (using Docker Compose)
   ```bash
   docker-compose up -d postgres redis
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Seed the database** (optional)
   ```bash
   npm run db:seed
   ```

7. **Start development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Docs: http://localhost:4000/api/docs

## 📦 Tech Stack

### Frontend
- **Framework:** Vue 3 (Composition API) + Nuxt 3
- **Styling:** TailwindCSS
- **State:** Pinia
- **Forms:** VeeValidate + Zod
- **Charts:** Chart.js
- **Editor:** Tiptap (Notion-like)

### Backend
- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS
- **Database:** PostgreSQL (Prisma ORM)
- **Cache:** Redis
- **Search:** Elasticsearch / Meilisearch
- **Queue:** Bull
- **Auth:** JWT + OAuth2

### Infrastructure
- **Hosting:** Vercel (Frontend) + AWS/DigitalOcean (Backend)
- **CDN:** Cloudflare
- **Storage:** AWS S3 / Cloudinary
- **Monitoring:** Sentry + DataDog

## 📚 Documentation

- [Implementation Plan](./IMPLEMENTATION_PLAN.md) - Comprehensive development roadmap
- [API Documentation](./docs/api.md) - Backend API reference
- [Component Library](./docs/components.md) - UI component guide
- [Database Schema](./docs/database.md) - Data model documentation
- [Deployment Guide](./docs/deployment.md) - Production deployment steps

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

```bash
# Development
npm run dev              # Start all apps in dev mode
npm run dev --filter=web # Start only frontend
npm run dev --filter=api # Start only backend

# Build
npm run build           # Build all apps for production
npm run build --filter=web

# Testing
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Generate coverage report

# Database
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database

# Code Quality
npm run lint            # Lint all code
npm run format          # Format with Prettier
npm run type-check      # TypeScript type checking

# Cleanup
npm run clean           # Remove build artifacts & node_modules
```

### Project Commands

```bash
# Add new package to frontend
npm install <package> --workspace=apps/web

# Add new package to backend
npm install <package> --workspace=apps/api

# Add shared package
npm install <package> --workspace=packages/shared
```

## 📋 Roadmap

### Phase 1: MVP (Months 1-3) ✅
- [x] Basic product comparison
- [x] User reviews system
- [x] Search & filters
- [x] Authentication
- [ ] MVP launch

### Phase 2: Enhanced Features (Months 4-5)
- [ ] Price tracking & alerts
- [ ] Expert reviews
- [ ] Multiple categories
- [ ] Advanced comparisons

### Phase 3: Content & Monetization (Month 6)
- [ ] Affiliate system
- [ ] Editorial content (CMS)
- [ ] Advertising platform
- [ ] SEO optimization

### Phase 4: Advanced Features (Months 7-8)
- [ ] Elasticsearch integration
- [ ] Social features
- [ ] API integrations
- [ ] Advanced analytics

### Phase 5: Scale & Optimization (Month 9)
- [ ] Performance optimization
- [ ] Mobile app (PWA)
- [ ] Multi-language support
- [ ] Enterprise features

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed timeline.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

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

## 📧 Contact

- **Project Lead:** Your Name
- **Email:** your.email@example.com
- **Website:** https://tulana-darshaka.com
- **Twitter:** @tulanadarshaka

---

Made with ❤️ by the Tulana Darshaka team
