<template>
  <div class="container-custom py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-text-primary">Edit Profile</h1>
        <p class="text-text-secondary mt-1">Update your personal information and preferences</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Profile Picture -->
        <div class="bg-primary border border-border rounded-lg p-6">
          <h2 class="text-lg font-semibold text-text-primary mb-4">Profile Picture</h2>
          <div class="flex items-center gap-6">
            <div
              class="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold"
            >
              {{ authStore.userInitials }}
            </div>
            <div>
              <button type="button" class="btn btn-secondary mb-2" disabled>
                Change Avatar
              </button>
              <p class="text-sm text-text-secondary">Avatar upload coming soon</p>
            </div>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="bg-primary border border-border rounded-lg p-6">
          <h2 class="text-lg font-semibold text-text-primary mb-4">Basic Information</h2>
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-text-primary mb-2">
                Full Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="w-full px-4 py-2 bg-primary-secondary border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label for="username" class="block text-sm font-medium text-text-primary mb-2">
                Username
              </label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                class="w-full px-4 py-2 bg-primary-secondary border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Choose a username"
              />
              <p class="mt-1 text-sm text-text-secondary">
                Your username will be visible to other users
              </p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                disabled
                class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-border rounded-md text-text-secondary cursor-not-allowed"
              />
              <p class="mt-1 text-sm text-text-secondary">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800 dark:text-green-200">
                Profile updated successfully!
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between">
          <NuxtLink to="/profile" class="btn btn-ghost">Cancel</NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  name: authStore.user?.name || '',
  username: authStore.user?.username || '',
  email: authStore.user?.email || '',
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  error.value = ''
  success.value = false
  loading.value = true

  try {
    // TODO: Implement profile update API call
    // const { apiFetch } = useApi()
    // await apiFetch('/api/users/me', {
    //   method: 'PATCH',
    //   body: JSON.stringify({
    //     name: form.value.name,
    //     username: form.value.username,
    //   }),
    // })

    // For now, just show success message
    // In production, this would update the user in the auth store
    success.value = true

    // Redirect after successful update
    setTimeout(() => {
      router.push('/profile')
    }, 1500)
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to update profile. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
