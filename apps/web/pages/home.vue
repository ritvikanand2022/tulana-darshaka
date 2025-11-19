<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background gradient -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 dark:from-accent/10 dark:to-accent/5" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(35,131,226,0.1),transparent_50%)]" />
      </div>

      <div class="container-custom pt-24 pb-32 md:pt-32 md:pb-40">
        <div class="max-w-5xl mx-auto text-center">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary border border-border text-sm text-text-secondary animate-slide-up">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Now in Beta
          </div>

          <!-- Heading -->
          <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up" style="animation-delay: 50ms">
            Compare Products.
            <br />
            <span class="bg-gradient-to-r from-accent via-accent-dark to-accent bg-clip-text text-transparent">
              Make Informed Decisions.
            </span>
          </h1>

          <!-- Subheading -->
          <p class="text-lg md:text-xl text-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up" style="animation-delay: 100ms">
            Side-by-side comparisons with real-time price tracking, expert reviews, and community insights.
            Everything you need to make confident purchasing decisions.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style="animation-delay: 150ms">
            <NuxtLink to="/products" class="btn-hero btn-hero-primary group">
              <span>Get Started</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
            <NuxtLink to="/comparisons" class="btn-hero btn-hero-secondary">
              View Comparisons
            </NuxtLink>
          </div>

          <!-- Social Proof -->
          <div class="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-text-tertiary animate-slide-up" style="animation-delay: 200ms">
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div class="w-8 h-8 rounded-full bg-accent/20 border-2 border-primary" />
                <div class="w-8 h-8 rounded-full bg-accent/30 border-2 border-primary" />
                <div class="w-8 h-8 rounded-full bg-accent/40 border-2 border-primary" />
              </div>
              <span>Trusted by shoppers</span>
            </div>
            <div class="hidden sm:block text-text-tertiary">•</div>
            <div>100+ Products compared daily</div>
            <div class="hidden sm:block text-text-tertiary">•</div>
            <div>Save up to 30% on purchases</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container-custom py-20 md:py-32">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-5xl font-bold mb-4">
          Everything you need to compare
        </h2>
        <p class="text-lg text-text-secondary max-w-2xl mx-auto">
          Powerful tools designed to help you make the best purchasing decisions
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
        <div
          v-for="(feature, idx) in features"
          :key="feature.title"
          class="feature-card group animate-slide-up"
          :style="`animation-delay: ${idx * 100}ms`"
        >
          <div class="feature-icon mb-4">
            <span class="text-3xl">{{ feature.icon }}</span>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-text-primary group-hover:text-accent transition-colors">
            {{ feature.title }}
          </h3>
          <p class="text-text-secondary leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section v-if="featuredProducts && featuredProducts.length > 0" class="container-custom py-20 md:py-32">
      <div class="flex items-center justify-between mb-12">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
          <p class="text-text-secondary">Popular items being compared right now</p>
        </div>
        <NuxtLink to="/products" class="hidden sm:flex items-center gap-2 text-accent hover:text-accent-dark transition-colors group">
          <span class="font-medium">View All</span>
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <!-- Popular Categories -->
    <section v-if="categories && categories.length > 0" class="container-custom py-20 md:py-32 bg-secondary/50">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-3">Browse by Category</h2>
        <p class="text-text-secondary">Explore products organized by type</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="category-card group"
        >
          <div class="category-icon-modern">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="category-name">{{ category.name }}</h3>
            <p v-if="category.description" class="category-description">{{ category.description }}</p>
          </div>
          <div class="flex items-center justify-between mt-auto">
            <span class="category-count">{{ category._count?.products || 0 }} products</span>
            <svg class="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="relative py-20 md:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div class="container-custom relative">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-3">Trusted by Smart Shoppers</h2>
          <p class="text-text-secondary">Join our growing community</p>
        </div>
        <div class="grid md:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-accent mb-2">{{ stat.value }}</div>
            <div class="text-text-secondary font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container-custom py-20 md:py-32">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-accent-dark to-accent p-12 md:p-16 text-center">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div class="relative">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to Make Smarter Purchases?
          </h2>
          <p class="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of informed shoppers making better decisions every day
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/products" class="btn-hero-cta">
              Get Started Free
            </NuxtLink>
            <NuxtLink to="/comparisons" class="btn-hero-cta-secondary">
              View Comparisons
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const config = useRuntimeConfig()

const features = [
  {
    icon: '⚡',
    title: 'Smart Comparisons',
    description: 'Compare products side-by-side with intelligent highlighting of key differences and specifications that matter most.'
  },
  {
    icon: '📊',
    title: 'Real-Time Tracking',
    description: 'Monitor price changes, availability, and trends across multiple retailers in real-time.'
  },
  {
    icon: '⭐',
    title: 'Verified Reviews',
    description: 'Access authentic reviews from verified buyers and expert opinions to make confident decisions.'
  },
]

// Fetch featured products
const { data: featuredProducts } = await useFetch(
  `${config.public.apiUrl}/api/products?page=1&pageSize=4`,
  {
    transform: (data: any) => data.products || [],
    default: () => []
  }
)

// Fetch categories
const { data: categories } = await useFetch(
  `${config.public.apiUrl}/api/categories?page=1&pageSize=8`,
  {
    transform: (data: any) => data.categories || [],
    default: () => []
  }
)

// Fetch stats
const { data: productStats } = await useFetch<{ total?: number }>(
  `${config.public.apiUrl}/api/products/statistics`
)

const stats = computed(() => [
  { value: productStats.value?.total ? `${Math.floor(productStats.value.total / 100) * 100}+` : '100+', label: 'Products' },
  { value: '1,000+', label: 'Comparisons' },
  { value: '500+', label: 'Reviews' },
  { value: '100%', label: 'Free' },
])

// SEO
useHead({
  title: 'Comparo - Smart Product Comparisons & Reviews',
  meta: [
    {
      name: 'description',
      content: 'Compare products side-by-side with intelligent highlighting, price tracking, expert reviews, and community insights. Make smarter purchasing decisions with Comparo.'
    },
    {
      name: 'keywords',
      content: 'product comparison, price tracking, product reviews, smart shopping, compare products, comparo'
    },
    {
      property: 'og:title',
      content: 'Comparo - Smart Product Comparisons'
    },
    {
      property: 'og:description',
      content: 'Compare products side-by-side with intelligent highlighting, price tracking, and expert reviews.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Comparo - Smart Product Comparisons'
    },
    {
      name: 'twitter:description',
      content: 'Compare products side-by-side with intelligent highlighting, price tracking, and expert reviews.'
    },
  ],
})
</script>

<style scoped>
/* Hero Buttons */
.btn-hero {
  @apply inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 text-base;
}

.btn-hero-primary {
  @apply bg-accent text-white hover:bg-accent-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5;
}

.btn-hero-secondary {
  @apply bg-primary text-text-primary border border-border hover:border-accent hover:text-accent;
}

/* CTA Buttons */
.btn-hero-cta {
  @apply inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-accent font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1;
}

.btn-hero-cta:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.btn-hero-cta-secondary {
  @apply inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold border-2 transition-all duration-200;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-hero-cta-secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Feature Cards */
.feature-card {
  @apply relative p-8 rounded-2xl bg-primary border border-border hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
}

.feature-icon {
  @apply w-14 h-14 rounded-xl flex items-center justify-center;
  background: linear-gradient(135deg, rgba(35, 131, 226, 0.1), rgba(35, 131, 226, 0.05));
}

/* Category Cards */
.category-card {
  @apply flex flex-col gap-4 p-6 bg-primary border border-border rounded-xl transition-all duration-200 hover:border-accent hover:shadow-lg hover:-translate-y-1;
  text-decoration: none;
}

.category-icon-modern {
  @apply w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white;
}

.category-icon-modern svg {
  @apply w-6 h-6;
}

.category-name {
  @apply text-lg font-semibold text-text-primary group-hover:text-accent transition-colors;
}

.category-description {
  @apply text-sm text-text-secondary leading-relaxed line-clamp-2;
}

.category-count {
  @apply text-xs font-medium text-text-tertiary;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Gradient text support */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Responsive typography */
@media (max-width: 768px) {
  .btn-hero {
    @apply w-full;
  }
}
</style>
