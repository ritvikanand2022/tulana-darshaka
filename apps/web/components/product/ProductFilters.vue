<template>
  <div class="space-y-6">
    <!-- Category Filter -->
    <div v-if="categories.length">
      <h3 class="text-sm font-semibold text-text-primary mb-3">Category</h3>
      <div class="space-y-2">
        <label
          v-for="category in categories"
          :key="category.id"
          class="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors"
        >
          <input
            type="radio"
            :value="category.id"
            :checked="filters.categoryId === category.id"
            class="w-4 h-4 text-accent"
            @change="updateFilter('categoryId', category.id)"
          />
          <span class="text-sm">{{ category.name }}</span>
          <span class="text-xs text-text-tertiary ml-auto">({{ category._count?.products || 0 }})</span>
        </label>
        <button
          v-if="filters.categoryId"
          class="text-sm text-accent hover:underline"
          @click="updateFilter('categoryId', null)"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Brand Filter -->
    <div v-if="brands.length">
      <h3 class="text-sm font-semibold text-text-primary mb-3">Brand</h3>
      <div class="space-y-2">
        <label
          v-for="brand in brands"
          :key="brand"
          class="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors"
        >
          <input
            type="radio"
            :value="brand"
            :checked="filters.brand === brand"
            class="w-4 h-4 text-accent"
            @change="updateFilter('brand', brand)"
          />
          <span class="text-sm">{{ brand }}</span>
        </label>
        <button
          v-if="filters.brand"
          class="text-sm text-accent hover:underline"
          @click="updateFilter('brand', null)"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Price Range -->
    <div>
      <h3 class="text-sm font-semibold text-text-primary mb-3">Price Range</h3>
      <div class="space-y-3">
        <div>
          <label class="text-xs text-text-secondary">Min Price</label>
          <input
            type="number"
            :value="filters.minPrice"
            placeholder="$0"
            class="input w-full mt-1"
            @input="updateFilter('minPrice', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div>
          <label class="text-xs text-text-secondary">Max Price</label>
          <input
            type="number"
            :value="filters.maxPrice"
            placeholder="$10,000"
            class="input w-full mt-1"
            @input="updateFilter('maxPrice', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>

    <!-- Stock Status -->
    <div>
      <h3 class="text-sm font-semibold text-text-primary mb-3">Availability</h3>
      <div class="space-y-2">
        <label class="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
          <input
            type="checkbox"
            :checked="filters.stockStatus === 'IN_STOCK'"
            class="w-4 h-4 text-accent"
            @change="updateFilter('stockStatus', filters.stockStatus === 'IN_STOCK' ? null : 'IN_STOCK')"
          />
          <span class="text-sm">In Stock Only</span>
        </label>
      </div>
    </div>

    <!-- Clear All -->
    <button
      v-if="hasActiveFilters"
      class="btn btn-secondary w-full"
      @click="clearAll"
    >
      Clear All Filters
    </button>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: string
  name: string
  _count?: {
    products: number
  }
}

interface Filters {
  categoryId?: string | null
  brand?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  stockStatus?: string | null
}

const props = defineProps<{
  categories?: Category[]
  brands?: string[]
  filters: Filters
}>()

const emit = defineEmits<{
  'update:filters': [filters: Filters]
}>()

const categories = computed(() => props.categories || [])
const brands = computed(() => props.brands || [])

const hasActiveFilters = computed(() => {
  return !!(
    props.filters.categoryId ||
    props.filters.brand ||
    props.filters.minPrice ||
    props.filters.maxPrice ||
    props.filters.stockStatus
  )
})

const updateFilter = (key: keyof Filters, value: any) => {
  const newFilters = { ...props.filters }
  if (value === null || value === '' || value === undefined) {
    delete newFilters[key]
  } else {
    newFilters[key] = value
  }
  emit('update:filters', newFilters)
}

const clearAll = () => {
  emit('update:filters', {})
}
</script>
