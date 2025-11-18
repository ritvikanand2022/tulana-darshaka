<template>
  <div class="comparison-table-container">
    <!-- Sticky Header -->
    <div class="sticky-header" :class="{ 'is-stuck': isStuck }">
      <div class="products-header">
        <div
          v-for="(product, idx) in products"
          :key="product.id"
          class="product-header-card"
        >
          <!-- Remove Button -->
          <button
            class="remove-btn"
            @click="emit('remove', product.id)"
            title="Remove from comparison"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Product Image -->
          <NuxtLink :to="`/products/${product.slug}`" class="block">
            <img
              v-if="product.images?.[0]?.url"
              :src="product.images[0].url"
              :alt="product.name"
              class="product-image"
            />
            <div v-else class="product-image-placeholder">
              <svg class="w-12 h-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </NuxtLink>

          <!-- Product Info -->
          <div class="product-info">
            <div class="text-xs text-text-secondary">{{ product.brand }}</div>
            <h3 class="text-sm font-semibold text-text-primary line-clamp-2">
              <NuxtLink :to="`/products/${product.slug}`" class="hover:text-accent">
                {{ product.name }}
              </NuxtLink>
            </h3>
            <div class="text-lg font-bold text-accent mt-2">
              {{ formatPrice(product.price) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Rows -->
    <div class="comparison-body">
      <!-- Basic Info Section -->
      <div class="spec-section">
        <h3 class="spec-section-title">Basic Information</h3>

        <div class="spec-row">
          <div class="spec-label">Brand</div>
          <div
            v-for="product in products"
            :key="`${product.id}-brand`"
            class="spec-value"
            :class="{ 'is-different': isDifferent('brand', product.brand, products) }"
          >
            {{ product.brand }}
          </div>
        </div>

        <div class="spec-row">
          <div class="spec-label">Price</div>
          <div
            v-for="product in products"
            :key="`${product.id}-price`"
            class="spec-value"
            :class="{ 'is-different': isDifferent('price', product.price, products) }"
          >
            {{ formatPrice(product.price) }}
          </div>
        </div>

        <div v-if="products.every(p => p.category)" class="spec-row">
          <div class="spec-label">Category</div>
          <div
            v-for="product in products"
            :key="`${product.id}-category`"
            class="spec-value"
          >
            {{ product.category?.name }}
          </div>
        </div>
      </div>

      <!-- Specifications Section -->
      <div v-if="allSpecKeys.length" class="spec-section">
        <h3 class="spec-section-title">Detailed Specifications</h3>

        <div
          v-for="specKey in allSpecKeys"
          :key="specKey"
          class="spec-row"
        >
          <div class="spec-label">{{ formatSpecKey(specKey) }}</div>
          <div
            v-for="product in products"
            :key="`${product.id}-${specKey}`"
            class="spec-value"
            :class="{
              'is-different': isSpecDifferent(specKey, products),
              'is-missing': !product.specifications?.[specKey]
            }"
          >
            {{ product.specifications?.[specKey] || '—' }}
          </div>
        </div>
      </div>

      <!-- Winner Badge (Cheapest) -->
      <div class="spec-section">
        <h3 class="spec-section-title">Best Value</h3>
        <div class="spec-row">
          <div class="spec-label">Lowest Price</div>
          <div
            v-for="product in products"
            :key="`${product.id}-winner`"
            class="spec-value"
          >
            <span
              v-if="product.id === cheapestProduct?.id"
              class="badge badge-success"
            >
              Best Price 🏆
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string
  name: string
  brand: string
  slug: string
  price: number
  images?: Array<{ url: string; alt?: string }>
  specifications?: Record<string, any>
  category?: { name: string }
}

const props = defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  remove: [productId: string]
}>()

const isStuck = ref(false)

// Track sticky header
onMounted(() => {
  const handleScroll = () => {
    isStuck.value = window.scrollY > 100
  }

  window.addEventListener('scroll', handleScroll)
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})

// Get all unique specification keys
const allSpecKeys = computed(() => {
  const keys = new Set<string>()
  props.products.forEach(product => {
    if (product.specifications) {
      Object.keys(product.specifications).forEach(key => keys.add(key))
    }
  })
  return Array.from(keys).sort()
})

// Find cheapest product
const cheapestProduct = computed(() => {
  if (!props.products.length) return null
  return props.products.reduce((min, product) =>
    product.price < min.price ? product : min
  )
})

// Check if a basic field value is different across products
const isDifferent = (field: string, value: any, products: Product[]) => {
  const values = products.map(p => p[field as keyof Product])
  return new Set(values).size > 1
}

// Check if a spec is different across products
const isSpecDifferent = (specKey: string, products: Product[]) => {
  const values = products.map(p => p.specifications?.[specKey])
  const uniqueValues = new Set(values.filter(v => v !== undefined && v !== null))
  return uniqueValues.size > 1
}

// Format spec key (camelCase to Title Case)
const formatSpecKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
</script>

<style scoped>
.comparison-table-container {
  width: 100%;
  overflow-x: auto;
}

.sticky-header {
  position: sticky;
  top: 64px;
  z-index: 40;
  background: var(--bg-primary);
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--border);
}

.sticky-header.is-stuck {
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(10px);
  background: rgba(var(--bg-primary-rgb, 255, 255, 255), 0.95);
}

.dark .sticky-header.is-stuck {
  background: rgba(25, 25, 25, 0.95);
}

.products-header {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .products-header {
    grid-template-columns: repeat(var(--product-count, 3), 1fr);
  }
}

.product-header-card {
  position: relative;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.product-header-card:hover {
  background: var(--bg-tertiary);
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem;
  background: var(--error);
  color: white;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.product-header-card:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: var(--error-dark);
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.product-image-placeholder {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-center;
  background: var(--bg-tertiary);
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.product-info {
  text-align: center;
}

.comparison-body {
  padding: 1rem;
}

.spec-section {
  margin-bottom: 2rem;
}

.spec-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--accent);
}

.spec-row {
  display: grid;
  grid-template-columns: 200px repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--divider);
  align-items: center;
}

@media (max-width: 768px) {
  .spec-row {
    grid-template-columns: 1fr;
  }
}

.spec-label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.spec-value {
  color: var(--text-primary);
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
  transition: all 0.2s ease;
}

.spec-value.is-different {
  background: var(--accent-light);
  font-weight: 600;
}

.spec-value.is-missing {
  color: var(--text-tertiary);
  font-style: italic;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success {
  background: var(--success-light);
  color: var(--success);
}
</style>
