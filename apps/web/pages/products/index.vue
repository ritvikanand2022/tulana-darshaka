<template>
  <div class="min-h-screen py-8">
    <div class="container-custom">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-h1 mb-2">Browse Products</h1>
        <p class="text-text-secondary">
          Explore our collection and compare products side-by-side
        </p>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <SearchBar
          v-model="searchQuery"
          :debounce="500"
          @search="handleSearch"
        />
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="card p-6 sticky top-24">
            <h2 class="text-h4 mb-4">Filters</h2>
            <ProductFilters
              :categories="categories"
              :brands="brands"
              :filters="filters"
              @update:filters="handleFiltersUpdate"
            />
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="flex-1">
          <!-- Sort & View Options -->
          <div class="flex items-center justify-between mb-6">
            <div class="text-sm text-text-secondary">
              {{ total }} products found
            </div>

            <div class="flex items-center gap-4">
              <!-- Sort -->
              <select
                v-model="sortBy"
                class="input text-sm"
                @change="handleSortChange"
              >
                <option value="createdAt:desc">Newest First</option>
                <option value="createdAt:asc">Oldest First</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="name:asc">Name: A to Z</option>
                <option value="name:desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div
              v-for="i in 6"
              :key="i"
              class="card h-96 animate-pulse bg-primary-secondary"
            />
          </div>

          <!-- Products -->
          <div
            v-else-if="products.length"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @compare="handleCompare"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <svg class="w-24 h-24 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 class="text-h3 mb-2">No products found</h3>
            <p class="text-text-secondary mb-4">
              Try adjusting your filters or search query
            </p>
            <button class="btn btn-primary" @click="clearFilters">
              Clear Filters
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
            <button
              class="btn btn-secondary"
              :disabled="page === 1"
              @click="changePage(page - 1)"
            >
              Previous
            </button>

            <button
              v-for="pageNum in visiblePages"
              :key="pageNum"
              class="btn"
              :class="pageNum === page ? 'btn-primary' : 'btn-secondary'"
              @click="changePage(pageNum)"
            >
              {{ pageNum }}
            </button>

            <button
              class="btn btn-secondary"
              :disabled="page === totalPages"
              @click="changePage(page + 1)"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

// Runtime config
const config = useRuntimeConfig()

// State
const searchQuery = ref('')
const page = ref(1)
const pageSize = ref(12)
const sortBy = ref('createdAt:desc')
const filters = ref<Record<string, any>>({})

// Fetch categories
const { data: categoriesData } = await useFetch(`${config.public.apiUrl}/api/categories`)
const categories = computed(() => categoriesData.value || [])

// Fetch products with filters
const queryParams = computed(() => {
  const [sortField, sortOrder] = sortBy.value.split(':')
  return {
    page: page.value,
    pageSize: pageSize.value,
    sortBy: sortField,
    sortOrder,
    search: searchQuery.value || undefined,
    ...filters.value,
  }
})

const { data: productsData, pending } = await useFetch(
  () => `${config.public.apiUrl}/api/products`,
  {
    query: queryParams,
    watch: [queryParams],
  }
)

const products = computed(() => productsData.value?.products || [])
const total = computed(() => productsData.value?.total || 0)
const totalPages = computed(() => productsData.value?.totalPages || 1)

// Get unique brands from products
const brands = computed(() => {
  const brandSet = new Set(products.value.map((p: any) => p.brand))
  return Array.from(brandSet).sort()
})

// Pagination helpers
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, page.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const handleSearch = (query: string) => {
  searchQuery.value = query
  page.value = 1
}

const handleFiltersUpdate = (newFilters: Record<string, any>) => {
  filters.value = newFilters
  page.value = 1
}

const handleSortChange = () => {
  page.value = 1
}

const changePage = (newPage: number) => {
  page.value = newPage
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
  filters.value = {}
  searchQuery.value = ''
  page.value = 1
}

const handleCompare = (product: any) => {
  // TODO: Implement comparison functionality
  console.log('Add to compare:', product)
}
</script>
