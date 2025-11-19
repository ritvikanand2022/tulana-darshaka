<template>
  <div v-if="category" class="min-h-screen py-8">
    <div class="container-custom">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <NuxtLink to="/" class="hover:text-accent">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categories" class="hover:text-accent">Categories</NuxtLink>
        <span>/</span>
        <span class="text-text-primary">{{ category.name }}</span>
      </nav>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-h1 mb-2">{{ category.name }}</h1>
        <p v-if="category.description" class="text-text-secondary">
          {{ category.description }}
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">{{ total }}</div>
          <div class="text-sm text-text-secondary">Total Products</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">{{ uniqueBrands.length }}</div>
          <div class="text-sm text-text-secondary">Brands</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">
            {{ formatPrice(priceRange.min) }}
          </div>
          <div class="text-sm text-text-secondary">Lowest Price</div>
        </div>
        <div class="card p-4">
          <div class="text-2xl font-bold text-accent mb-1">
            {{ formatPrice(priceRange.max) }}
          </div>
          <div class="text-sm text-text-secondary">Highest Price</div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="card p-6 sticky top-24">
            <h2 class="text-h4 mb-4">Filters</h2>

            <!-- Price Range -->
            <div class="mb-6">
              <h3 class="font-semibold mb-3 text-sm">Price Range</h3>
              <div class="flex gap-2">
                <input
                  v-model.number="filters.minPrice"
                  type="number"
                  placeholder="Min"
                  class="flex-1 px-3 py-2 text-sm rounded-lg border border-border-primary bg-primary-secondary"
                />
                <input
                  v-model.number="filters.maxPrice"
                  type="number"
                  placeholder="Max"
                  class="flex-1 px-3 py-2 text-sm rounded-lg border border-border-primary bg-primary-secondary"
                />
              </div>
            </div>

            <!-- Brands -->
            <div v-if="uniqueBrands.length" class="mb-6">
              <h3 class="font-semibold mb-3 text-sm">Brands</h3>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <label
                  v-for="brand in uniqueBrands"
                  :key="brand"
                  class="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors"
                >
                  <input
                    v-model="filters.brands"
                    :value="brand"
                    type="checkbox"
                    class="w-4 h-4 rounded border-border-primary text-accent focus:ring-accent"
                  />
                  <span class="text-sm">{{ brand }}</span>
                </label>
              </div>
            </div>

            <!-- Stock Status -->
            <div class="mb-6">
              <h3 class="font-semibold mb-3 text-sm">Availability</h3>
              <label class="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                <input
                  v-model="filters.inStockOnly"
                  type="checkbox"
                  class="w-4 h-4 rounded border-border-primary text-accent focus:ring-accent"
                />
                <span class="text-sm">In Stock Only</span>
              </label>
            </div>

            <button
              v-if="hasActiveFilters"
              class="btn btn-ghost w-full text-sm"
              @click="clearFilters"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="flex-1">
          <!-- Sort & View Options -->
          <div class="flex items-center justify-between mb-6">
            <div class="text-sm text-text-secondary">
              {{ filteredProducts.length }} of {{ total }} products
            </div>

            <div class="flex items-center gap-4">
              <!-- Sort -->
              <select
                v-model="sortBy"
                class="px-3 py-2 text-sm rounded-lg border border-border-primary bg-primary-secondary"
              >
                <option value="createdAt:desc">Newest First</option>
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
            v-else-if="filteredProducts.length"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <svg class="w-24 h-24 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 class="text-h3 mb-2">No products found</h3>
            <p class="text-text-secondary mb-4">
              Try adjusting your filters
            </p>
            <button class="btn btn-primary" @click="clearFilters">
              Clear Filters
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="totalProductPages > 1" class="flex justify-center gap-2 mt-8">
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
              :disabled="page === totalProductPages"
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
interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  brand: string
  price: number
  stockStatus: string
  images?: Array<{ url: string; alt?: string }>
  category?: { name: string }
}

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const config = useRuntimeConfig()

const slug = computed(() => {
  const params = route.params as { slug?: string | string[] }
  const slugParam = params.slug
  return typeof slugParam === 'string' ? slugParam : Array.isArray(slugParam) ? slugParam[0] : ''
})

// Filters and sorting state
const page = ref(1)
const pageSize = 12
const sortBy = ref('createdAt:desc')
const filters = ref({
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  brands: [] as string[],
  inStockOnly: false,
})

// Fetch category
const { data: category } = await useFetch<Category>(
  () => `${config.public.apiUrl}/api/categories/slug/${slug.value}`
)

// Fetch products in category
const { data: productsData, pending } = await useFetch<{ products: Product[]; total: number }>(
  () => `${config.public.apiUrl}/api/categories/slug/${slug.value}/products`,
  {
    query: {
      page: 1,
      pageSize: 100, // Fetch more for client-side filtering
    },
    default: () => ({ products: [], total: 0 }),
  }
)

const products = computed(() => productsData.value?.products || [])
const total = computed(() => productsData.value?.total || 0)

// Get unique brands
const uniqueBrands = computed(() => {
  const brandSet = new Set(products.value.map(p => p.brand))
  return Array.from(brandSet).sort()
})

// Price range
const priceRange = computed(() => {
  if (!products.value.length) return { min: 0, max: 0 }
  const prices = products.value.map(p => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
})

// Filter products
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Price filter
  if (filters.value.minPrice !== undefined) {
    result = result.filter(p => p.price >= filters.value.minPrice!)
  }
  if (filters.value.maxPrice !== undefined) {
    result = result.filter(p => p.price <= filters.value.maxPrice!)
  }

  // Brand filter
  if (filters.value.brands.length > 0) {
    result = result.filter(p => filters.value.brands.includes(p.brand))
  }

  // Stock filter
  if (filters.value.inStockOnly) {
    result = result.filter(p => p.stockStatus === 'IN_STOCK')
  }

  // Sort
  const [sortField, sortOrder] = sortBy.value.split(':')
  result.sort((a: any, b: any) => {
    let aVal = a[sortField]
    let bVal = b[sortField]

    if (sortField === 'name') {
      aVal = aVal?.toLowerCase()
      bVal = bVal?.toLowerCase()
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return result
})

// Pagination
const totalProductPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize))

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * pageSize
  const end = start + pageSize
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, page.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalProductPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const hasActiveFilters = computed(() => {
  return filters.value.minPrice !== undefined ||
    filters.value.maxPrice !== undefined ||
    filters.value.brands.length > 0 ||
    filters.value.inStockOnly
})

// Methods
const changePage = (newPage: number) => {
  page.value = newPage
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
  filters.value = {
    minPrice: undefined,
    maxPrice: undefined,
    brands: [],
    inStockOnly: false,
  }
  page.value = 1
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

// SEO
useHead({
  title: () => `${category.value?.name || 'Category'} - Comparo`,
  meta: [
    {
      name: 'description',
      content: () => category.value?.description || `Browse ${category.value?.name} products on Comparo`,
    },
  ],
})
</script>
