# Tulana Darshaka - Implementation Plan
## Product Comparison Platform with Vue.js & Notion-like UI

---

## 🎯 Executive Summary

Tulana Darshaka is an enterprise-grade product comparison platform that enables users to make informed purchasing decisions through comprehensive product analysis, reviews, and price tracking.

**Target Launch Timeline:** 6-9 months (MVP in 3 months)
**Tech Stack:** Vue 3 + Nuxt 3, Node.js, PostgreSQL, Redis, Elasticsearch

---

## 🏗️ Technology Stack

### Frontend
- **Framework:** Vue 3 (Composition API) + Nuxt 3
- **UI Components:** Custom Notion-inspired design system
- **Styling:** TailwindCSS + CSS Variables (theming)
- **State Management:** Pinia
- **Data Fetching:** Nuxt's built-in `useFetch` / `useAsyncData`
- **Forms:** VeeValidate + Zod
- **Charts:** Chart.js / Apache ECharts
- **Rich Text:** Tiptap (Notion-like editor)
- **Image Handling:** Nuxt Image
- **Animations:** GSAP / Framer Motion Vue

### Backend
- **Runtime:** Node.js 20+ with TypeScript
- **Framework:** NestJS (modular architecture)
- **API:** RESTful + GraphQL (Apollo Server)
- **Authentication:** JWT + OAuth2 (Google, GitHub)
- **File Storage:** AWS S3 / Cloudinary
- **Email:** SendGrid / Postmark
- **Job Queue:** Bull (Redis-based)

### Database & Search
- **Primary DB:** PostgreSQL 15+ (with Prisma ORM)
- **Caching:** Redis 7+
- **Search Engine:** Elasticsearch 8+ / Meilisearch
- **Analytics:** ClickHouse / TimescaleDB

### Infrastructure
- **Hosting:** Vercel (Frontend) + AWS/DigitalOcean (Backend)
- **CDN:** Cloudflare
- **Monitoring:** Sentry + DataDog
- **CI/CD:** GitHub Actions
- **Container:** Docker + Docker Compose

---

## 🎨 Notion-like UI Design System

### Design Principles
1. **Clean & Minimal** - Generous whitespace, focused content
2. **Smooth Interactions** - Micro-animations, instant feedback
3. **Contextual UI** - Hover menus, inline actions
4. **Responsive** - Mobile-first approach
5. **Accessibility** - WCAG 2.1 AA compliant

### Core Components

#### Layout Components
```
📦 Notion-inspired Layout
├── 🧱 TopBar (sticky, transparent backdrop blur)
├── 🎯 Sidebar (collapsible, smooth slide)
├── 📄 PageCanvas (centered, max-width 1200px)
├── 🔍 CommandPalette (Cmd+K search)
└── 🌓 ThemeToggle (light/dark/system)
```

#### Data Display Components
```
📊 Comparison Table
├── Sticky header with product images
├── Collapsible spec groups
├── Highlight differences (subtle color coding)
├── Inline editing for personal notes
└── Smooth scroll with indicators

🎴 Product Card
├── Large image with gallery preview
├── Quick specs preview
├── Add to compare (floating button)
├── Price with history graph tooltip
└── Hover: Quick view modal

📈 Price History Chart
├── Interactive line chart
├── Time range selector
├── Price drop highlights
└── Best time to buy indicator
```

#### Input Components
```
✏️ Notion-style Editor (Tiptap)
├── Slash commands (/ for blocks)
├── Markdown shortcuts
├── Drag-to-reorder blocks
├── Inline code, callouts, toggles
└── Image upload with drag-drop

🔍 Smart Search Bar
├── Instant suggestions
├── Recent searches
├── Filters as tags
└── Voice search option

⭐ Review Component
├── Star rating with hover preview
├── Pros/cons with bullet points
├── Image gallery (lightbox)
├── Helpful votes
└── Nested comments
```

### Color System (Notion-inspired)
```css
/* Light Mode */
--bg-primary: #ffffff;
--bg-secondary: #f7f6f3;
--bg-tertiary: #efeeeb;
--text-primary: #37352f;
--text-secondary: #787774;
--border: #e3e2df;
--accent: #2383e2; /* Links */
--success: #0f7b6c;
--warning: #f9ab00;
--error: #eb5757;

/* Dark Mode */
--bg-primary: #191919;
--bg-secondary: #252525;
--bg-tertiary: #2f2f2f;
--text-primary: #e3e2e0;
--text-secondary: #9b9a97;
--border: #373737;
```

### Typography
```
Font Family:
- Headings: 'Inter', sans-serif (600-700 weight)
- Body: 'Inter', sans-serif (400-500 weight)
- Code: 'JetBrains Mono', monospace

Scale:
- Display: 40px / 2.5rem
- H1: 32px / 2rem
- H2: 24px / 1.5rem
- H3: 20px / 1.25rem
- Body: 16px / 1rem
- Small: 14px / 0.875rem
- Tiny: 12px / 0.75rem
```

---

## 📋 Implementation Phases

## **PHASE 1: MVP (Months 1-3)** ✅

### Goals
- Launch functional comparison platform
- Core features only
- Single product category (e.g., Laptops)
- Basic admin panel

### Features
#### 1.1 Foundation (Weeks 1-2)
- [ ] Project setup (Nuxt 3 + NestJS)
- [ ] Database schema (Prisma)
- [ ] Authentication (JWT + email/password)
- [ ] Basic UI components library
- [ ] Notion-like page layout
- [ ] Dark/light theme toggle

#### 1.2 Product Management (Weeks 3-4)
- [ ] Product CRUD (admin)
- [ ] Product model with specs
- [ ] Image upload (single category)
- [ ] Simple product listing page
- [ ] Product detail page
- [ ] Basic search (full-text)

#### 1.3 Comparison Engine (Weeks 5-6)
- [ ] Add to compare (up to 4 products)
- [ ] Side-by-side comparison table
- [ ] Highlight differences
- [ ] Share comparison (unique URL)
- [ ] Responsive comparison view
- [ ] Print-friendly view

#### 1.4 Review System (Weeks 7-8)
- [ ] User registration/login
- [ ] Submit review (star + text)
- [ ] Display reviews on product page
- [ ] Sort reviews (helpful, recent)
- [ ] Helpful votes (thumbs up)
- [ ] Basic spam prevention (CAPTCHA)

#### 1.5 Search & Discovery (Weeks 9-10)
- [ ] Enhanced search with filters
- [ ] Filter by price range
- [ ] Filter by brand
- [ ] Filter by key specs
- [ ] Sort results (price, rating)
- [ ] Category browse page

#### 1.6 MVP Launch (Weeks 11-12)
- [ ] Performance optimization
- [ ] SEO basics (meta tags, sitemap)
- [ ] Google Analytics integration
- [ ] Bug fixes and polish
- [ ] Deploy to production
- [ ] Beta user testing

---

## **PHASE 2: Enhanced Features (Months 4-5)**

### 2.1 Advanced Comparison
- [ ] Compare 2-6 products
- [ ] Comparison history (logged-in users)
- [ ] Collapsible spec groups
- [ ] Export comparison as PDF
- [ ] Embed comparisons (iframe)
- [ ] Comparison templates

### 2.2 Price Tracking
- [ ] Historical price graphs
- [ ] Price drop alerts (email)
- [ ] Multi-vendor pricing
- [ ] Price trend analysis
- [ ] Best time to buy predictions

### 2.3 Enhanced Reviews
- [ ] Photo/video upload (reviews)
- [ ] Verified purchase badge
- [ ] Pros and cons lists
- [ ] Review responses (brands)
- [ ] Report inappropriate content
- [ ] Review moderation queue

### 2.4 User Personalization
- [ ] User profile management
- [ ] Wishlist / saved products
- [ ] Follow products for updates
- [ ] Personalized recommendations
- [ ] Email preferences
- [ ] Reputation points system

### 2.5 Multiple Categories
- [ ] Add 5-10 product categories
- [ ] Category-specific spec fields
- [ ] Category landing pages
- [ ] Category filters
- [ ] Cross-category search

---

## **PHASE 3: Content & Monetization (Month 6)**

### 3.1 Expert Reviews
- [ ] Staff review system
- [ ] Rich text editor (Tiptap)
- [ ] Video review embeds
- [ ] Photo galleries
- [ ] Performance benchmarks
- [ ] Expert verdict scoring

### 3.2 Editorial Content
- [ ] Buying guides (CMS)
- [ ] "Best of" articles
- [ ] How-to guides
- [ ] SEO optimization tools
- [ ] Internal linking
- [ ] Schema markup

### 3.3 Affiliate System
- [ ] Amazon Associates API
- [ ] Affiliate link management
- [ ] Link cloaking
- [ ] Click tracking
- [ ] Commission tracking
- [ ] Geographic routing (US/UK)

### 3.4 Advertising
- [ ] Google AdSense integration
- [ ] Banner ad placements
- [ ] Sponsored listings
- [ ] Native advertising
- [ ] Ad performance analytics

---

## **PHASE 4: Advanced Features (Months 7-8)**

### 4.1 Advanced Search
- [ ] Elasticsearch integration
- [ ] Autocomplete suggestions
- [ ] Typo tolerance
- [ ] Synonym support
- [ ] Voice search
- [ ] Faceted search

### 4.2 Social Features
- [ ] Comment on reviews
- [ ] Follow users
- [ ] Share on social media
- [ ] Discussion forums
- [ ] Q&A section
- [ ] User polls

### 4.3 API Integrations
- [ ] Amazon Product API
- [ ] Best Buy API
- [ ] eBay API
- [ ] Manufacturer feeds
- [ ] Price comparison APIs
- [ ] Review aggregation

### 4.4 Advanced Analytics
- [ ] Custom analytics dashboard
- [ ] Revenue analytics
- [ ] SEO analytics
- [ ] User behavior tracking
- [ ] A/B testing framework
- [ ] Conversion funnel

---

## **PHASE 5: Scale & Optimization (Month 9)**

### 5.1 Performance
- [ ] Redis caching layer
- [ ] Database query optimization
- [ ] CDN for static assets
- [ ] Image optimization pipeline
- [ ] Lazy loading
- [ ] Code splitting

### 5.2 Advanced Admin
- [ ] Bulk product import (CSV)
- [ ] API integrations manager
- [ ] Advanced moderation tools
- [ ] Analytics dashboards
- [ ] System health monitoring
- [ ] Automated backups

### 5.3 Mobile Optimization
- [ ] Progressive Web App (PWA)
- [ ] AMP pages
- [ ] Mobile-specific UI
- [ ] Touch gestures
- [ ] Offline support

### 5.4 Enterprise Features
- [ ] Multi-language support (i18n)
- [ ] Multi-currency
- [ ] Regional pricing
- [ ] White-label options
- [ ] API for third-parties

---

## 📊 Database Schema (Prisma)

### Core Models
```prisma
// Product Management
model Product {
  id              String    @id @default(cuid())
  name            String
  brand           String
  model           String?
  slug            String    @unique
  description     String?   @db.Text
  price           Decimal   @db.Decimal(10, 2)
  currency        String    @default("USD")
  images          Image[]
  specifications  Json      // Flexible spec storage
  categoryId      String
  category        Category  @relation(fields: [categoryId], references: [id])
  status          ProductStatus @default(ACTIVE)
  stockStatus     StockStatus   @default(IN_STOCK)
  releaseDate     DateTime?
  affiliateLinks  AffiliateLink[]
  reviews         Review[]
  priceHistory    PriceHistory[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([categoryId])
  @@index([slug])
  @@index([status])
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  parentId    String?
  parent      Category?  @relation("SubCategories", fields: [parentId], references: [id])
  children    Category[] @relation("SubCategories")
  products    Product[]
  specFields  Json       // Custom fields for this category
  icon        String?
  order       Int        @default(0)

  @@index([parentId])
  @@index([slug])
}

model Image {
  id          String   @id @default(cuid())
  url         String
  alt         String?
  width       Int?
  height      Int?
  size        Int?
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  order       Int      @default(0)
  createdAt   DateTime @default(now())

  @@index([productId])
}

// Review System
model Review {
  id              String    @id @default(cuid())
  rating          Int       // 1-5
  title           String
  content         String    @db.Text
  pros            String[]
  cons            String[]
  images          String[]
  videos          String[]
  verified        Boolean   @default(false)
  helpfulCount    Int       @default(0)
  productId       String
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  votes           ReviewVote[]
  responses       ReviewResponse[]
  status          ReviewStatus @default(PENDING)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([productId])
  @@index([userId])
  @@index([status])
  @@index([rating])
}

model ReviewVote {
  id        String   @id @default(cuid())
  helpful   Boolean  // true = helpful, false = not helpful
  reviewId  String
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@unique([reviewId, userId])
  @@index([reviewId])
}

model ReviewResponse {
  id        String   @id @default(cuid())
  content   String   @db.Text
  reviewId  String
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  userType  ResponseUserType // BRAND, EXPERT, USER
  createdAt DateTime @default(now())

  @@index([reviewId])
}

// User System
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  username        String?   @unique
  name            String?
  avatar          String?
  bio             String?
  password        String    // Hashed
  role            UserRole  @default(USER)
  reputation      Int       @default(0)
  badges          String[]
  emailVerified   Boolean   @default(false)
  preferences     Json?     // User preferences
  reviews         Review[]
  reviewVotes     ReviewVote[]
  reviewResponses ReviewResponse[]
  comparisons     Comparison[]
  wishlists       Wishlist[]
  priceAlerts     PriceAlert[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([email])
  @@index([username])
}

// Comparison System
model Comparison {
  id          String    @id @default(cuid())
  title       String?
  slug        String    @unique
  productIds  String[]  // Array of product IDs
  userId      String?
  user        User?     @relation(fields: [userId], references: [id])
  isPublic    Boolean   @default(true)
  views       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])
  @@index([slug])
}

// Price Tracking
model PriceHistory {
  id          String   @id @default(cuid())
  price       Decimal  @db.Decimal(10, 2)
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  source      String   // Store name
  url         String?
  createdAt   DateTime @default(now())

  @@index([productId, createdAt])
}

model PriceAlert {
  id          String   @id @default(cuid())
  targetPrice Decimal  @db.Decimal(10, 2)
  productId   String
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  active      Boolean  @default(true)
  triggered   Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@index([productId, userId])
}

// Affiliate System
model AffiliateLink {
  id          String   @id @default(cuid())
  url         String
  provider    String   // Amazon, BestBuy, etc.
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  clicks      Int      @default(0)
  conversions Int      @default(0)
  revenue     Decimal  @db.Decimal(10, 2) @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())

  @@index([productId])
}

// Wishlist
model Wishlist {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  productId String
  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@index([userId])
}

// Content Management
model Article {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  content     String      @db.Text
  excerpt     String?
  coverImage  String?
  type        ArticleType // BUYING_GUIDE, REVIEW, HOW_TO
  categoryId  String?
  tags        String[]
  authorId    String
  published   Boolean     @default(false)
  views       Int         @default(0)
  seoTitle    String?
  seoDescription String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  publishedAt DateTime?

  @@index([slug])
  @@index([categoryId])
  @@index([published])
}

// Enums
enum ProductStatus {
  ACTIVE
  INACTIVE
  DISCONTINUED
}

enum StockStatus {
  IN_STOCK
  OUT_OF_STOCK
  PRE_ORDER
  DISCONTINUED
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
  FLAGGED
}

enum UserRole {
  USER
  MODERATOR
  ADMIN
  SUPER_ADMIN
}

enum ResponseUserType {
  USER
  BRAND
  EXPERT
}

enum ArticleType {
  BUYING_GUIDE
  REVIEW
  HOW_TO
  NEWS
  COMPARISON
}
```

---

## 🗂️ Project Structure

```
tulana-darshaka/
├── apps/
│   ├── web/                      # Nuxt 3 Frontend
│   │   ├── components/
│   │   │   ├── ui/               # Design system components
│   │   │   │   ├── Button.vue
│   │   │   │   ├── Card.vue
│   │   │   │   ├── Modal.vue
│   │   │   │   ├── Table.vue
│   │   │   │   └── ...
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.vue
│   │   │   │   ├── ProductGallery.vue
│   │   │   │   ├── ProductSpecs.vue
│   │   │   │   └── ProductComparison.vue
│   │   │   ├── review/
│   │   │   │   ├── ReviewForm.vue
│   │   │   │   ├── ReviewCard.vue
│   │   │   │   └── ReviewList.vue
│   │   │   ├── layout/
│   │   │   │   ├── TopBar.vue
│   │   │   │   ├── Sidebar.vue
│   │   │   │   ├── Footer.vue
│   │   │   │   └── CommandPalette.vue
│   │   │   └── search/
│   │   │       ├── SearchBar.vue
│   │   │       ├── SearchFilters.vue
│   │   │       └── SearchResults.vue
│   │   ├── composables/
│   │   │   ├── useAuth.ts
│   │   │   ├── useProduct.ts
│   │   │   ├── useComparison.ts
│   │   │   └── useTheme.ts
│   │   ├── pages/
│   │   │   ├── index.vue
│   │   │   ├── products/
│   │   │   │   ├── [slug].vue
│   │   │   │   └── index.vue
│   │   │   ├── compare/
│   │   │   │   └── [id].vue
│   │   │   ├── categories/
│   │   │   │   └── [slug].vue
│   │   │   ├── reviews/
│   │   │   └── guides/
│   │   ├── layouts/
│   │   │   ├── default.vue
│   │   │   ├── comparison.vue
│   │   │   └── admin.vue
│   │   ├── stores/
│   │   │   ├── auth.ts
│   │   │   ├── comparison.ts
│   │   │   ├── products.ts
│   │   │   └── theme.ts
│   │   ├── assets/
│   │   │   ├── css/
│   │   │   │   ├── main.css
│   │   │   │   └── themes.css
│   │   │   └── icons/
│   │   ├── public/
│   │   ├── nuxt.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── api/                      # NestJS Backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── products/
│       │   │   ├── reviews/
│       │   │   ├── users/
│       │   │   ├── comparisons/
│       │   │   ├── pricing/
│       │   │   ├── affiliates/
│       │   │   ├── analytics/
│       │   │   └── search/
│       │   ├── common/
│       │   │   ├── decorators/
│       │   │   ├── filters/
│       │   │   ├── guards/
│       │   │   ├── interceptors/
│       │   │   └── pipes/
│       │   ├── config/
│       │   ├── prisma/
│       │   │   └── schema.prisma
│       │   ├── jobs/
│       │   └── main.ts
│       ├── test/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                   # Shared types & utilities
│   │   ├── types/
│   │   ├── constants/
│   │   └── utils/
│   └── config/                   # Shared configs
│
├── docker-compose.yml
├── package.json                  # Workspace root
├── turbo.json                    # Turborepo config
└── README.md
```

---

## 🎯 Key Features Implementation Details

### 1. Notion-like Comparison Table

```vue
<!-- components/product/ComparisonTable.vue -->
<template>
  <div class="comparison-container">
    <!-- Sticky Header -->
    <div class="sticky-header" :class="{ 'is-stuck': isStuck }">
      <div class="product-column" v-for="product in products" :key="product.id">
        <img :src="product.images[0]" :alt="product.name" />
        <h3>{{ product.name }}</h3>
        <p class="price">{{ formatPrice(product.price) }}</p>
        <button class="buy-btn">View Deals</button>
      </div>
    </div>

    <!-- Spec Groups -->
    <div class="spec-groups">
      <SpecGroup
        v-for="group in specGroups"
        :key="group.name"
        :group="group"
        :products="products"
        :collapsible="true"
      />
    </div>

    <!-- Floating Actions -->
    <div class="floating-actions">
      <button @click="exportPDF">
        <Icon name="download" /> Export PDF
      </button>
      <button @click="shareComparison">
        <Icon name="share" /> Share
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  products: Product[]
}>()

const isStuck = ref(false)

// Sticky header logic
const handleScroll = () => {
  isStuck.value = window.scrollY > 200
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 60px;
  background: var(--bg-primary);
  z-index: 100;
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--border);
}

.sticky-header.is-stuck {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.product-column {
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.product-column:hover {
  transform: translateY(-2px);
}

.buy-btn {
  background: var(--accent);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.buy-btn:hover {
  background: var(--accent-dark);
  box-shadow: 0 4px 12px rgba(35, 131, 226, 0.3);
}
</style>
```

### 2. Smart Search with Command Palette

```vue
<!-- components/search/CommandPalette.vue -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="command-palette-overlay" @click="close">
        <div class="command-palette" @click.stop>
          <div class="search-box">
            <Icon name="search" class="search-icon" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Search products, brands, or type a command..."
              @input="handleSearch"
              @keydown.down.prevent="selectNext"
              @keydown.up.prevent="selectPrev"
              @keydown.enter="executeSelected"
            />
            <kbd class="shortcut">ESC</kbd>
          </div>

          <div class="results">
            <div v-if="recentSearches.length && !query" class="section">
              <div class="section-title">Recent Searches</div>
              <div
                v-for="search in recentSearches"
                :key="search"
                class="result-item"
                @click="executeSearch(search)"
              >
                <Icon name="clock" />
                <span>{{ search }}</span>
              </div>
            </div>

            <div v-if="filteredProducts.length" class="section">
              <div class="section-title">Products</div>
              <div
                v-for="(product, idx) in filteredProducts"
                :key="product.id"
                class="result-item"
                :class="{ selected: selectedIndex === idx }"
                @click="navigateToProduct(product)"
              >
                <img :src="product.thumbnail" alt="" />
                <div class="item-info">
                  <span class="item-title">{{ product.name }}</span>
                  <span class="item-meta">{{ product.brand }}</span>
                </div>
                <span class="item-price">{{ formatPrice(product.price) }}</span>
              </div>
            </div>

            <div v-if="commands.length" class="section">
              <div class="section-title">Actions</div>
              <div
                v-for="cmd in commands"
                :key="cmd.id"
                class="result-item"
                @click="cmd.action()"
              >
                <Icon :name="cmd.icon" />
                <span>{{ cmd.label }}</span>
                <kbd v-if="cmd.shortcut">{{ cmd.shortcut }}</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement>()

const router = useRouter()

// Commands
const commands = computed(() => [
  {
    id: 'compare',
    label: 'Start new comparison',
    icon: 'compare',
    shortcut: 'Ctrl+C',
    action: () => router.push('/compare/new')
  },
  {
    id: 'theme',
    label: 'Toggle dark mode',
    icon: 'moon',
    shortcut: 'Ctrl+D',
    action: () => toggleTheme()
  }
])

// Keyboard shortcut
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value = !isOpen.value
  }
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Auto-focus input
watch(isOpen, (open) => {
  if (open) {
    nextTick(() => inputRef.value?.focus())
  }
})
</script>

<style scoped>
.command-palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.command-palette {
  width: 640px;
  max-height: 70vh;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-box {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  gap: 0.75rem;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  color: var(--text-primary);
}

.results {
  max-height: calc(70vh - 80px);
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.result-item:hover,
.result-item.selected {
  background: var(--bg-secondary);
}

.result-item img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
}

.section-title {
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}
</style>
```

### 3. Price History Chart

```vue
<!-- components/product/PriceHistoryChart.vue -->
<template>
  <div class="price-chart-container">
    <div class="chart-header">
      <h3>Price History</h3>
      <div class="time-range-selector">
        <button
          v-for="range in timeRanges"
          :key="range.value"
          :class="{ active: selectedRange === range.value }"
          @click="selectRange(range.value)"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    <div class="price-insights">
      <div class="insight-card">
        <Icon name="trending-down" class="text-success" />
        <div>
          <div class="label">Lowest Price</div>
          <div class="value">{{ formatPrice(lowestPrice.price) }}</div>
          <div class="meta">{{ formatDate(lowestPrice.date) }}</div>
        </div>
      </div>

      <div class="insight-card">
        <Icon name="trending-up" class="text-error" />
        <div>
          <div class="label">Highest Price</div>
          <div class="value">{{ formatPrice(highestPrice.price) }}</div>
          <div class="meta">{{ formatDate(highestPrice.date) }}</div>
        </div>
      </div>

      <div class="insight-card">
        <Icon name="activity" class="text-accent" />
        <div>
          <div class="label">Average Price</div>
          <div class="value">{{ formatPrice(averagePrice) }}</div>
          <div class="meta">Last {{ selectedRange }}</div>
        </div>
      </div>

      <div class="insight-card" v-if="priceDropPercent > 10">
        <Icon name="bell" class="text-warning" />
        <div>
          <div class="label">Great Deal!</div>
          <div class="value">{{ priceDropPercent }}% off</div>
          <div class="meta">Below average price</div>
        </div>
      </div>
    </div>

    <button class="alert-btn" @click="createPriceAlert">
      <Icon name="bell" />
      Set Price Alert
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  productId: string
  currentPrice: number
}>()

const selectedRange = ref('6M')
const priceHistory = ref([])

const timeRanges = [
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1Y' },
  { label: 'All', value: 'ALL' }
]

const chartData = computed(() => ({
  labels: priceHistory.value.map(p => formatDate(p.date)),
  datasets: [
    {
      label: 'Price',
      data: priceHistory.value.map(p => p.price),
      borderColor: '#2383e2',
      backgroundColor: 'rgba(35, 131, 226, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: (value) => formatPrice(value)
      }
    }
  }
}

const lowestPrice = computed(() => {
  return priceHistory.value.reduce((min, p) =>
    p.price < min.price ? p : min
  )
})

const highestPrice = computed(() => {
  return priceHistory.value.reduce((max, p) =>
    p.price > max.price ? p : max
  )
})

const averagePrice = computed(() => {
  const sum = priceHistory.value.reduce((acc, p) => acc + p.price, 0)
  return sum / priceHistory.value.length
})

const priceDropPercent = computed(() => {
  return Math.round(((averagePrice.value - props.currentPrice) / averagePrice.value) * 100)
})
</script>

<style scoped>
.price-chart-container {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.time-range-selector {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-primary);
  padding: 0.25rem;
  border-radius: 8px;
}

.time-range-selector button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.time-range-selector button.active {
  background: var(--accent);
  color: white;
}

.chart-wrapper {
  height: 300px;
  margin-bottom: 2rem;
}

.price-insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.insight-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.insight-card .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.insight-card .value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0.25rem 0;
}

.insight-card .meta {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.alert-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--accent);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.alert-btn:hover {
  background: var(--accent-dark);
  box-shadow: 0 4px 12px rgba(35, 131, 226, 0.3);
}
</style>
```

---

## 🚀 Getting Started (Next Steps)

### 1. Initialize Project
```bash
# Create monorepo structure
npm create turbo@latest tulana-darshaka

# Navigate to project
cd tulana-darshaka

# Install dependencies
npm install

# Setup Nuxt 3 frontend
npx nuxi init apps/web

# Setup NestJS backend
nest new apps/api
```

### 2. Install Core Dependencies

**Frontend (apps/web):**
```bash
npm install -D @nuxtjs/tailwindcss @pinia/nuxt
npm install pinia @vueuse/core chart.js vue-chartjs
npm install @tiptap/vue-3 @tiptap/starter-kit
npm install zod vee-validate
```

**Backend (apps/api):**
```bash
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install @prisma/client bcrypt
npm install -D prisma
npm install bull @nestjs/bull
npm install @elastic/elasticsearch
```

### 3. Setup Database
```bash
cd apps/api
npx prisma init
# Add schema (from above)
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Development Workflow
```bash
# Run all apps
npm run dev

# Run specific app
npm run dev --filter=web
npm run dev --filter=api
```

---

## 📈 Success Metrics

### MVP Launch (Month 3)
- [ ] 50+ products in database
- [ ] 10+ detailed expert reviews
- [ ] 100+ user registrations
- [ ] 500+ comparisons created
- [ ] 50+ user reviews
- [ ] 1,000+ monthly visitors
- [ ] Page load time < 2s
- [ ] Mobile responsive (100% pages)

### Growth Phase (Month 6)
- [ ] 500+ products across 10 categories
- [ ] 10,000+ monthly visitors
- [ ] 1,000+ registered users
- [ ] 5,000+ comparisons created
- [ ] 500+ user reviews
- [ ] $500+ monthly affiliate revenue
- [ ] Domain Authority > 20
- [ ] 50+ ranking keywords

### Scale Phase (Month 9)
- [ ] 2,000+ products
- [ ] 50,000+ monthly visitors
- [ ] 5,000+ registered users
- [ ] $2,000+ monthly revenue
- [ ] Domain Authority > 30
- [ ] 200+ ranking keywords
- [ ] Mobile app (PWA) launched
- [ ] API for third-party integrations

---

## 💰 Cost Estimation

### Development Costs
- **Team (if hiring):**
  - 2 Full-stack developers: $120k-160k/year
  - 1 UI/UX designer: $60k-80k/year
  - 1 DevOps engineer (part-time): $40k-60k/year

- **Solo Developer (with contractors):**
  - Design: $3k-5k (one-time)
  - Content writing: $2k-3k (ongoing)
  - Total: $5k-10k initial + $1k-2k/month

### Infrastructure (Monthly)
- **MVP (Month 1-3):** $50-100/month
  - Vercel (Frontend): $0-20
  - DigitalOcean (Backend): $20-40
  - Database (Managed PostgreSQL): $15-25
  - Redis: $10-15
  - S3 Storage: $5-10

- **Growth (Month 4-6):** $200-400/month
  - All above + Elasticsearch: $50-100
  - Increased server resources: $100-200
  - CDN (Cloudflare Pro): $20
  - Email service: $10-20
  - Monitoring tools: $20-40

- **Scale (Month 7-9):** $500-1000/month
  - Multiple servers, load balancing
  - Advanced analytics
  - Higher bandwidth
  - Backup & disaster recovery

### Third-Party Services
- **Essential:**
  - SendGrid/Postmark: $0-20/month
  - Cloudinary: $0-50/month
  - Google Analytics: Free
  - Sentry: $0-26/month

- **Optional:**
  - Elasticsearch/Meilisearch Cloud: $50-200/month
  - DataDog: $15-31/month
  - Hotjar: $0-39/month
  - Ahrefs/SEMrush: $99-199/month

---

## 🎓 Learning Resources

### Vue 3 & Nuxt 3
- [Vue 3 Docs](https://vuejs.org/)
- [Nuxt 3 Docs](https://nuxt.com/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)

### Backend
- [NestJS Docs](https://nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### UI/UX
- [TailwindCSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.com/)
- [Radix Vue](https://www.radix-vue.com/)
- [Notion Design System](https://notion.so)

### SEO & Performance
- [web.dev](https://web.dev/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)

---

## ✅ Quality Checklist

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] ESLint + Prettier configured
- [ ] Husky pre-commit hooks
- [ ] Unit tests (>70% coverage)
- [ ] E2E tests (critical paths)
- [ ] Code review process

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Images optimized (WebP)
- [ ] Code splitting implemented

### SEO
- [ ] Semantic HTML
- [ ] Meta tags (all pages)
- [ ] Structured data (JSON-LD)
- [ ] XML sitemap
- [ ] Robots.txt
- [ ] Canonical URLs
- [ ] 404 page
- [ ] SSL certificate

### Security
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Secure headers
- [ ] Input validation

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation
- [ ] Screen reader tested
- [ ] Color contrast ratios
- [ ] Alt text for images
- [ ] ARIA labels
- [ ] Focus indicators

---

## 🎉 Conclusion

This implementation plan provides a comprehensive roadmap for building Tulana Darshaka from MVP to a fully-featured product comparison platform. The Notion-inspired UI will provide users with a clean, intuitive experience while the robust backend ensures scalability and performance.

**Key Success Factors:**
1. Start with MVP - validate core features first
2. Focus on UX - Notion-like interface will differentiate
3. Content is king - quality reviews and guides drive traffic
4. SEO from day one - organic traffic is sustainable
5. Community engagement - user reviews build trust
6. Data-driven decisions - analytics guide improvements

**Next Immediate Steps:**
1. Review and approve this plan
2. Set up development environment
3. Create design system in Figma
4. Initialize project structure
5. Begin Phase 1 Sprint 1

Ready to build something amazing! 🚀
