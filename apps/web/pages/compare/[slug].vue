<template>
  <div v-if="comparison" class="min-h-screen py-8">
    <div class="container-custom">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-h1 mb-2">
              {{ comparison.title || 'Product Comparison' }}
            </h1>
            <p class="text-text-secondary">
              {{ comparison.products?.length }} products compared
              <span v-if="comparison.views && comparison.views > 0" class="ml-2">
                • {{ comparison.views }} views
              </span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button class="btn btn-secondary" @click="handleShare">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <button class="btn btn-ghost" @click="handlePrint">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>

      <!-- Comparison Table -->
      <ComparisonTable
        v-if="comparison.products && comparison.products.length"
        :products="comparison.products"
        @remove="() => {}"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Comparison {
  title?: string
  products?: any[]
  views?: number
  slug?: string
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

// Fetch comparison by slug
const { data: comparison } = await useFetch<Comparison>(
  () => `${config.public.apiUrl}/api/comparisons/slug/${slug.value}`,
  {
    watch: [slug],
  }
)

// Handle share
const handleShare = async () => {
  const shareUrl = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({
        title: comparison.value?.title || 'Product Comparison',
        url: shareUrl,
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(shareUrl)
    alert('Comparison link copied to clipboard!')
  }
}

// Handle print
const handlePrint = () => {
  window.print()
}

// SEO
useHead({
  title: comparison.value?.title || 'Product Comparison',
  meta: [
    {
      name: 'description',
      content: 'Compare products side-by-side to find the best option',
    },
  ],
})
</script>
