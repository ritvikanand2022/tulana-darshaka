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
            <div class="text-display text-accent">{{ formatPrice(product.price) }}</div>
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
definePageMeta({
  layout: 'default',
})

const route = useRoute()
const config = useRuntimeConfig()

const slug = computed(() => route.params.slug as string)

// Fetch product
const { data: product } = await useFetch(
  () => `${config.public.apiUrl}/api/products/slug/${slug.value}`,
  {
    watch: [slug],
  }
)

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
