<template>
  <button
    @click.prevent="toggleWishlist"
    class="btn btn-ghost btn-icon"
    :class="{ 'text-error': isInWishlist }"
    :title="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
    :aria-label="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
  >
    <svg
      class="w-5 h-5 transition-all duration-200"
      :class="{ 'fill-error': isInWishlist }"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useWishlistStore } from '~/stores/wishlist'

interface Props {
  productId: string
  productName: string
  productBrand: string
  currentPrice: number
  imageUrl: string | null
  slug: string
}

const props = defineProps<Props>()

const wishlistStore = useWishlistStore()

const isInWishlist = computed(() => {
  return wishlistStore.isInWishlist(props.productId)
})

const toggleWishlist = () => {
  wishlistStore.toggleWishlist({
    id: props.productId,
    name: props.productName,
    brand: props.productBrand,
    currentPrice: props.currentPrice,
    imageUrl: props.imageUrl,
    slug: props.slug,
  })
}

// Load wishlist from localStorage on mount
onMounted(() => {
  wishlistStore.loadFromLocalStorage()
})
</script>
