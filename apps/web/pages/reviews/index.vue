<template>
  <div class="min-h-screen py-8">
    <div class="container-custom">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-h1 mb-2">Product Reviews</h1>
        <p class="text-text-secondary">
          Read honest reviews from our community to make informed purchasing decisions
        </p>
      </div>

      <!-- Filters -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Rating Filter -->
        <div>
          <label class="block text-sm font-medium mb-2">Minimum Rating</label>
          <select
            v-model="filters.minRating"
            class="w-full px-3 py-2 rounded-lg border border-border-primary bg-primary-secondary"
          >
            <option :value="undefined">All Ratings</option>
            <option :value="5">5 Stars</option>
            <option :value="4">4+ Stars</option>
            <option :value="3">3+ Stars</option>
            <option :value="2">2+ Stars</option>
            <option :value="1">1+ Stars</option>
          </select>
        </div>

        <!-- Verified Filter -->
        <div>
          <label class="block text-sm font-medium mb-2">Filter</label>
          <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-primary bg-primary-secondary cursor-pointer">
            <input
              v-model="filters.verifiedOnly"
              type="checkbox"
              class="w-4 h-4 rounded border-border-primary text-accent focus:ring-accent"
            />
            <span class="text-sm">Verified Purchases Only</span>
          </label>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-sm font-medium mb-2">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 rounded-lg border border-border-primary bg-primary-secondary"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating_high">Highest Rating</option>
            <option value="rating_low">Lowest Rating</option>
          </select>
        </div>

        <!-- Clear Filters -->
        <div class="flex items-end">
          <button
            v-if="hasActiveFilters"
            class="btn btn-ghost w-full"
            @click="clearFilters"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">{{ stats.total }}</div>
          <div class="text-sm text-text-secondary">Total Reviews</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">{{ stats.averageRating.toFixed(1) }}</div>
          <div class="text-sm text-text-secondary">Average Rating</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">{{ stats.verified }}</div>
          <div class="text-sm text-text-secondary">Verified Reviews</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">{{ stats.thisMonth }}</div>
          <div class="text-sm text-text-secondary">This Month</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="card h-48 animate-pulse bg-primary-secondary"
        />
      </div>

      <!-- Reviews List -->
      <div v-else-if="reviews.length" class="space-y-4 mb-8">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="card p-6 hover:shadow-lg transition-shadow"
        >
          <!-- Review Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <!-- Rating Stars -->
                <div class="flex gap-1">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    class="w-5 h-5"
                    :class="star <= review.rating ? 'text-yellow-400' : 'text-border-primary'"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>

                <!-- Verified Badge -->
                <span
                  v-if="review.verified"
                  class="px-2 py-0.5 text-xs font-medium rounded-full bg-success-light text-success"
                >
                  Verified Purchase
                </span>
              </div>

              <!-- Review Title -->
              <h3 class="text-h4 mb-1">{{ review.title }}</h3>

              <!-- Product Link -->
              <NuxtLink
                :to="`/products/${review.product.slug}`"
                class="text-sm text-accent hover:underline"
              >
                {{ review.product.name }}
              </NuxtLink>
            </div>

            <!-- Review Date -->
            <div class="text-sm text-text-tertiary">
              {{ formatDate(review.createdAt) }}
            </div>
          </div>

          <!-- Review Content -->
          <p class="text-text-secondary mb-4 leading-relaxed">
            {{ review.content }}
          </p>

          <!-- Pros & Cons -->
          <div v-if="review.pros || review.cons" class="grid md:grid-cols-2 gap-4 mb-4">
            <div v-if="review.pros" class="bg-success-light/10 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="font-semibold text-sm">Pros</span>
              </div>
              <p class="text-sm text-text-secondary">{{ review.pros }}</p>
            </div>

            <div v-if="review.cons" class="bg-error-light/10 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="font-semibold text-sm">Cons</span>
              </div>
              <p class="text-sm text-text-secondary">{{ review.cons }}</p>
            </div>
          </div>

          <!-- Review Footer -->
          <div class="flex items-center justify-between pt-4 border-t border-divider">
            <div class="flex items-center gap-4">
              <!-- Author -->
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                  {{ review.user.name.charAt(0).toUpperCase() }}
                </div>
                <span class="text-sm font-medium">{{ review.user.name }}</span>
              </div>
            </div>

            <!-- Helpful Votes -->
            <div class="flex items-center gap-2">
              <button
                class="btn btn-ghost btn-sm"
                :class="{ 'text-accent': review.userVote === 'HELPFUL' }"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span class="text-xs">{{ review.helpfulCount || 0 }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h3 class="text-h3 mb-2">No reviews found</h3>
        <p class="text-text-secondary mb-4">
          {{ hasActiveFilters ? 'Try adjusting your filters' : 'Be the first to write a review!' }}
        </p>
        <button v-if="hasActiveFilters" class="btn btn-primary" @click="clearFilters">
          Clear Filters
        </button>
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
interface Review {
  id: string
  rating: number
  title: string
  content: string
  pros?: string | null
  cons?: string | null
  verified: boolean
  createdAt: string
  helpfulCount?: number
  userVote?: 'HELPFUL' | 'NOT_HELPFUL' | null
  user: {
    name: string
  }
  product: {
    name: string
    slug: string
  }
}

definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()

// State
const filters = ref({
  minRating: undefined as number | undefined,
  verifiedOnly: false,
})
const sortBy = ref('recent')
const page = ref(1)
const pageSize = 20

// Computed query params
const queryParams = computed(() => {
  const params: any = {
    page: page.value,
    pageSize,
    sortBy: sortBy.value,
  }

  if (filters.value.minRating) {
    params.minRating = filters.value.minRating
  }

  if (filters.value.verifiedOnly) {
    params.verified = 'true'
  }

  return params
})

// Fetch reviews
const { data: reviewsData, pending } = await useFetch<{
  reviews: Review[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}>(
  () => `${config.public.apiUrl}/api/reviews`,
  {
    query: queryParams,
    watch: [queryParams],
    default: () => ({
      reviews: [],
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 1,
    }),
  }
)

const reviews = computed(() => reviewsData.value?.reviews || [])
const pagination = computed(() => ({
  page: reviewsData.value?.page || 1,
  pageSize: reviewsData.value?.pageSize || 20,
  total: reviewsData.value?.total || 0,
  totalPages: reviewsData.value?.totalPages || 1,
}))

// Mock stats (in real app, fetch from API)
const stats = computed(() => {
  const total = pagination.value.total
  const verified = reviews.value.filter(r => r.verified).length
  const averageRating = reviews.value.length
    ? reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length
    : 0

  // Mock this month count (in real app, calculate from dates)
  const thisMonth = Math.floor(total * 0.15)

  return {
    total,
    verified,
    averageRating,
    thisMonth,
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

const hasActiveFilters = computed(() => {
  return filters.value.minRating !== undefined || filters.value.verifiedOnly
})

// Methods
const changePage = (newPage: number) => {
  page.value = newPage
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
  filters.value = {
    minRating: undefined,
    verifiedOnly: false,
  }
  page.value = 1
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// SEO
useHead({
  title: 'Product Reviews - Comparo',
  meta: [
    {
      name: 'description',
      content: 'Read honest product reviews from our community. Make informed purchasing decisions with Comparo.',
    },
  ],
})
</script>
