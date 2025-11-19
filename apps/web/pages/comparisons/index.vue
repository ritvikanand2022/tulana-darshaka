<template>
  <div class="min-h-screen py-8">
    <div class="container-custom">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-h1 mb-2">Product Comparisons</h1>
        <p class="text-text-secondary">
          Browse popular comparisons or create your own to make informed decisions
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <NuxtLink
          to="/compare"
          class="card p-6 hover:shadow-lg transition-all group cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 class="text-h4 mb-1 group-hover:text-accent transition-colors">Create New Comparison</h3>
              <p class="text-sm text-text-secondary">Compare products side-by-side</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/comparisons/my-comparisons"
          class="card p-6 hover:shadow-lg transition-all group cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-h4 mb-1 group-hover:text-accent transition-colors">My Comparisons</h3>
              <p class="text-sm text-text-secondary">View your saved comparisons</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search comparisons..."
            class="w-full px-4 py-2 rounded-lg border border-border-primary bg-primary-secondary focus:outline-none focus:border-accent"
          />
        </div>

        <select
          v-model="sortBy"
          class="px-4 py-2 rounded-lg border border-border-primary bg-primary-secondary"
        >
          <option value="views:desc">Most Popular</option>
          <option value="createdAt:desc">Most Recent</option>
          <option value="views:asc">Least Viewed</option>
        </select>

        <select
          v-model="categoryFilter"
          class="px-4 py-2 rounded-lg border border-border-primary bg-primary-secondary"
        >
          <option value="">All Categories</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">{{ stats.total }}</div>
          <div class="text-sm text-text-secondary">Total Comparisons</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">{{ stats.public }}</div>
          <div class="text-sm text-text-secondary">Public</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">{{ stats.thisWeek }}</div>
          <div class="text-sm text-text-secondary">This Week</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">{{ stats.totalViews }}</div>
          <div class="text-sm text-text-secondary">Total Views</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="card h-64 animate-pulse bg-primary-secondary"
        />
      </div>

      <!-- Comparisons Grid -->
      <div
        v-else-if="comparisons.length"
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        <NuxtLink
          v-for="comparison in comparisons"
          :key="comparison.id"
          :to="`/compare/${comparison.slug}`"
          class="card group cursor-pointer hover:shadow-lg transition-all"
        >
          <!-- Header -->
          <div class="p-6 border-b border-divider">
            <h3 class="text-h4 mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {{ comparison.title || 'Untitled Comparison' }}
            </h3>
            <p v-if="comparison.description" class="text-sm text-text-secondary line-clamp-2">
              {{ comparison.description }}
            </p>
          </div>

          <!-- Products Preview -->
          <div class="p-4 bg-primary-secondary">
            <div class="text-xs text-text-tertiary mb-2">Products in comparison:</div>
            <div class="space-y-2">
              <div
                v-for="(product, idx) in comparison.products.slice(0, 3)"
                :key="idx"
                class="flex items-center gap-2 text-sm"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-accent"></div>
                <span class="text-text-primary truncate">{{ product.name }}</span>
              </div>
              <div v-if="comparison.products.length > 3" class="text-xs text-text-tertiary pl-3.5">
                +{{ comparison.products.length - 3 }} more
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 flex items-center justify-between text-sm">
            <div class="flex items-center gap-4 text-text-tertiary">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{{ comparison.views || 0 }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>{{ comparison.products.length }}</span>
              </div>
            </div>
            <div class="text-text-tertiary">
              {{ formatDate(comparison.createdAt) }}
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="text-h3 mb-2">No comparisons found</h3>
        <p class="text-text-secondary mb-4">
          {{ searchQuery ? 'Try a different search query' : 'Create your first comparison to get started' }}
        </p>
        <NuxtLink to="/compare" class="btn btn-primary">
          Create Comparison
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2">
        <button
          class="btn btn-secondary"
          :disabled="pagination.page === 1"
          @click="changePage(pagination.page - 1)"
        >
          Previous
        </button>

        <button
          v-for="pageNum in visiblePages"
          :key="pageNum"
          class="btn"
          :class="pageNum === pagination.page ? 'btn-primary' : 'btn-secondary'"
          @click="changePage(pageNum)"
        >
          {{ pageNum }}
        </button>

        <button
          class="btn btn-secondary"
          :disabled="pagination.page === pagination.totalPages"
          @click="changePage(pagination.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  name: string
}

interface Comparison {
  id: string
  slug: string
  title: string | null
  description: string | null
  views: number
  createdAt: string
  products: Product[]
}

definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()

// State
const searchQuery = ref('')
const sortBy = ref('views:desc')
const categoryFilter = ref('')
const page = ref(1)
const pageSize = 12

// Fetch categories for filter
const { data: categoriesData } = await useFetch<{ categories: any[] }>(
  `${config.public.apiUrl}/api/categories`,
  {
    default: () => ({ categories: [] }),
  }
)
const categories = computed(() => categoriesData.value?.categories || [])

// Computed query params
const queryParams = computed(() => {
  const [sortField, sortOrder] = sortBy.value.split(':')
  const params: any = {
    page: page.value,
    pageSize,
    sortBy: sortField,
    sortOrder,
  }

  if (searchQuery.value) {
    params.search = searchQuery.value
  }

  if (categoryFilter.value) {
    params.categoryId = categoryFilter.value
  }

  return params
})

// Fetch comparisons
const { data: comparisonsData, pending } = await useFetch<{
  comparisons: Comparison[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}>(
  () => `${config.public.apiUrl}/api/comparisons`,
  {
    query: queryParams,
    watch: [queryParams],
    default: () => ({
      comparisons: [],
      page: 1,
      pageSize: 12,
      total: 0,
      totalPages: 1,
    }),
  }
)

const comparisons = computed(() => comparisonsData.value?.comparisons || [])
const pagination = computed(() => ({
  page: comparisonsData.value?.page || 1,
  pageSize: comparisonsData.value?.pageSize || 12,
  total: comparisonsData.value?.total || 0,
  totalPages: comparisonsData.value?.totalPages || 1,
}))

// Mock stats (in real app, fetch from API)
const stats = computed(() => {
  const total = pagination.value.total
  const publicCount = comparisons.value.filter((c: any) => c.isPublic).length || Math.floor(total * 0.7)
  const thisWeek = Math.floor(total * 0.2)
  const totalViews = comparisons.value.reduce((sum, c) => sum + (c.views || 0), 0)

  return {
    total,
    public: publicCount,
    thisWeek,
    totalViews,
  }
})

// Pagination helpers
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, pagination.value.page - Math.floor(maxVisible / 2))
  const end = Math.min(pagination.value.totalPages, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const changePage = (newPage: number) => {
  page.value = newPage
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (date: string) => {
  const now = new Date()
  const comparisonDate = new Date(date)
  const diffDays = Math.floor((now.getTime() - comparisonDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`

  return comparisonDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// SEO
useHead({
  title: 'Product Comparisons - Comparo',
  meta: [
    {
      name: 'description',
      content: 'Browse and explore product comparisons created by our community. Compare products side-by-side with Comparo.',
    },
  ],
})
</script>
