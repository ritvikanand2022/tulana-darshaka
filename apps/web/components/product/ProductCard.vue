<template>
  <NuxtLink
    :to="`/products/${product.slug}`"
    class="card group block"
  >
    <!-- Product Image -->
    <div class="relative aspect-[4/3] overflow-hidden bg-primary-tertiary rounded-t-lg">
      <img
        v-if="product.images?.[0]?.url"
        :src="product.images[0].url"
        :alt="product.images[0].alt || product.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-text-tertiary">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Stock Status Badge -->
      <div
        v-if="product.stockStatus !== 'IN_STOCK'"
        class="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium"
        :class="{
          'bg-warning text-text-inverse': product.stockStatus === 'PRE_ORDER',
          'bg-error text-text-inverse': product.stockStatus === 'OUT_OF_STOCK',
        }"
      >
        {{ stockStatusLabel }}
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Brand -->
      <div class="text-xs text-text-secondary mb-1">{{ product.brand }}</div>

      <!-- Name -->
      <h3 class="text-base font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
        {{ product.name }}
      </h3>

      <!-- Specs Preview (first 2) -->
      <div v-if="specsPreview.length" class="flex flex-wrap gap-2 mb-3">
        <div
          v-for="spec in specsPreview"
          :key="spec.key"
          class="text-xs text-text-secondary"
        >
          {{ spec.value }}
        </div>
      </div>

      <!-- Price & Action -->
      <div class="flex items-center justify-between mt-auto">
        <div>
          <div class="text-h3 font-bold text-text-primary">
            {{ formatPrice(product.price) }}
          </div>
          <div v-if="product.category" class="text-xs text-text-tertiary">
            {{ product.category.name }}
          </div>
        </div>

        <button
          class="btn btn-icon btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
          @click.prevent="emit('compare', product)"
          title="Add to compare"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface ProductImage {
  url: string
  alt?: string
}

interface Product {
  id: string
  name: string
  brand: string
  slug: string
  price: number
  stockStatus: string
  images?: ProductImage[]
  specifications?: Record<string, any>
  category?: {
    name: string
  }
}

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  compare: [product: Product]
}>()

const stockStatusLabel = computed(() => {
  switch (props.product.stockStatus) {
    case 'PRE_ORDER':
      return 'Pre-order'
    case 'OUT_OF_STOCK':
      return 'Out of Stock'
    case 'DISCONTINUED':
      return 'Discontinued'
    default:
      return ''
  }
})

const specsPreview = computed(() => {
  if (!props.product.specifications) return []

  const specs = props.product.specifications
  const preview: Array<{ key: string; value: string }> = []

  // Get first 2 non-empty specs
  const keys = Object.keys(specs).slice(0, 2)
  for (const key of keys) {
    const value = specs[key]
    if (value) {
      preview.push({ key, value: String(value) })
    }
  }

  return preview
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
</script>
