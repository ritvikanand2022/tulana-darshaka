<template>
  <div class="min-h-screen py-8 pb-32">
    <div class="container-custom">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-h1 mb-2">Compare Products</h1>
            <p class="text-text-secondary">
              Side-by-side comparison to help you make the best choice
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button
              v-if="products.length >= 2"
              class="btn btn-secondary"
              @click="handleShare"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <button
              v-if="products.length >= 2"
              class="btn btn-ghost"
              @click="handlePrint"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>

        <!-- Info Banner -->
        <div v-if="products.length < 2" class="card p-4 bg-warning-light border border-warning">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <div class="font-semibold text-warning">Add more products</div>
              <div class="text-sm text-text-secondary">
                You need at least 2 products to compare. Browse products and click "Add to Compare"
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
        <p class="mt-4 text-text-secondary">Loading products...</p>
      </div>

      <!-- Auth Prompt Modal -->
      <div
        v-if="showAuthPrompt"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="showAuthPrompt = false"
      >
        <div class="max-w-md w-full" @click.stop>
          <AuthPrompt
            title="Sign in to save comparison"
            description="Create an account or sign in to save and share your product comparisons."
          />
        </div>
      </div>

      <!-- Comparison Table -->
      <div v-else-if="products.length >= 2">
        <ComparisonTable
          :products="products"
          @remove="handleRemoveProduct"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="text-h3 mb-2">No products to compare</h3>
        <p class="text-text-secondary mb-6">
          Start by browsing products and adding them to your comparison
        </p>
        <NuxtLink to="/products" class="btn btn-primary">
          Browse Products
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useComparisonStore } from '~/stores/comparison'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const config = useRuntimeConfig()
const comparisonStore = useComparisonStore()

// Get product IDs from query or comparison slug
const productIds = ref<string[]>([])

// Check if we have a comparison slug or product IDs in query
if (route.query.products) {
  productIds.value = String(route.query.products).split(',').filter(Boolean)
} else if (comparisonStore.productIds.length >= 2) {
  productIds.value = comparisonStore.productIds
}

// Fetch products from API
const { data: comparisonData, pending } = await useFetch<{ products?: any[] }>(
  () => `${config.public.apiUrl}/api/comparisons/preview`,
  {
    query: {
      productIds: productIds.value.join(','),
    },
    watch: [productIds],
  }
)

const products = computed(() => comparisonData.value?.products || [])

// Handle remove product
const handleRemoveProduct = (productId: string) => {
  comparisonStore.removeProduct(productId)
  productIds.value = comparisonStore.productIds

  // If less than 2 products, redirect to products page
  if (productIds.value.length < 2) {
    navigateTo('/products')
  }
}

const authStore = useAuthStore()
const showAuthPrompt = ref(false)

// Handle share
const handleShare = async () => {
  // Check authentication
  if (!authStore.isAuthenticated) {
    showAuthPrompt.value = true
    return
  }

  try {
    const comparison = await comparisonStore.saveComparison() as any
    const shareUrl = `${config.public.siteUrl}/compare/${comparison.slug}`

    if (navigator.share) {
      await navigator.share({
        title: comparison.title || 'Product Comparison',
        url: shareUrl,
      })
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      alert('Comparison link copied to clipboard!')
    }
  } catch (error) {
    console.error('Error sharing:', error)
    alert('Error sharing comparison. Please try again.')
  }
}

// Handle print
const handlePrint = () => {
  window.print()
}

// SEO
useHead({
  title: 'Compare Products',
  meta: [
    {
      name: 'description',
      content: 'Compare products side-by-side to find the best option for you',
    },
  ],
})
</script>

<style scoped>
@media print {
  .btn,
  button {
    display: none !important;
  }
}
</style>
