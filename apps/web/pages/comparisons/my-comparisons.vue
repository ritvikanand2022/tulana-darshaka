<template>
  <div class="container-custom py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-text-primary">My Comparisons</h1>
          <p class="text-text-secondary mt-1">View and manage your product comparisons</p>
        </div>
        <NuxtLink to="/compare" class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Comparison
        </NuxtLink>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-primary border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-accent">{{ stats.total }}</div>
          <div class="text-sm text-text-secondary">Total Comparisons</div>
        </div>
        <div class="bg-primary border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-accent">{{ stats.public }}</div>
          <div class="text-sm text-text-secondary">Public</div>
        </div>
        <div class="bg-primary border border-border rounded-lg p-4">
          <div class="text-2xl font-bold text-accent">{{ stats.private }}</div>
          <div class="text-sm text-text-secondary">Private</div>
        </div>
      </div>

      <!-- Comparisons List -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        <p class="mt-2 text-text-secondary">Loading your comparisons...</p>
      </div>

      <div v-else-if="comparisons.length === 0" class="text-center py-12">
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-text-primary">No comparisons yet</h3>
        <p class="mt-2 text-text-secondary">
          Create comparisons to help you decide between different products.
        </p>
        <div class="mt-6">
          <NuxtLink to="/compare" class="btn btn-primary">Create Comparison</NuxtLink>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="comparison in comparisons"
          :key="comparison.id"
          class="bg-primary border border-border rounded-lg p-6"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-xl font-semibold text-text-primary">{{ comparison.title }}</h3>
                <span
                  v-if="!comparison.isPublic"
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                >
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Private
                </span>
              </div>
              <p class="text-text-secondary text-sm">{{ comparison.description }}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <NuxtLink :to="`/compare/${comparison.slug || comparison.id}`" class="btn btn-ghost btn-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </NuxtLink>
              <button class="btn btn-ghost btn-sm" @click="editComparison(comparison)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button class="btn btn-ghost btn-sm text-red-600" @click="deleteComparison(comparison)">
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

          <!-- Products -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-text-secondary mb-2">Comparing Products:</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="product in comparison.products"
                :key="product.id"
                class="inline-flex items-center px-3 py-1 rounded-md text-sm bg-primary-secondary text-text-primary"
              >
                {{ product.name }}
              </span>
            </div>
          </div>

          <!-- Metadata -->
          <div class="flex items-center gap-4 text-sm text-text-secondary">
            <span>{{ comparison.products?.length || 0 }} products</span>
            <span>•</span>
            <span>{{ comparison.viewCount || 0 }} views</span>
            <span>•</span>
            <span>Created {{ formatDate(comparison.createdAt) }}</span>
            <span v-if="comparison.updatedAt !== comparison.createdAt">
              • Updated {{ formatDate(comparison.updatedAt) }}
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
const comparisons = ref<any[]>([])

const stats = ref({
  total: 0,
  public: 0,
  private: 0,
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Fetch user's comparisons
onMounted(async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call once backend endpoint is ready
    // const data = await apiFetch('/api/comparisons?userId=' + authStore.user?.id)
    // comparisons.value = data.comparisons
    // calculateStats()

    // Placeholder for now
    comparisons.value = []
  } catch (error) {
    console.error('Failed to fetch comparisons:', error)
  } finally {
    loading.value = false
  }
})

const calculateStats = () => {
  stats.value.total = comparisons.value.length
  stats.value.public = comparisons.value.filter((c) => c.isPublic).length
  stats.value.private = comparisons.value.filter((c) => !c.isPublic).length
}

const editComparison = (comparison: any) => {
  // TODO: Implement edit functionality
  console.log('Edit comparison:', comparison.id)
}

const deleteComparison = async (comparison: any) => {
  if (!confirm('Are you sure you want to delete this comparison?')) return

  try {
    await apiFetch(`/api/comparisons/${comparison.id}`, { method: 'DELETE' })
    comparisons.value = comparisons.value.filter((c) => c.id !== comparison.id)
    calculateStats()
  } catch (error) {
    console.error('Failed to delete comparison:', error)
    alert('Failed to delete comparison. Please try again.')
  }
}
</script>
