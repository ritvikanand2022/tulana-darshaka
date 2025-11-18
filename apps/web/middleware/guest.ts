/**
 * Guest middleware
 * Redirects authenticated users away from auth pages (login/register)
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // If already authenticated, redirect to home
  if (authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
