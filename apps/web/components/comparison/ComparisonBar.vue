<template>
  <Transition name="slide-up">
    <div v-if="!comparisonStore.isEmpty" class="comparison-bar">
      <div class="container-custom">
        <div class="flex items-center justify-between gap-4">
          <!-- Left: Product Count & Info -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class="font-semibold text-text-primary">
                {{ comparisonStore.count }} {{ comparisonStore.count === 1 ? 'Product' : 'Products' }}
              </span>
            </div>

            <!-- Product Thumbnails -->
            <div class="hidden md:flex items-center gap-2">
              <div
                v-for="product in comparisonStore.products.slice(0, 3)"
                :key="product.id"
                class="product-thumb"
                :title="product.name"
              >
                <img
                  v-if="product.images?.[0]?.url"
                  :src="product.images[0].url"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <span v-if="comparisonStore.count > 3" class="text-sm text-text-secondary">
                +{{ comparisonStore.count - 3 }} more
              </span>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-3">
            <button
              class="btn btn-secondary btn-sm"
              @click="clearAll"
            >
              Clear All
            </button>
            <NuxtLink
              :to="compareUrl"
              class="btn btn-primary btn-sm"
              :class="{ 'opacity-50 cursor-not-allowed': comparisonStore.count < 2 }"
            >
              Compare Now
            </NuxtLink>
            <button
              class="btn btn-ghost btn-icon btn-sm"
              @click="hide"
              title="Hide"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useComparisonStore } from '~/stores/comparison'

const comparisonStore = useComparisonStore()

const compareUrl = computed(() => {
  const ids = comparisonStore.productIds.join(',')
  return `/compare?products=${ids}`
})

const clearAll = () => {
  if (confirm('Are you sure you want to clear all products from comparison?')) {
    comparisonStore.clearAll()
  }
}

const hide = () => {
  // Could implement hiding logic here
  // For now, just a placeholder
}

// Load from localStorage on mount
onMounted(() => {
  comparisonStore.loadFromLocalStorage()
})
</script>

<style scoped>
.comparison-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: var(--bg-primary);
  border-top: 2px solid var(--accent);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.dark .comparison-bar {
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.product-thumb {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid var(--border);
  background: var(--bg-tertiary);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
