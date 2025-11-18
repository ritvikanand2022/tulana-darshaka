/**
 * Composable for making authenticated API requests
 * Automatically adds auth headers and handles token refresh
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiBaseUrl = config.public.apiUrl

  /**
   * Make an authenticated API request
   * Automatically retries with refreshed token if 401
   */
  const apiFetch = async <T>(
    endpoint: string,
    options: any = {}
  ): Promise<T> => {
    const { skipAuth, ...fetchOptions } = options

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers || {}),
    }

    // Add auth token if available and not skipped
    if (!skipAuth && authStore.accessToken) {
      headers['Authorization'] = `Bearer ${authStore.accessToken}`
    }

    try {
      const response = await $fetch<T>(`${apiBaseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
      })

      return response
    } catch (error: any) {
      // If 401 and we have a refresh token, try to refresh and retry
      if (error.status === 401 && !skipAuth && authStore.refreshToken) {
        const refreshed = await authStore.refreshAccessToken()

        if (refreshed) {
          // Retry the request with new token
          headers['Authorization'] = `Bearer ${authStore.accessToken}`
          return await $fetch<T>(`${apiBaseUrl}${endpoint}`, {
            ...fetchOptions,
            headers,
          })
        }
      }

      throw error
    }
  }

  return {
    apiFetch,
    apiBaseUrl,
  }
}
