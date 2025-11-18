<script setup lang="ts">
import { ref, computed, watch } from 'vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const query = ref(route.query.q as string || '')
const searchType = ref((route.query.type as string) || 'all')
const selectedCategories = ref<string[]>([])
const minPrice = ref<number | undefined>()
const maxPrice = ref<number | undefined>()
const minRating = ref<number | undefined>()
const page = ref(1)

const results = ref<any>(null)
const isLoading = ref(false)

// Watch query changes
watch(() => route.query, () => {
  query.value = route.query.q as string || ''
  searchType.value = (route.query.type as string) || 'all'
  page.value = 1
  performSearch()
}, { immediate: true })

async function performSearch() {
  if (!query.value) return

  isLoading.value = true
  try {
    const params = new URLSearchParams({
      query: query.value,
      type: searchType.value,
      page: String(page.value),
      pageSize: '20',
    })

    if (selectedCategories.value.length > 0) {
      selectedCategories.value.forEach(cat => params.append('categories', cat))
    }

    if (minPrice.value !== undefined) {
      params.append('minPrice', String(minPrice.value))
    }

    if (maxPrice.value !== undefined) {
      params.append('maxPrice', String(maxPrice.value))
    }

    if (minRating.value !== undefined) {
      params.append('minRating', String(minRating.value))
    }

    const data = await $fetch(`${config.public.apiUrl}/api/search?${params.toString()}`)
    results.value = data
  } catch (error) {
    console.error('Search failed:', error)
    results.value = null
  } finally {
    isLoading.value = false
  }
}

function changeType(type: string) {
  searchType.value = type
  page.value = 1
  router.push({ query: { ...route.query, type } })
}

function changePage(newPage: number) {
  page.value = newPage
  performSearch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function applyFilters() {
  page.value = 1
  performSearch()
}

function resetFilters() {
  selectedCategories.value = []
  minPrice.value = undefined
  maxPrice.value = undefined
  minRating.value = undefined
  page.value = 1
  performSearch()
}

const hasFilters = computed(() => {
  return selectedCategories.value.length > 0 ||
    minPrice.value !== undefined ||
    maxPrice.value !== undefined ||
    minRating.value !== undefined
})

const totalProducts = computed(() => results.value?.results?.products?.length || 0)
const totalCategories = computed(() => results.value?.results?.categories?.length || 0)
const totalReviews = computed(() => results.value?.results?.reviews?.length || 0)

// SEO
useHead({
  title: query.value ? `Search: ${query.value}` : 'Search',
  meta: [
    {
      name: 'description',
      content: `Search results for ${query.value}`,
    },
  ],
})
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="container-custom">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-h1 mb-2">Search Results</h1>
        <p v-if="query" class="text-text-secondary">
          Showing results for <span class="font-semibold text-text-primary">"{{ query }}"</span>
        </p>
      </div>

      <!-- Type Tabs -->
      <div class="tabs-container mb-8">
        <button
          class="tab"
          :class="{ active: searchType === 'all' }"
          @click="changeType('all')"
        >
          All Results
          <span v-if="results?.totalResults" class="badge">{{ results.totalResults }}</span>
        </button>
        <button
          class="tab"
          :class="{ active: searchType === 'products' }"
          @click="changeType('products')"
        >
          Products
          <span v-if="totalProducts" class="badge">{{ totalProducts }}</span>
        </button>
        <button
          class="tab"
          :class="{ active: searchType === 'categories' }"
          @click="changeType('categories')"
        >
          Categories
          <span v-if="totalCategories" class="badge">{{ totalCategories }}</span>
        </button>
        <button
          class="tab"
          :class="{ active: searchType === 'reviews' }"
          @click="changeType('reviews')"
        >
          Reviews
          <span v-if="totalReviews" class="badge">{{ totalReviews }}</span>
        </button>
      </div>

      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <aside v-if="searchType === 'products' || searchType === 'all'" class="filters-sidebar">
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-h4">Filters</h3>
              <button
                v-if="hasFilters"
                class="text-sm text-accent hover:underline"
                @click="resetFilters"
              >
                Reset
              </button>
            </div>

            <!-- Price Range -->
            <div class="filter-group">
              <h4 class="filter-label">Price Range</h4>
              <div class="flex gap-2">
                <input
                  v-model.number="minPrice"
                  type="number"
                  placeholder="Min"
                  class="form-input-sm"
                />
                <span class="text-text-secondary">-</span>
                <input
                  v-model.number="maxPrice"
                  type="number"
                  placeholder="Max"
                  class="form-input-sm"
                />
              </div>
            </div>

            <!-- Rating -->
            <div class="filter-group">
              <h4 class="filter-label">Minimum Rating</h4>
              <div class="rating-filters">
                <button
                  v-for="rating in [5, 4, 3, 2, 1]"
                  :key="rating"
                  class="rating-filter"
                  :class="{ active: minRating === rating }"
                  @click="minRating = minRating === rating ? undefined : rating"
                >
                  <div class="stars">
                    <svg
                      v-for="star in rating"
                      :key="star"
                      class="star"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <span class="text-sm">& up</span>
                </button>
              </div>
            </div>

            <button class="btn btn-primary w-full" @click="applyFilters">
              Apply Filters
            </button>
          </div>
        </aside>

        <!-- Results -->
        <main class="lg:col-span-3">
          <!-- Loading -->
          <div v-if="isLoading" class="loading-container">
            <div class="spinner-lg"></div>
            <p>Searching...</p>
          </div>

          <!-- No Query -->
          <div v-else-if="!query" class="empty-state-large">
            <svg class="icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="text-h3 mb-2">Start Searching</h3>
            <p class="text-text-secondary">Enter a search query to find products, categories, and reviews</p>
          </div>

          <!-- No Results -->
          <div v-else-if="results && results.totalResults === 0" class="empty-state-large">
            <svg class="icon-xl" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-h3 mb-2">No results found</h3>
            <p class="text-text-secondary">Try different keywords or remove some filters</p>
          </div>

          <!-- Results -->
          <div v-else-if="results" class="results-container">
            <!-- Products -->
            <section v-if="results.results.products?.length > 0" class="result-section">
              <h2 class="section-title">Products ({{ results.results.products.length }})</h2>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard
                  v-for="product in results.results.products"
                  :key="product.id"
                  :product="product"
                />
              </div>
            </section>

            <!-- Categories -->
            <section v-if="results.results.categories?.length > 0" class="result-section">
              <h2 class="section-title">Categories ({{ results.results.categories.length }})</h2>
              <div class="grid md:grid-cols-2 gap-4">
                <NuxtLink
                  v-for="category in results.results.categories"
                  :key="category.id"
                  :to="`/categories/${category.slug}`"
                  class="category-card"
                >
                  <div class="category-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div class="category-content">
                    <h3 class="category-name">{{ category.name }}</h3>
                    <p v-if="category.description" class="category-description">{{ category.description }}</p>
                    <span class="category-count">{{ category._count.products }} products</span>
                  </div>
                </NuxtLink>
              </div>
            </section>

            <!-- Reviews -->
            <section v-if="results.results.reviews?.length > 0" class="result-section">
              <h2 class="section-title">Reviews ({{ results.results.reviews.length }})</h2>
              <div class="space-y-4">
                <div
                  v-for="review in results.results.reviews"
                  :key="review.id"
                  class="review-result"
                >
                  <div class="review-header">
                    <div class="review-product">
                      <NuxtLink :to="`/products/${review.product.slug}`" class="product-link">
                        {{ review.product.name }}
                      </NuxtLink>
                    </div>
                    <div class="review-rating">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        class="star"
                        :class="{ filled: star <= review.rating }"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                  <h4 class="review-title">{{ review.title }}</h4>
                  <p class="review-content">{{ review.content }}</p>
                  <div class="review-footer">
                    <span class="review-author">by {{ review.user.name }}</span>
                    <span class="review-date">{{ new Date(review.createdAt).toLocaleDateString() }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Pagination -->
            <div v-if="results.totalPages > 1" class="pagination">
              <button
                class="btn btn-ghost btn-sm"
                :disabled="page === 1"
                @click="changePage(page - 1)"
              >
                Previous
              </button>
              <span class="page-info">
                Page {{ page }} of {{ results.totalPages }}
              </span>
              <button
                class="btn btn-ghost btn-sm"
                :disabled="page === results.totalPages"
                @click="changePage(page + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs-container {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid var(--border-primary);
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  margin-bottom: -2px;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--text-primary);
}

.tab.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.badge {
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: 12px;
  font-size: 12px;
}

.tab.active .badge {
  background: var(--accent-primary);
  color: white;
}

.filters-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.form-input-sm {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
}

.rating-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-filter:hover {
  border-color: var(--accent-primary);
}

.rating-filter.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

.rating-filter .stars {
  display: flex;
  gap: 2px;
}

.rating-filter .star {
  width: 14px;
  height: 14px;
  color: #fbbf24;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 64px 24px;
  color: var(--text-secondary);
}

.spinner-lg {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-primary);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.empty-state-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 24px;
  text-align: center;
}

.icon-xl {
  width: 64px;
  height: 64px;
  color: var(--text-tertiary);
}

.result-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-primary);
}

.category-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.category-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--bg-secondary);
  border-radius: 8px;
  color: var(--accent-primary);
  flex-shrink: 0;
}

.category-icon svg {
  width: 24px;
  height: 24px;
}

.category-content {
  flex: 1;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.category-description {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.category-count {
  font-size: 12px;
  color: var(--text-tertiary);
}

.review-result {
  padding: 20px;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.product-link {
  font-size: 14px;
  color: var(--accent-primary);
  text-decoration: none;
}

.product-link:hover {
  text-decoration: underline;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.review-rating .star {
  width: 14px;
  height: 14px;
  color: var(--border-primary);
}

.review-rating .star.filled {
  color: #fbbf24;
}

.review-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.review-content {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.review-footer {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--text-tertiary);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

.page-info {
  font-size: 14px;
  color: var(--text-secondary);
}

@media (max-width: 1024px) {
  .filters-sidebar {
    position: static;
  }
}
</style>
