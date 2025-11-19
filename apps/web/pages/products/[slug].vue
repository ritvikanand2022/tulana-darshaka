<template>
  <div v-if="product" class="min-h-screen py-8">
    <div class="container-custom">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <NuxtLink to="/" class="hover:text-accent">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/products" class="hover:text-accent">Products</NuxtLink>
        <span>/</span>
        <NuxtLink
          v-if="product.category"
          :to="`/categories/${product.category.slug}`"
          class="hover:text-accent"
        >
          {{ product.category.name }}
        </NuxtLink>
        <span>/</span>
        <span class="text-text-primary">{{ product.name }}</span>
      </nav>

      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <!-- Images -->
        <div>
          <div class="card overflow-hidden">
            <img
              v-if="selectedImage"
              :src="selectedImage.url"
              :alt="selectedImage.alt || product.name"
              class="w-full aspect-square object-cover"
            />
            <div v-else class="w-full aspect-square bg-primary-tertiary flex items-center justify-center">
              <svg class="w-24 h-24 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Thumbnail Gallery -->
          <div v-if="product.images && product.images.length > 1" class="flex gap-2 mt-4">
            <button
              v-for="(image, idx) in product.images"
              :key="idx"
              class="w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors"
              :class="selectedImageIndex === idx ? 'border-accent' : 'border-transparent hover:border-border-hover'"
              @click="selectedImageIndex = idx"
            >
              <img :src="image.url" :alt="image.alt || `${product.name} ${idx + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div>
          <div class="mb-2">
            <span class="text-sm text-text-secondary">{{ product.brand }}</span>
          </div>

          <h1 class="text-h1 mb-4">{{ product.name }}</h1>

          <div class="flex items-center gap-4 mb-6">
            <div class="text-display text-accent">{{ formatPrice(product.price || 0) }}</div>
            <div
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="stockStatusClass"
            >
              {{ stockStatusLabel }}
            </div>
          </div>

          <p v-if="product.description" class="text-text-secondary mb-6">
            {{ product.description }}
          </p>

          <!-- Actions -->
          <div class="flex gap-3 mb-8">
            <button class="btn btn-primary flex-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Deals
            </button>
            <button class="btn btn-secondary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Add to Compare
            </button>
            <button class="btn btn-ghost btn-icon">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <!-- Quick Specs -->
          <div v-if="quickSpecs.length" class="card p-4">
            <h3 class="text-h4 mb-3">Key Specifications</h3>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="spec in quickSpecs" :key="spec.key" class="flex flex-col">
                <span class="text-xs text-text-tertiary">{{ spec.label }}</span>
                <span class="text-sm font-medium text-text-primary">{{ spec.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Specifications -->
      <div v-if="product.specifications" class="card p-6 mb-8">
        <h2 class="text-h2 mb-6">Detailed Specifications</h2>
        <div class="grid md:grid-cols-2 gap-x-8 gap-y-4">
          <div
            v-for="[key, value] in Object.entries(product.specifications)"
            :key="key"
            class="flex justify-between py-3 border-b border-divider"
          >
            <span class="text-text-secondary capitalize">{{ formatSpecKey(key) }}</span>
            <span class="text-text-primary font-medium">{{ value }}</span>
          </div>
        </div>
      </div>

      <!-- Price History -->
      <div v-if="product.priceHistory && product.priceHistory.length > 1" class="card p-6 mb-8">
        <h2 class="text-h2 mb-6">Price History</h2>
        <div class="text-text-secondary">
          <p>Lowest: {{ formatPrice(lowestPrice) }}</p>
          <p>Highest: {{ formatPrice(highestPrice) }}</p>
          <p>Average: {{ formatPrice(averagePrice) }}</p>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="mt-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-h2">Customer Reviews</h2>
          <button
            v-if="!showReviewForm"
            class="btn btn-primary"
            @click="showReviewForm = true"
          >
            Write a Review
          </button>
        </div>

        <!-- Review Statistics -->
        <div v-if="reviewStats" class="card p-6 mb-8">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Overall Rating -->
            <div class="flex flex-col items-center justify-center">
              <div class="text-6xl font-bold text-accent mb-2">
                {{ reviewStats.averageRating.toFixed(1) }}
              </div>
              <div class="flex gap-1 mb-2">
                <svg
                  v-for="star in 5"
                  :key="star"
                  class="w-6 h-6"
                  :class="star <= Math.round(reviewStats.averageRating) ? 'text-yellow-400' : 'text-border-primary'"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div class="text-sm text-text-secondary">
                Based on {{ reviewStats.totalReviews }} {{ reviewStats.totalReviews === 1 ? 'review' : 'reviews' }}
              </div>
            </div>

            <!-- Rating Distribution -->
            <div class="space-y-2">
              <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center gap-3">
                <div class="flex items-center gap-1 w-16">
                  <span class="text-sm font-medium">{{ rating }}</span>
                  <svg class="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div class="flex-1 h-4 bg-primary-tertiary rounded-full overflow-hidden">
                  <div
                    class="h-full bg-accent transition-all"
                    :style="{ width: `${getRatingPercentage(rating)}%` }"
                  ></div>
                </div>
                <span class="text-sm text-text-secondary w-12 text-right">
                  {{ reviewStats.ratingDistribution[rating] }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Review Form -->
        <div v-if="showReviewForm" class="mb-8">
          <AuthPrompt
            v-if="!authStore.isAuthenticated"
            title="Sign in to write a review"
            description="Share your experience by creating an account or signing in."
          />
          <ReviewForm
            v-else
            :product-id="product?.id || ''"
            @submit="handleReviewSubmit"
            @cancel="showReviewForm = false"
          />
        </div>

        <!-- Filter and Sort Controls -->
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <div class="flex items-center gap-2">
            <label class="text-sm text-text-secondary">Sort by:</label>
            <select
              v-model="reviewSortBy"
              class="form-select"
              @change="loadReviews"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating_high">Highest Rating</option>
              <option value="rating_low">Lowest Rating</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm text-text-secondary">Filter by:</label>
            <select
              v-model="reviewRatingFilter"
              class="form-select"
              @change="loadReviews"
            >
              <option :value="null">All Ratings</option>
              <option :value="5">5 Stars</option>
              <option :value="4">4 Stars</option>
              <option :value="3">3 Stars</option>
              <option :value="2">2 Stars</option>
              <option :value="1">1 Star</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <input
              id="verified-only"
              v-model="reviewVerifiedOnly"
              type="checkbox"
              class="form-checkbox"
              @change="loadReviews"
            />
            <label for="verified-only" class="text-sm text-text-secondary cursor-pointer">
              Verified purchases only
            </label>
          </div>
        </div>

        <!-- Reviews List -->
        <div v-if="reviews.length > 0" class="space-y-4 mb-8">
          <ReviewCard
            v-for="review in reviews"
            :key="review.id"
            :review="review"
            @vote="handleVote"
            @removeVote="handleRemoveVote"
          />
        </div>

        <!-- No Reviews -->
        <div v-else class="card p-8 text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 class="text-h4 mb-2">No reviews yet</h3>
          <p class="text-text-secondary mb-4">Be the first to review this product!</p>
          <button class="btn btn-primary" @click="showReviewForm = true">
            Write a Review
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="reviewPagination.totalPages > 1" class="flex justify-center gap-2">
          <button
            class="btn btn-ghost btn-sm"
            :disabled="reviewPagination.page === 1"
            @click="changePage(reviewPagination.page - 1)"
          >
            Previous
          </button>
          <button
            v-for="page in paginationPages"
            :key="page"
            class="btn btn-sm"
            :class="page === reviewPagination.page ? 'btn-primary' : 'btn-ghost'"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button
            class="btn btn-ghost btn-sm"
            :disabled="reviewPagination.page === reviewPagination.totalPages"
            @click="changePage(reviewPagination.page + 1)"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Similar Products -->
      <div class="mt-12">
        <h2 class="text-h2 mb-6">Similar Products</h2>
        <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <!-- TODO: Fetch and display similar products -->
          <div class="card p-4 text-center text-text-secondary">
            Coming soon...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id?: string
  name?: string
  brand?: string
  description?: string
  price?: number
  images?: Array<{ url: string; alt?: string }>
  specifications?: any
  priceHistory?: any[]
  stockStatus?: string
  category?: { name?: string; slug?: string }
  slug?: string
}

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const slug = computed(() => {
  const params = route.params as { slug?: string | string[] }
  const slugParam = params.slug
  return typeof slugParam === 'string' ? slugParam : Array.isArray(slugParam) ? slugParam[0] : ''
})

// Fetch product
const { data: product } = await useFetch<Product>(
  () => `${config.public.apiUrl}/api/products/slug/${slug.value}`,
  {
    watch: [slug],
  }
)

// Reviews state
const reviews = ref<any[]>([])
const reviewStats = ref<any>(null)
const showReviewForm = ref(false)
const reviewSortBy = ref('recent')
const reviewRatingFilter = ref<number | null>(null)
const reviewVerifiedOnly = ref(false)
const reviewPagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
})

// Load review statistics
async function loadReviewStats() {
  if (!product.value?.id) return

  try {
    const data = await $fetch(`${config.public.apiUrl}/api/reviews/product/${product.value.id}/stats`)
    reviewStats.value = data
  } catch (error) {
    console.error('Failed to load review stats:', error)
  }
}

// Load reviews
async function loadReviews() {
  if (!product.value?.id) return

  try {
    const params = new URLSearchParams({
      productId: product.value.id,
      page: String(reviewPagination.value.page),
      pageSize: String(reviewPagination.value.pageSize),
      sortBy: reviewSortBy.value,
    })

    if (reviewRatingFilter.value) {
      params.append('rating', String(reviewRatingFilter.value))
    }

    if (reviewVerifiedOnly.value) {
      params.append('verified', 'true')
    }

    const data = await $fetch<{ reviews: any[]; page: number; pageSize: number; total: number; totalPages: number }>(`${config.public.apiUrl}/api/reviews?${params.toString()}`)

    reviews.value = data.reviews
    reviewPagination.value = {
      page: data.page,
      pageSize: data.pageSize,
      total: data.total,
      totalPages: data.totalPages,
    }
  } catch (error) {
    console.error('Failed to load reviews:', error)
  }
}

// Handle review submit
async function handleReviewSubmit(review: any) {
  showReviewForm.value = false
  // Reload reviews and stats
  await Promise.all([loadReviews(), loadReviewStats()])
}

// Handle vote
async function handleVote(reviewId: string, helpful: boolean) {
  // Optimistically update the UI
  await loadReviews()
}

// Handle remove vote
async function handleRemoveVote(reviewId: string) {
  // Optimistically update the UI
  await loadReviews()
}

// Change page
function changePage(page: number) {
  reviewPagination.value.page = page
  loadReviews()
  // Scroll to reviews section
  const reviewsSection = document.querySelector('.mt-12')
  reviewsSection?.scrollIntoView({ behavior: 'smooth' })
}

// Calculate pagination pages to display
const paginationPages = computed(() => {
  const { page, totalPages } = reviewPagination.value
  const pages: number[] = []
  const maxPages = 5

  if (totalPages <= maxPages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (page <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push(totalPages)
    } else if (page >= totalPages - 2) {
      pages.push(1)
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push(page - 1)
      pages.push(page)
      pages.push(page + 1)
      pages.push(totalPages)
    }
  }

  return pages
})

// Calculate rating percentage for distribution
function getRatingPercentage(rating: number): number {
  if (!reviewStats.value || reviewStats.value.totalReviews === 0) return 0
  return (reviewStats.value.ratingDistribution[rating] / reviewStats.value.totalReviews) * 100
}

// Load initial reviews data
onMounted(() => {
  if (product.value?.id) {
    loadReviewStats()
    loadReviews()
  }
})

// Image gallery
const selectedImageIndex = ref(0)
const selectedImage = computed(() => {
  return product.value?.images?.[selectedImageIndex.value] || product.value?.images?.[0]
})

// Stock status
const stockStatusLabel = computed(() => {
  switch (product.value?.stockStatus) {
    case 'IN_STOCK':
      return 'In Stock'
    case 'OUT_OF_STOCK':
      return 'Out of Stock'
    case 'PRE_ORDER':
      return 'Pre-order'
    case 'DISCONTINUED':
      return 'Discontinued'
    default:
      return ''
  }
})

const stockStatusClass = computed(() => {
  switch (product.value?.stockStatus) {
    case 'IN_STOCK':
      return 'bg-success-light text-success'
    case 'OUT_OF_STOCK':
      return 'bg-error-light text-error'
    case 'PRE_ORDER':
      return 'bg-warning-light text-warning'
    case 'DISCONTINUED':
      return 'bg-primary-tertiary text-text-secondary'
    default:
      return ''
  }
})

// Quick specs (first 4)
const quickSpecs = computed(() => {
  if (!product.value?.specifications) return []

  return Object.entries(product.value.specifications)
    .slice(0, 4)
    .map(([key, value]) => ({
      key,
      label: formatSpecKey(key),
      value,
    }))
})

// Price calculations
const lowestPrice = computed(() => {
  if (!product.value?.priceHistory?.length) return 0
  return Math.min(...product.value.priceHistory.map((p: any) => Number(p.price)))
})

const highestPrice = computed(() => {
  if (!product.value?.priceHistory?.length) return 0
  return Math.max(...product.value.priceHistory.map((p: any) => Number(p.price)))
})

const averagePrice = computed(() => {
  if (!product.value?.priceHistory?.length) return 0
  const sum = product.value.priceHistory.reduce((acc: number, p: any) => acc + Number(p.price), 0)
  return sum / product.value.priceHistory.length
})

// Helpers
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const formatSpecKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

// SEO
useHead({
  title: product.value?.name || 'Product',
  meta: [
    {
      name: 'description',
      content: product.value?.description || `View details for ${product.value?.name}`,
    },
  ],
})
</script>

<style scoped>
.form-select {
  padding: 8px 12px;
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.form-select:hover {
  border-color: var(--border-secondary);
}

.form-select:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.form-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-primary);
  border-radius: 4px;
  cursor: pointer;
  accent-color: var(--accent-primary);
}
</style>
