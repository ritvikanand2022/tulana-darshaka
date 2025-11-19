<template>
  <div class="container-custom py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">My Wishlist</h1>
        <p class="text-text-secondary">
          Save products and set price alerts to get notified when prices drop
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="wishlistStore.itemCount === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
          <svg class="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
        <p class="text-text-secondary mb-6">
          Start adding products you're interested in to keep track of them
        </p>
        <NuxtLink to="/products" class="btn btn-primary">
          Browse Products
        </NuxtLink>
      </div>

      <!-- Wishlist Items -->
      <div v-else class="space-y-4">
        <div
          v-for="item in wishlistStore.items"
          :key="item.id"
          class="card p-6 flex flex-col md:flex-row gap-6"
        >
          <!-- Product Image -->
          <NuxtLink :to="`/products/${item.slug}`" class="flex-shrink-0">
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.name"
              class="w-full md:w-48 h-48 object-cover rounded-lg"
            />
            <div v-else class="w-full md:w-48 h-48 bg-primary-secondary rounded-lg flex items-center justify-center">
              <svg class="w-16 h-16 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </NuxtLink>

          <!-- Product Info -->
          <div class="flex-1 min-w-0">
            <NuxtLink :to="`/products/${item.slug}`" class="block group">
              <h3 class="text-xl font-semibold mb-1 group-hover:text-accent transition-colors">
                {{ item.name }}
              </h3>
              <p class="text-text-secondary mb-3">{{ item.brand }}</p>
            </NuxtLink>

            <div class="flex flex-wrap gap-4 items-center mb-4">
              <div class="text-2xl font-bold text-accent">
                ${{ item.currentPrice.toFixed(2) }}
              </div>
              <div class="text-sm text-text-tertiary">
                Added {{ formatDate(item.addedAt) }}
              </div>
            </div>

            <!-- Price Alert -->
            <div class="flex flex-wrap gap-3">
              <button
                v-if="!wishlistStore.hasAlert(item.id)"
                @click="showPriceAlert(item)"
                class="btn btn-secondary text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Set Price Alert
              </button>
              <div v-else class="flex items-center gap-2">
                <span class="text-sm text-success">
                  Alert: ${{ wishlistStore.priceAlerts.get(item.id)?.toFixed(2) }}
                </span>
                <button
                  @click="wishlistStore.removePriceAlert(item.id)"
                  class="btn btn-ghost btn-icon text-sm"
                  title="Remove alert"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <NuxtLink
                :to="`/products/${item.slug}`"
                class="btn btn-primary text-sm"
              >
                View Product
              </NuxtLink>

              <button
                @click="wishlistStore.removeFromWishlist(item.id)"
                class="btn btn-ghost text-sm text-error hover:bg-error-light"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Clear All Button -->
      <div v-if="wishlistStore.itemCount > 0" class="mt-8 text-center">
        <button
          @click="confirmClearAll"
          class="btn btn-ghost text-error hover:bg-error-light"
        >
          Clear All Items
        </button>
      </div>
    </div>

    <!-- Price Alert Modal -->
    <div
      v-if="selectedProduct"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="selectedProduct = null"
    >
      <div class="card p-6 max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4">Set Price Alert</h3>
        <p class="text-text-secondary mb-4">
          Get notified when the price drops below your target
        </p>

        <div class="mb-6">
          <label class="label mb-2">Target Price</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
            <input
              v-model.number="alertPrice"
              type="number"
              step="0.01"
              min="0"
              :max="selectedProduct.currentPrice"
              class="input pl-8"
              placeholder="0.00"
            />
          </div>
          <p class="text-sm text-text-tertiary mt-2">
            Current price: ${{ selectedProduct.currentPrice.toFixed(2) }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="setPriceAlert"
            class="btn btn-primary flex-1"
            :disabled="!alertPrice || alertPrice >= selectedProduct.currentPrice"
          >
            Set Alert
          </button>
          <button
            @click="selectedProduct = null"
            class="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWishlistStore } from '~/stores/wishlist'

definePageMeta({
  layout: 'default',
})

const wishlistStore = useWishlistStore()
const selectedProduct = ref<any>(null)
const alertPrice = ref<number | null>(null)

// Load wishlist from localStorage on mount
onMounted(() => {
  wishlistStore.loadFromLocalStorage()
})

const formatDate = (date: Date) => {
  const d = new Date(date)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return d.toLocaleDateString()
}

const showPriceAlert = (product: any) => {
  selectedProduct.value = product
  alertPrice.value = product.currentPrice * 0.9 // Default to 10% off
}

const setPriceAlert = () => {
  if (selectedProduct.value && alertPrice.value) {
    wishlistStore.setPriceAlert(selectedProduct.value.id, alertPrice.value)
    selectedProduct.value = null
    alertPrice.value = null
  }
}

const confirmClearAll = () => {
  if (confirm('Are you sure you want to clear all items from your wishlist?')) {
    wishlistStore.clearWishlist()
  }
}

// SEO
useHead({
  title: 'My Wishlist - Comparo',
  meta: [
    {
      name: 'description',
      content: 'View and manage your saved products and price alerts'
    },
  ],
})
</script>
