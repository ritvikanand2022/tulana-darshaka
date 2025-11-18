import { defineStore } from 'pinia'

interface Product {
  id: string
  name: string
  brand: string
  slug: string
  price: number
  images?: Array<{ url: string; alt?: string }>
  specifications?: Record<string, any>
  category?: { name: string }
}

export const useComparisonStore = defineStore('comparison', {
  state: () => ({
    products: [] as Product[],
    maxProducts: 6,
  }),

  getters: {
    count: (state) => state.products.length,
    isFull: (state) => state.products.length >= state.maxProducts,
    isEmpty: (state) => state.products.length === 0,
    productIds: (state) => state.products.map((p) => p.id),

    isProductInComparison: (state) => (productId: string) => {
      return state.products.some((p) => p.id === productId)
    },
  },

  actions: {
    addProduct(product: Product) {
      if (this.isFull) {
        return {
          success: false,
          message: `You can only compare up to ${this.maxProducts} products`,
        }
      }

      if (this.isProductInComparison(product.id)) {
        return {
          success: false,
          message: 'Product already in comparison',
        }
      }

      this.products.push(product)
      this.saveToLocalStorage()

      return {
        success: true,
        message: 'Product added to comparison',
      }
    },

    removeProduct(productId: string) {
      const index = this.products.findIndex((p) => p.id === productId)
      if (index !== -1) {
        this.products.splice(index, 1)
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    toggleProduct(product: Product) {
      if (this.isProductInComparison(product.id)) {
        this.removeProduct(product.id)
        return { added: false, success: true, message: 'Product removed from comparison' }
      } else {
        const result = this.addProduct(product)
        return { added: result.success, ...result }
      }
    },

    clearAll() {
      this.products = []
      this.saveToLocalStorage()
    },

    reorderProducts(fromIndex: number, toIndex: number) {
      const product = this.products.splice(fromIndex, 1)[0]
      this.products.splice(toIndex, 0, product)
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('comparison-products', JSON.stringify(this.products))
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const stored = localStorage.getItem('comparison-products')
        if (stored) {
          try {
            this.products = JSON.parse(stored)
          } catch (error) {
            console.error('Error loading comparison from localStorage:', error)
            this.products = []
          }
        }
      }
    },

    async saveComparison(title?: string, isPublic = true) {
      if (this.products.length < 2) {
        throw new Error('You need at least 2 products to create a comparison')
      }

      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.apiUrl}/api/comparisons`, {
        method: 'POST',
        body: {
          title,
          productIds: this.productIds,
          isPublic,
        },
      })

      return response
    },
  },
})
