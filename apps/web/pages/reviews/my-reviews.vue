<template>
  <div class="container-custom py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-text-primary">My Reviews</h1>
          <p class="text-text-secondary mt-1">Manage all your product reviews</p>
        </div>
        <NuxtLink to="/products" class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Write Review
        </NuxtLink>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-primary border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-accent">{{ stats.total }}</div>
          <div class="text-sm text-text-secondary">Total Reviews</div>
        </div>
        <div class="bg-primary border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-accent">{{ stats.avgRating.toFixed(1) }}</div>
          <div class="text-sm text-text-secondary">Average Rating</div>
        </div>
        <div class="bg-primary border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-accent">{{ stats.helpfulVotes }}</div>
          <div class="text-sm text-text-secondary">Helpful Votes</div>
        </div>
      </div>

      <!-- Reviews List -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        <p class="mt-2 text-text-secondary">Loading your reviews...</p>
      </div>

      <div v-else-if="reviews.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-16 w-16 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-text-primary">No reviews yet</h3>
        <p class="mt-2 text-text-secondary">
          Share your experience with products to help others make better decisions.
        </p>
        <div class="mt-6">
          <NuxtLink to="/products" class="btn btn-primary">Browse Products</NuxtLink>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="bg-primary border border-border rounded-lg p-6"
        >
          <!-- Product Info -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex gap-4">
              <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div>
                <h3 class="font-semibold text-text-primary">{{ review.product?.name || 'Product' }}</h3>
                <p class="text-sm text-text-secondary">{{ review.product?.category?.name || 'Category' }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-ghost btn-sm" @click="editReview(review)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button class="btn btn-ghost btn-sm text-red-600" @click="deleteReview(review)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Rating -->
          <div class="flex items-center gap-2 mb-3">
            <div class="flex">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-5 h-5"
                :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <span class="text-sm text-text-secondary">
              {{ new Date(review.createdAt).toLocaleDateString() }}
            </span>
          </div>

          <!-- Review Content -->
          <h4 class="font-semibold text-text-primary mb-2">{{ review.title }}</h4>
          <p class="text-text-secondary mb-4">{{ review.content }}</p>

          <!-- Pros/Cons -->
          <div v-if="review.pros?.length || review.cons?.length" class="grid md:grid-cols-2 gap-4 mb-4">
            <div v-if="review.pros?.length">
              <h5 class="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Pros</h5>
              <ul class="list-disc list-inside text-sm text-text-secondary space-y-1">
                <li v-for="(pro, index) in review.pros" :key="index">{{ pro }}</li>
              </ul>
            </div>
            <div v-if="review.cons?.length">
              <h5 class="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Cons</h5>
              <ul class="list-disc list-inside text-sm text-text-secondary space-y-1">
                <li v-for="(con, index) in review.cons" :key="index">{{ con }}</li>
              </ul>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 text-sm text-text-secondary">
            <span>{{ review.helpfulCount || 0 }} found this helpful</span>
            <span>•</span>
            <span>{{ review.viewCount || 0 }} views</span>
            <span v-if="review.verified" class="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              Verified Purchase
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const { apiFetch } = useApi()

const loading = ref(false)
const reviews = ref<any[]>([])

const stats = ref({
  total: 0,
  avgRating: 0,
  helpfulVotes: 0,
})

// Fetch user's reviews
onMounted(async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call once backend endpoint is ready
    // const data = await apiFetch('/api/reviews?userId=' + authStore.user?.id)
    // reviews.value = data.reviews
    // calculateStats()

    // Placeholder for now
    reviews.value = []
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
  } finally {
    loading.value = false
  }
})

const calculateStats = () => {
  stats.value.total = reviews.value.length
  if (reviews.value.length > 0) {
    stats.value.avgRating =
      reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length
    stats.value.helpfulVotes = reviews.value.reduce((sum, r) => sum + (r.helpfulCount || 0), 0)
  }
}

const editReview = (review: any) => {
  // TODO: Implement edit functionality
  console.log('Edit review:', review.id)
}

const deleteReview = async (review: any) => {
  if (!confirm('Are you sure you want to delete this review?')) return

  try {
    await apiFetch(`/api/reviews/${review.id}`, { method: 'DELETE' })
    reviews.value = reviews.value.filter((r) => r.id !== review.id)
    calculateStats()
  } catch (error) {
    console.error('Failed to delete review:', error)
    alert('Failed to delete review. Please try again.')
  }
}
</script>
