<template>
  <div class="container-custom py-8">
    <div v-if="authStore.user" class="max-w-5xl mx-auto">
      <!-- Profile Header -->
      <div class="bg-primary border border-border rounded-lg p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div
              class="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold"
            >
              {{ authStore.userInitials }}
            </div>
          </div>

          <!-- User Info -->
          <div class="flex-grow">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 class="text-3xl font-bold text-text-primary mb-1">
                  {{ authStore.displayName }}
                </h1>
                <p class="text-text-secondary">{{ authStore.user.email }}</p>
                <p v-if="authStore.user.username" class="text-sm text-text-secondary mt-1">
                  @{{ authStore.user.username }}
                </p>
              </div>
              <NuxtLink to="/profile/edit" class="btn btn-secondary mt-4 md:mt-0">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </NuxtLink>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-primary-secondary rounded-md p-3">
                <div class="text-2xl font-bold text-accent">{{ authStore.user.reputation }}</div>
                <div class="text-sm text-text-secondary">Reputation</div>
              </div>
              <div class="bg-primary-secondary rounded-md p-3">
                <div class="text-2xl font-bold text-accent">{{ stats.reviews }}</div>
                <div class="text-sm text-text-secondary">Reviews</div>
              </div>
              <div class="bg-primary-secondary rounded-md p-3">
                <div class="text-2xl font-bold text-accent">{{ stats.comparisons }}</div>
                <div class="text-sm text-text-secondary">Comparisons</div>
              </div>
              <div class="bg-primary-secondary rounded-md p-3">
                <div class="text-2xl font-bold text-accent">{{ authStore.user.badges.length }}</div>
                <div class="text-sm text-text-secondary">Badges</div>
              </div>
            </div>

            <!-- Role Badge -->
            <div v-if="authStore.user.role !== 'USER'" class="mt-4">
              <span
                class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium"
                :class="{
                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200':
                    authStore.user.role === 'ADMIN' || authStore.user.role === 'SUPER_ADMIN',
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                    authStore.user.role === 'MODERATOR',
                }"
              >
                <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ authStore.user.role }}
              </span>
            </div>

            <!-- Badges -->
            <div v-if="authStore.user.badges.length > 0" class="mt-4">
              <h3 class="text-sm font-medium text-text-secondary mb-2">Badges</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="badge in authStore.user.badges"
                  :key="badge"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                  {{ badge }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-border">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'">
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <p class="mt-2 text-text-secondary">Loading reviews...</p>
          </div>
          <div v-else-if="recentReviews.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-text-secondary"
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
            <h3 class="mt-2 text-sm font-medium text-text-primary">No reviews yet</h3>
            <p class="mt-1 text-sm text-text-secondary">
              Start reviewing products to help others make informed decisions.
            </p>
            <div class="mt-6">
              <NuxtLink to="/products" class="btn btn-primary">Browse Products</NuxtLink>
            </div>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="review in recentReviews"
              :key="review.id"
              class="bg-primary border border-border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-text-primary">{{ review.title }}</h3>
                <div class="flex items-center gap-1">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-4 h-4"
                    :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
              </div>
              <p class="text-text-secondary text-sm mb-2">{{ review.content }}</p>
              <div class="flex justify-between items-center text-xs text-text-secondary">
                <span>Product: {{ review.product?.name || 'Unknown' }}</span>
                <span>{{ formatDate(review.createdAt) }}</span>
              </div>
            </div>
            <NuxtLink to="/reviews/my-reviews" class="btn btn-secondary w-full">
              View All Reviews
            </NuxtLink>
          </div>
        </div>

        <!-- Comparisons Tab -->
        <div v-if="activeTab === 'comparisons'">
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <p class="mt-2 text-text-secondary">Loading comparisons...</p>
          </div>
          <div v-else-if="recentComparisons.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-text-primary">No comparisons yet</h3>
            <p class="mt-1 text-sm text-text-secondary">
              Create comparisons to help you decide between products.
            </p>
            <div class="mt-6">
              <NuxtLink to="/compare" class="btn btn-primary">Create Comparison</NuxtLink>
            </div>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="comparison in recentComparisons"
              :key="comparison.id"
              class="bg-primary border border-border rounded-lg p-4"
            >
              <h3 class="font-semibold text-text-primary mb-2">{{ comparison.title }}</h3>
              <p class="text-text-secondary text-sm mb-3">{{ comparison.description }}</p>
              <div class="flex justify-between items-center text-xs text-text-secondary">
                <span>{{ comparison.products?.length || 0 }} products compared</span>
                <span>{{ formatDate(comparison.createdAt) }}</span>
              </div>
            </div>
            <NuxtLink to="/comparisons/my-comparisons" class="btn btn-secondary w-full">
              View All Comparisons
            </NuxtLink>
          </div>
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'activity'">
          <div class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-text-primary">Activity Timeline</h3>
            <p class="mt-1 text-sm text-text-secondary">
              Your recent activity will appear here.
            </p>
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

const activeTab = ref('reviews')
const loading = ref(false)
const recentReviews = ref<any[]>([])
const recentComparisons = ref<any[]>([])

const stats = ref({
  reviews: 0,
  comparisons: 0,
})

const tabs = [
  { id: 'reviews', name: 'Reviews' },
  { id: 'comparisons', name: 'Comparisons' },
  { id: 'activity', name: 'Activity' },
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Fetch user's reviews and comparisons
onMounted(async () => {
  loading.value = true
  try {
    // Fetch reviews (mock data for now - will be replaced with API call)
    // const reviews = await apiFetch('/api/reviews?userId=' + authStore.user?.id)
    // recentReviews.value = reviews.slice(0, 5)
    // stats.value.reviews = reviews.length

    // Fetch comparisons (mock data for now - will be replaced with API call)
    // const comparisons = await apiFetch('/api/comparisons?userId=' + authStore.user?.id)
    // recentComparisons.value = comparisons.slice(0, 5)
    // stats.value.comparisons = comparisons.length

    // Placeholder - will be implemented once API endpoints are ready
    recentReviews.value = []
    recentComparisons.value = []
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  } finally {
    loading.value = false
  }
})
</script>
