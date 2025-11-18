<template>
  <div class="relative" ref="dropdownRef">
    <!-- User Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary-secondary transition-colors"
      aria-label="User menu"
    >
      <!-- Avatar -->
      <div
        class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium"
      >
        {{ userInitials }}
      </div>

      <!-- User name (desktop only) -->
      <span class="hidden md:inline text-text-primary text-sm font-medium">
        {{ displayName }}
      </span>

      <!-- Dropdown icon -->
      <svg
        class="w-4 h-4 text-text-secondary transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-primary border border-border py-1 z-50"
      >
        <!-- User Info -->
        <div class="px-4 py-3 border-b border-border">
          <p class="text-sm font-medium text-text-primary">{{ displayName }}</p>
          <p class="text-xs text-text-secondary truncate">{{ authStore.user?.email }}</p>
          <div v-if="authStore.user?.role !== 'USER'" class="mt-1">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              :class="{
                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200':
                  authStore.user?.role === 'ADMIN' || authStore.user?.role === 'SUPER_ADMIN',
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                  authStore.user?.role === 'MODERATOR',
              }"
            >
              {{ authStore.user?.role }}
            </span>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <NuxtLink
            to="/profile"
            class="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-primary-secondary hover:text-text-primary transition-colors"
            @click="isOpen = false"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Your Profile
          </NuxtLink>

          <NuxtLink
            to="/reviews/my-reviews"
            class="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-primary-secondary hover:text-text-primary transition-colors"
            @click="isOpen = false"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            My Reviews
          </NuxtLink>

          <NuxtLink
            to="/comparisons/my-comparisons"
            class="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-primary-secondary hover:text-text-primary transition-colors"
            @click="isOpen = false"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            My Comparisons
          </NuxtLink>

          <NuxtLink
            to="/settings"
            class="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-primary-secondary hover:text-text-primary transition-colors"
            @click="isOpen = false"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </NuxtLink>
        </div>

        <!-- Admin Links (if admin/moderator) -->
        <div v-if="authStore.isModerator" class="border-t border-border py-1">
          <NuxtLink
            to="/admin/products"
            class="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-primary-secondary hover:text-text-primary transition-colors"
            @click="isOpen = false"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Manage Products
          </NuxtLink>
        </div>

        <!-- Logout -->
        <div class="border-t border-border py-1">
          <button
            @click="handleLogout"
            class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const authStore = useAuthStore()
const router = useRouter()

const isOpen = ref(false)
const dropdownRef = ref(null)

// Close dropdown when clicking outside
onClickOutside(dropdownRef, () => {
  isOpen.value = false
})

// Computed properties
const userInitials = computed(() => authStore.userInitials)
const displayName = computed(() => authStore.displayName)

const handleLogout = async () => {
  isOpen.value = false
  await authStore.logout()
  router.push('/auth/login')
}
</script>
