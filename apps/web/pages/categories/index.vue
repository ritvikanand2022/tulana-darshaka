<template>
  <div class="min-h-screen py-8">
    <div class="container-custom">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-h1 mb-2">Product Categories</h1>
        <p class="text-text-secondary">
          Browse products by category to find exactly what you're looking for
        </p>
      </div>

      <!-- Search -->
      <div class="mb-8 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search categories..."
          class="w-full px-4 py-2 rounded-lg border border-border-primary bg-primary-secondary text-text-primary focus:outline-none focus:border-accent"
        />
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="card h-48 animate-pulse bg-primary-secondary"
        />
      </div>

      <!-- Categories Grid -->
      <div
        v-else-if="filteredCategories.length"
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <NuxtLink
          v-for="category in filteredCategories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="card group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
        >
          <!-- Category Image/Icon -->
          <div class="aspect-video bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            <svg class="w-16 h-16 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>

          <!-- Category Info -->
          <div class="p-6">
            <h3 class="text-h4 mb-2 group-hover:text-accent transition-colors">
              {{ category.name }}
            </h3>
            <p v-if="category.description" class="text-text-secondary text-sm mb-4 line-clamp-2">
              {{ category.description }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-text-tertiary">
                {{ category._count?.products || 0 }} products
              </span>
              <svg class="w-5 h-5 text-accent transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <h3 class="text-h3 mb-2">No categories found</h3>
        <p class="text-text-secondary mb-4">
          {{ searchQuery ? 'Try a different search query' : 'Categories will appear here' }}
        </p>
        <button v-if="searchQuery" class="btn btn-primary" @click="searchQuery = ''">
          Clear Search
        </button>
      </div>

      <!-- Popular Categories -->
      <div v-if="popularCategories.length && !searchQuery" class="mt-12">
        <h2 class="text-h2 mb-6">Popular Categories</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="category in popularCategories"
            :key="category.id"
            :to="`/categories/${category.slug}`"
            class="card p-4 text-center hover:shadow-md transition-all group"
          >
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div class="font-medium text-sm text-text-primary group-hover:text-accent transition-colors">
              {{ category.name }}
            </div>
            <div class="text-xs text-text-tertiary mt-1">
              {{ category._count?.products || 0 }} items
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  _count?: {
    products: number
  }
}

definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()
const searchQuery = ref('')

// Fetch categories
const { data: categoriesData, pending } = await useFetch<{ categories: Category[] }>(
  `${config.public.apiUrl}/api/categories`,
  {
    default: () => ({ categories: [] }),
  }
)

const categories = computed(() => categoriesData.value?.categories || [])

// Filtered categories based on search
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value

  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(query) ||
    category.description?.toLowerCase().includes(query)
  )
})

// Popular categories (top 8 by product count)
const popularCategories = computed(() => {
  return [...categories.value]
    .sort((a, b) => (b._count?.products || 0) - (a._count?.products || 0))
    .slice(0, 8)
})

// SEO
useHead({
  title: 'Categories - Comparo',
  meta: [
    {
      name: 'description',
      content: 'Browse products by category. Find exactly what you\'re looking for with Comparo\'s organized product categories.',
    },
  ],
})
</script>
