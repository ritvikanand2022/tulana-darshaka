<template>
  <div class="relative">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="input w-full pl-10 pr-4"
        @input="handleSearch"
        @keydown.enter="handleSubmit"
      />
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <!-- Clear button -->
      <button
        v-if="searchQuery"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
        @click="clearSearch"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  debounce?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
}>()

const searchQuery = ref(props.modelValue || '')
let debounceTimeout: NodeJS.Timeout | null = null

watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue || ''
})

const handleSearch = () => {
  emit('update:modelValue', searchQuery.value)

  if (props.debounce) {
    if (debounceTimeout) clearTimeout(debounceTimeout)

    debounceTimeout = setTimeout(() => {
      emit('search', searchQuery.value)
    }, props.debounce)
  } else {
    emit('search', searchQuery.value)
  }
}

const handleSubmit = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
</script>
