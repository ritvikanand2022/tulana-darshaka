import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  username: string | null
  name: string | null
  avatar: string | null
  role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'
  emailVerified: boolean
  reputation: number
  badges: string[]
  createdAt: string
  updatedAt: string
}

// Mock users for demo mode
const MOCK_USERS = {
  'demo@comparo.com': {
    password: 'demo123',
    user: {
      id: 'demo-user-1',
      email: 'demo@comparo.com',
      username: 'demo_user',
      name: 'Demo User',
      avatar: null,
      role: 'USER' as const,
      emailVerified: true,
      reputation: 150,
      badges: ['early_adopter', 'verified_reviewer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  'john@example.com': {
    password: 'password123',
    user: {
      id: 'demo-user-2',
      email: 'john@example.com',
      username: 'john_doe',
      name: 'John Doe',
      avatar: null,
      role: 'USER' as const,
      emailVerified: true,
      reputation: 85,
      badges: ['helpful_reviewer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  'admin@comparo.com': {
    password: 'admin123',
    user: {
      id: 'demo-admin-1',
      email: 'admin@comparo.com',
      username: 'admin',
      name: 'Admin User',
      avatar: null,
      role: 'ADMIN' as const,
      emailVerified: true,
      reputation: 500,
      badges: ['admin', 'moderator', 'expert_reviewer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN' || state.user?.role === 'SUPER_ADMIN',
    isModerator: (state) =>
      state.user?.role === 'MODERATOR' ||
      state.user?.role === 'ADMIN' ||
      state.user?.role === 'SUPER_ADMIN',
    userInitials: (state) => {
      if (!state.user) return ''
      if (state.user.name) {
        const names = state.user.name.split(' ')
        if (names.length >= 2) {
          return `${names[0][0]}${names[1][0]}`.toUpperCase()
        }
        return names[0][0].toUpperCase()
      }
      if (state.user.username) {
        return state.user.username.substring(0, 2).toUpperCase()
      }
      return state.user.email.substring(0, 2).toUpperCase()
    },
    displayName: (state) => {
      if (!state.user) return ''
      return state.user.name || state.user.username || state.user.email
    },
  },

  actions: {
    // Check if we should use demo mode (when API is unavailable or using demo credentials)
    isDemoMode(email: string): boolean {
      return email in MOCK_USERS
    },

    async register(email: string, password: string, name?: string, username?: string) {
      this.isLoading = true
      try {
        // Demo mode: Create a mock user
        if (this.isDemoMode(email) || email.includes('@demo.') || email.includes('@example.')) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800))

          const mockUser: User = {
            id: `demo-${Date.now()}`,
            email,
            username: username || email.split('@')[0],
            name: name || 'Demo User',
            avatar: null,
            role: 'USER',
            emailVerified: true,
            reputation: 0,
            badges: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          const mockAccessToken = `demo-access-token-${Date.now()}`
          const mockRefreshToken = `demo-refresh-token-${Date.now()}`

          this.setAuthData(mockUser, mockAccessToken, mockRefreshToken)
          return { success: true, user: mockUser }
        }

        // Real API call
        const config = useRuntimeConfig()
        const response = await $fetch<{ user: User; accessToken: string; refreshToken: string }>(
          `${config.public.apiUrl}/api/auth/register`,
          {
            method: 'POST',
            body: {
              email,
              password,
              name,
              username,
            },
          }
        )

        this.setAuthData(response.user, response.accessToken, response.refreshToken)
        return { success: true, user: response.user }
      } catch (error: any) {
        console.error('Registration error:', error)

        // Fallback to demo mode if API is unavailable
        if (error.cause?.code === 'ECONNREFUSED' || error.status === 503) {
          console.log('API unavailable, using demo mode')

          const mockUser: User = {
            id: `demo-${Date.now()}`,
            email,
            username: username || email.split('@')[0],
            name: name || 'Demo User',
            avatar: null,
            role: 'USER',
            emailVerified: true,
            reputation: 0,
            badges: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          const mockAccessToken = `demo-access-token-${Date.now()}`
          const mockRefreshToken = `demo-refresh-token-${Date.now()}`

          this.setAuthData(mockUser, mockAccessToken, mockRefreshToken)
          return { success: true, user: mockUser }
        }

        return {
          success: false,
          error: error.data?.message || 'Registration failed. Please try again.',
        }
      } finally {
        this.isLoading = false
      }
    },

    async login(email: string, password: string) {
      this.isLoading = true
      try {
        // Demo mode: Check mock users
        if (this.isDemoMode(email)) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800))

          const mockAccount = MOCK_USERS[email as keyof typeof MOCK_USERS]

          if (mockAccount.password === password) {
            const mockAccessToken = `demo-access-token-${Date.now()}`
            const mockRefreshToken = `demo-refresh-token-${Date.now()}`

            this.setAuthData(mockAccount.user, mockAccessToken, mockRefreshToken)
            return { success: true, user: mockAccount.user }
          } else {
            return {
              success: false,
              error: 'Invalid email or password.',
            }
          }
        }

        // Real API call
        const config = useRuntimeConfig()
        const response = await $fetch<{ user: User; accessToken: string; refreshToken: string }>(
          `${config.public.apiUrl}/api/auth/login`,
          {
            method: 'POST',
            body: {
              email,
              password,
            },
          }
        )

        this.setAuthData(response.user, response.accessToken, response.refreshToken)
        return { success: true, user: response.user }
      } catch (error: any) {
        console.error('Login error:', error)

        // Fallback to demo mode if API is unavailable
        if (error.cause?.code === 'ECONNREFUSED' || error.status === 503) {
          console.log('API unavailable, using demo credentials')

          // Try demo@comparo.com as fallback
          if (email === 'demo@comparo.com' || email.includes('@demo.') || email.includes('@example.')) {
            const mockUser: User = {
              id: `demo-${Date.now()}`,
              email,
              username: email.split('@')[0],
              name: 'Demo User',
              avatar: null,
              role: 'USER',
              emailVerified: true,
              reputation: 100,
              badges: ['demo_user'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            const mockAccessToken = `demo-access-token-${Date.now()}`
            const mockRefreshToken = `demo-refresh-token-${Date.now()}`

            this.setAuthData(mockUser, mockAccessToken, mockRefreshToken)
            return { success: true, user: mockUser }
          }
        }

        return {
          success: false,
          error: error.data?.message || 'Invalid email or password.',
        }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        // Skip API call in demo mode
        if (this.accessToken && !this.accessToken.startsWith('demo-')) {
          const config = useRuntimeConfig()

          // Call logout endpoint to invalidate refresh tokens
          await $fetch(`${config.public.apiUrl}/api/auth/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          })
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear local state regardless of API call success
        this.clearAuthData()
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.clearAuthData()
        return false
      }

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ accessToken: string; refreshToken: string }>(
          `${config.public.apiUrl}/api/auth/refresh`,
          {
            method: 'POST',
            body: {
              refreshToken: this.refreshToken,
            },
          }
        )

        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken

        // Store tokens in localStorage
        if (process.client) {
          localStorage.setItem('accessToken', response.accessToken)
          localStorage.setItem('refreshToken', response.refreshToken)
        }

        return true
      } catch (error) {
        console.error('Token refresh error:', error)
        this.clearAuthData()
        return false
      }
    },

    async fetchCurrentUser(): Promise<boolean> {
      if (!this.accessToken) {
        return false
      }

      // Demo mode: if token starts with 'demo-', skip API call
      if (this.accessToken.startsWith('demo-')) {
        // User is already set in demo mode, just confirm authentication
        if (this.user) {
          this.isAuthenticated = true
          return true
        }
        return false
      }

      this.isLoading = true
      try {
        const config = useRuntimeConfig()
        const user = await $fetch<User>(`${config.public.apiUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })

        this.user = user
        this.isAuthenticated = true
        return true
      } catch (error: any) {
        console.error('Fetch user error:', error)

        // If 401, try to refresh token
        if (error.status === 401) {
          const refreshed = await this.refreshAccessToken()
          if (refreshed) {
            // Try fetching user again
            return this.fetchCurrentUser()
          }
        }

        this.clearAuthData()
        return false
      } finally {
        this.isLoading = false
      }
    },

    setAuthData(user: User, accessToken: string, refreshToken: string) {
      this.user = user
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.isAuthenticated = true

      // Store tokens in localStorage
      if (process.client) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
      }
    },

    clearAuthData() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false

      // Clear tokens from localStorage
      if (process.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    },

    async initializeAuth() {
      // Load tokens from localStorage
      if (process.client) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        if (accessToken && refreshToken) {
          this.accessToken = accessToken
          this.refreshToken = refreshToken

          // Fetch current user to validate token
          await this.fetchCurrentUser()
        }
      }
    },
  },
})
