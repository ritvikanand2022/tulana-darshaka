/**
 * Client-side plugin to initialize authentication
 * Loads user from localStorage if tokens exist
 */
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  // Initialize auth from localStorage on client side only
  if (process.client) {
    await authStore.initializeAuth()
  }
})
