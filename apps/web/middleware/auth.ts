/**
 * Authentication middleware
 * Protects routes that require user to be logged in
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // If tokens exist but user not loaded, try to fetch user
  if (!authStore.isAuthenticated && process.client) {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (accessToken && refreshToken) {
      authStore.accessToken = accessToken
      authStore.refreshToken = refreshToken
      await authStore.fetchCurrentUser()
    }
  }

  // If still not authenticated, redirect to signup
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/auth/register',
      query: { redirect: to.fullPath },
    })
  }
})
