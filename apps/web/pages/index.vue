<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="container-custom py-20">
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-display mb-6 animate-slide-up">
          Compare Products.
          <span class="text-accent">Make Smart Choices.</span>
        </h1>
        <p class="text-xl text-text-secondary mb-8 animate-slide-up" style="animation-delay: 100ms">
          Side-by-side product comparisons with price tracking, expert reviews, and community insights.
        </p>
        <div class="flex gap-4 justify-center animate-slide-up" style="animation-delay: 200ms">
          <NuxtLink to="/comparisons" class="btn btn-primary">
            Start Comparing
          </NuxtLink>
          <NuxtLink to="/products" class="btn btn-secondary">
            Browse Products
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container-custom py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(feature, idx) in features"
          :key="feature.title"
          class="card p-6 animate-slide-up"
          :style="`animation-delay: ${idx * 100}ms`"
        >
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-h3 mb-2">{{ feature.title }}</h3>
          <p class="text-text-secondary">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section v-if="featuredProducts.length > 0" class="container-custom py-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-h2">Featured Products</h2>
        <NuxtLink to="/products" class="text-accent hover:underline">
          View All →
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
    <section v-if="categories.length > 0" class="container-custom py-16">
      <h2 class="text-h2 mb-8">Browse by Category</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="category-card"
        >
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 class="category-name">{{ category.name }}</h3>
          <p v-if="category.description" class="category-description">{{ category.description }}</p>
          <span class="category-count">{{ category._count?.products || 0 }} products</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-primary-secondary py-16 mt-16">
      <div class="container-custom">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-h1 text-accent mb-2">{{ stat.value }}</div>
            <div class="text-text-secondary">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container-custom py-20">
      <div class="card p-12 text-center bg-gradient-to-br from-accent/10 to-accent/5">
        <h2 class="text-h2 mb-4">Ready to Make Smarter Purchases?</h2>
        <p class="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
          Join thousands of smart shoppers who use Tulana Darshaka to compare products and save money.
        </p>
        <NuxtLink to="/products" class="btn btn-primary btn-lg">
          Get Started Free
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()

const features = [
  {
    icon: '⚡',
    title: 'Smart Comparisons',
    description: 'Compare products side-by-side with intelligent highlighting of key differences.'
  },
  {
    icon: '📊',
    title: 'Price Tracking',
    description: 'Track historical prices and get alerts when prices drop on your favorite products.'
  },
  {
    icon: '⭐',
    title: 'Expert Reviews',
    description: 'Read detailed reviews from experts and real users to make informed decisions.'
  },
]

// Fetch featured products
const { data: featuredProducts } = await useFetch(
  `${config.public.apiUrl}/api/products?page=1&pageSize=4`,
  {
    transform: (data: any) => data.products || []
  }
)

// Fetch categories
const { data: categories } = await useFetch(
  `${config.public.apiUrl}/api/categories?page=1&pageSize=8`,
  {
    transform: (data: any) => data.categories || []
  }
)

// Fetch stats
const { data: productStats } = await useFetch(
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
  title: 'Tulana Darshaka - Smart Product Comparisons & Reviews',
  meta: [
    {
      name: 'description',
      content: 'Compare products side-by-side with intelligent highlighting, price tracking, expert reviews, and community insights. Make smarter purchasing decisions.'
    },
    {
      name: 'keywords',
      content: 'product comparison, price tracking, product reviews, smart shopping, compare products'
    },
    {
      property: 'og:title',
      content: 'Tulana Darshaka - Smart Product Comparisons'
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
      content: 'Tulana Darshaka - Smart Product Comparisons'
    },
    {
      name: 'twitter:description',
      content: 'Compare products side-by-side with intelligent highlighting, price tracking, and expert reviews.'
    },
  ],
})
</script>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.category-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 12px;
  color: white;
}

.category-icon svg {
  width: 28px;
  height: 28px;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.category-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-count {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-top: auto;
}

.btn-lg {
  padding: 14px 32px;
  font-size: 16px;
}
</style>
