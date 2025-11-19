<template>
  <div>
    <!-- Show password gate if not authenticated with app password -->
    <div v-if="!isAppAuthorized" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-primary via-primary-secondary to-primary-tertiary p-4">
      <div class="max-w-md w-full">
        <div class="card p-8">
          <!-- Logo -->
          <div class="flex items-center justify-center mb-6">
            <svg class="w-16 h-16" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gateLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#2383e2;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#1a6cbf;stop-opacity:1" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="url(#gateLogoGrad)"/>
              <g fill="white">
                <path d="M 35 30 Q 25 30 25 40 L 25 60 Q 25 70 35 70"
                      stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/>
                <path d="M 65 30 Q 75 30 75 40 L 75 60 Q 75 70 65 70"
                      stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/>
                <circle cx="42" cy="45" r="2.5" fill="white"/>
                <circle cx="42" cy="55" r="2.5" fill="white"/>
                <circle cx="58" cy="45" r="2.5" fill="white"/>
                <circle cx="58" cy="55" r="2.5" fill="white"/>
              </g>
            </svg>
          </div>

          <h1 class="text-2xl font-bold text-center text-text-primary mb-2">
            Welcome to Comparo
          </h1>
          <p class="text-center text-text-secondary mb-6">
            This application is currently in private beta. Please enter the access code to continue.
          </p>

          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 rounded-lg bg-error-light border border-error text-error text-sm">
            {{ error }}
          </div>

          <!-- Password Form -->
          <form @submit.prevent="handlePasswordSubmit">
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium mb-2 text-text-primary">
                Access Code
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-2 rounded-lg border border-border-primary bg-primary-secondary text-text-primary focus:outline-none focus:border-accent"
                placeholder="Enter access code"
                autocomplete="off"
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="loading"
            >
              <span v-if="!loading">Access Application</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            </button>
          </form>

          <!-- Info -->
          <div class="mt-6 p-4 rounded-lg bg-primary-tertiary border border-border-primary">
            <p class="text-xs text-text-tertiary text-center">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Don't have an access code? Contact the administrator.
            </p>
          </div>

          <!-- Development Hint (only show in dev mode) -->
          <div v-if="isDev" class="mt-4 p-3 rounded-lg bg-warning-light border border-warning">
            <p class="text-xs text-warning font-mono">
              DEV MODE: Default password is "comparo2024"
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Show landing page if app is authorized -->
    <Landing v-else />
  </div>
</template>

<script setup lang="ts">
import Landing from './landing.vue'

definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()
const password = ref('')
const error = ref('')
const loading = ref(false)

// Check if running in development mode
const isDev = computed(() => config.public.apiUrl?.includes('localhost'))

// Check if app is authorized
const isAppAuthorized = computed(() => {
  if (process.client) {
    return localStorage.getItem('app_authorized') === 'true'
  }
  return false
})

// Handle password submission
const handlePasswordSubmit = async () => {
  loading.value = true
  error.value = ''

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Default passwords (in production, this should be env variable)
  const validPasswords = [
    'comparo2024',
    'beta123',
    'preview2024',
  ]

  if (validPasswords.includes(password.value.trim())) {
    // Store authorization in localStorage
    if (process.client) {
      localStorage.setItem('app_authorized', 'true')
      // Force re-check
      window.location.reload()
    }
  } else {
    error.value = 'Invalid access code. Please try again.'
    password.value = ''
  }

  loading.value = false
}

// SEO
useHead({
  title: 'Comparo - Smart Product Comparisons',
  meta: [
    {
      name: 'description',
      content: 'Compare products side-by-side with intelligent highlighting, price tracking, and expert reviews.',
    },
  ],
})
</script>
