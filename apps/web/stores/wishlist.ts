import { defineStore } from 'pinia'

export interface WishlistProduct {
  id: string
  name: string
  brand: string
  currentPrice: number
  imageUrl: string | null
  slug: string
  addedAt: Date
}

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as WishlistProduct[],
    priceAlerts: new Map<string, number>(), // productId -> alertPrice
  }),

  getters: {
    itemCount: (state) => state.items.length,

    isInWishlist: (state) => {
      return (productId: string) => state.items.some(item => item.id === productId)
    },

    hasAlert: (state) => {
      return (productId: string) => state.priceAlerts.has(productId)
    },
  },

  actions: {
    addToWishlist(product: Omit<WishlistProduct, 'addedAt'>) {
      if (!this.isInWishlist(product.id)) {
        this.items.push({
          ...product,
          addedAt: new Date(),
        })
        this.saveToLocalStorage()
      }
    },

    removeFromWishlist(productId: string) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index !== -1) {
        this.items.splice(index, 1)
        this.priceAlerts.delete(productId)
        this.saveToLocalStorage()
      }
    },

    toggleWishlist(product: Omit<WishlistProduct, 'addedAt'>) {
      if (this.isInWishlist(product.id)) {
        this.removeFromWishlist(product.id)
      } else {
        this.addToWishlist(product)
      }
    },

    setPriceAlert(productId: string, targetPrice: number) {
      this.priceAlerts.set(productId, targetPrice)
      this.saveToLocalStorage()
    },

    removePriceAlert(productId: string) {
      this.priceAlerts.delete(productId)
      this.saveToLocalStorage()
    },

    checkPriceAlerts() {
      const alerts: Array<{ product: WishlistProduct; targetPrice: number; currentPrice: number }> = []

      this.items.forEach(item => {
        const targetPrice = this.priceAlerts.get(item.id)
        if (targetPrice && item.currentPrice <= targetPrice) {
          alerts.push({
            product: item,
            targetPrice,
            currentPrice: item.currentPrice,
          })
        }
      })

      return alerts
    },

    updateProductPrice(productId: string, newPrice: number) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.currentPrice = newPrice
        this.saveToLocalStorage()
      }
    },

    saveToLocalStorage() {
      if (typeof window !== 'undefined') {
        const data = {
          items: this.items,
          priceAlerts: Array.from(this.priceAlerts.entries()),
        }
        localStorage.setItem('comparo_wishlist', JSON.stringify(data))
      }
    },

    loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('comparo_wishlist')
        if (stored) {
          try {
            const data = JSON.parse(stored)
            this.items = data.items || []
            this.priceAlerts = new Map(data.priceAlerts || [])
          } catch (error) {
            console.error('Failed to load wishlist:', error)
          }
        }
      }
    },

    clearWishlist() {
      this.items = []
      this.priceAlerts.clear()
      this.saveToLocalStorage()
    },
  },
})
