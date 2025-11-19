<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Brand/Image -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent to-accent-secondary relative overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div class="absolute top-40 right-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-1/2 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center p-12 text-white">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 mb-12">
          <svg class="w-12 h-12" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="white"/>
            <g fill="#2383e2">
              <path d="M 35 30 Q 25 30 25 40 L 25 60 Q 25 70 35 70"
                    stroke="#2383e2" stroke-width="5" fill="none" stroke-linecap="round"/>
              <path d="M 65 30 Q 75 30 75 40 L 75 60 Q 75 70 65 70"
                    stroke="#2383e2" stroke-width="5" fill="none" stroke-linecap="round"/>
              <circle cx="42" cy="45" r="2.5"/>
              <circle cx="42" cy="55" r="2.5"/>
              <circle cx="58" cy="45" r="2.5"/>
              <circle cx="58" cy="55" r="2.5"/>
            </g>
          </svg>
          <span class="text-3xl font-bold">Comparo</span>
        </NuxtLink>

        <h1 class="text-5xl font-bold mb-6 leading-tight">
          Start Making Smarter Purchase Decisions
        </h1>
        <p class="text-xl opacity-90 mb-8">
          Join thousands of users who are already comparing products and saving money.
        </p>

        <!-- Benefits -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>100% free to use, no credit card required</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Save comparisons and wishlists</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Get personalized price alerts</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Share your reviews and comparisons</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Register Form -->
    <div class="flex-1 flex items-center justify-center p-8 bg-primary-primary overflow-y-auto">
      <div class="w-full max-w-md py-8">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex justify-center mb-8">
          <NuxtLink to="/" class="flex items-center gap-2">
            <svg class="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mobileLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#2383e2;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#1a6cbf;stop-opacity:1" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="url(#mobileLogo)"/>
              <g fill="white">
                <path d="M 35 30 Q 25 30 25 40 L 25 60 Q 25 70 35 70"
                      stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/>
                <path d="M 65 30 Q 75 30 75 40 L 75 60 Q 75 70 65 70"
                      stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/>
                <circle cx="42" cy="45" r="2.5"/>
                <circle cx="42" cy="55" r="2.5"/>
                <circle cx="58" cy="45" r="2.5"/>
                <circle cx="58" cy="55" r="2.5"/>
              </g>
            </svg>
            <span class="text-2xl font-bold text-text-primary">Comparo</span>
          </NuxtLink>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-text-primary mb-2">Create an account</h2>
          <p class="text-text-secondary">
            Start comparing products and making smarter decisions.
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 rounded-lg bg-error-light border border-error">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-error flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-error font-medium">{{ error }}</p>
          </div>
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-text-primary mb-2">
              Full name
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              autocomplete="name"
              class="w-full px-4 py-3 rounded-lg border border-border-primary bg-primary-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              placeholder="John Doe"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-text-primary mb-2">
              Email address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 rounded-lg border border-border-primary bg-primary-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-4 py-3 rounded-lg border border-border-primary bg-primary-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              placeholder="Create a strong password"
            />
            <p class="mt-1 text-xs text-text-tertiary">
              Must be at least 8 characters
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-text-primary mb-2">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-4 py-3 rounded-lg border border-border-primary bg-primary-secondary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              placeholder="Re-enter your password"
            />
          </div>

          <!-- Terms & Privacy -->
          <div class="flex items-start gap-2">
            <input
              v-model="acceptedTerms"
              type="checkbox"
              required
              class="mt-1 w-4 h-4 rounded border-border-primary text-accent focus:ring-accent focus:ring-2"
            />
            <label class="text-sm text-text-secondary">
              I agree to the
              <a href="#" class="text-accent hover:underline">Terms of Service</a>
              and
              <a href="#" class="text-accent hover:underline">Privacy Policy</a>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn btn-primary py-3 text-base font-semibold"
          >
            <span v-if="!isLoading">Create account</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border-primary"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-primary-primary text-text-tertiary">Or sign up with</span>
          </div>
        </div>

        <!-- Social Signup -->
        <div class="grid grid-cols-2 gap-3">
          <button type="button" class="btn btn-secondary py-3 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button type="button" class="btn btn-secondary py-3 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <!-- Sign In Link -->
        <p class="mt-8 text-center text-sm text-text-secondary">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-semibold text-accent hover:underline ml-1">
            Sign in
          </NuxtLink>
        </p>

        <!-- Back to Home -->
        <p class="mt-4 text-center">
          <NuxtLink to="/" class="text-sm text-text-tertiary hover:text-text-secondary transition-colors">
            ← Back to home
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: false,
})

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptedTerms = ref(false)
const error = ref('')
const isLoading = computed(() => authStore.isLoading)

const handleRegister = async () => {
  error.value = ''

  // Validation
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  if (!acceptedTerms.value) {
    error.value = 'Please accept the terms and conditions.'
    return
  }

  const result = await authStore.register(name.value, email.value, password.value)

  if (result.success) {
    // Redirect to home after successful registration
    router.push('/home')
  } else {
    error.value = result.error || 'Registration failed. Please try again.'
  }
}

// SEO
useHead({
  title: 'Sign Up - Comparo',
  meta: [
    {
      name: 'description',
      content: 'Create a free Comparo account to start comparing products, tracking prices, and making smarter purchase decisions.',
    },
  ],
})
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
