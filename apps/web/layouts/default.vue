<template>
  <div class="min-h-screen bg-primary">
    <!-- Top Bar -->
    <header class="sticky top-0 z-50 bg-primary/95 backdrop-blur-custom border-b border-border">
      <nav class="container-custom">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="text-2xl font-bold text-accent">Tulana</div>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="text-text-secondary hover:text-text-primary transition-colors"
            >
              {{ item.name }}
            </NuxtLink>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-3">
            <!-- Global Search -->
            <div class="hidden md:block">
              <GlobalSearch ref="globalSearch" />
            </div>

            <!-- Theme Toggle -->
            <button
              class="btn btn-ghost btn-icon"
              @click="toggleTheme"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            <!-- Auth State -->
            <div v-if="authStore.isAuthenticated" class="hidden md:block">
              <LayoutUserDropdown />
            </div>
            <NuxtLink v-else to="/auth/login" class="btn btn-secondary hidden md:inline-flex">
              Sign In
            </NuxtLink>

            <!-- Mobile Menu Button -->
            <button
              class="btn btn-ghost btn-icon md:hidden"
              @click="mobileMenuOpen = !mobileMenuOpen"
              aria-label="Menu"
            >
              <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-divider">
            <div class="flex flex-col gap-2">
              <!-- Mobile Search -->
              <button
                class="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-primary-secondary rounded-md transition-colors flex items-center gap-2"
                @click="openSearch"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              <NuxtLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-primary-secondary rounded-md transition-colors"
                @click="mobileMenuOpen = false"
              >
                {{ item.name }}
              </NuxtLink>
              <!-- Mobile Auth -->
              <div v-if="authStore.isAuthenticated" class="mt-2 px-4 py-3 bg-primary-secondary rounded-md">
                <p class="text-sm font-medium text-text-primary">{{ authStore.displayName }}</p>
                <p class="text-xs text-text-secondary truncate">{{ authStore.user?.email }}</p>
                <div class="flex gap-2 mt-3">
                  <NuxtLink to="/profile" class="btn btn-secondary flex-1" @click="mobileMenuOpen = false">
                    Profile
                  </NuxtLink>
                  <button @click="handleMobileLogout" class="btn btn-ghost flex-1">
                    Sign Out
                  </button>
                </div>
              </div>
              <NuxtLink v-else to="/auth/login" class="btn btn-secondary mt-2" @click="mobileMenuOpen = false">
                Sign In
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-primary-secondary border-t border-border mt-20">
      <div class="container-custom py-12">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="md:col-span-1">
            <div class="text-xl font-bold text-accent mb-3">Tulana Darshaka</div>
            <p class="text-sm text-text-secondary">
              Smart product comparisons to help you make informed purchasing decisions.
            </p>
          </div>

          <!-- Links -->
          <div v-for="section in footerSections" :key="section.title" class="md:col-span-1">
            <h3 class="font-semibold mb-3 text-text-primary">{{ section.title }}</h3>
            <ul class="space-y-2">
              <li v-for="link in section.links" :key="link.name">
                <NuxtLink :to="link.href" class="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-divider flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-text-secondary">
            © {{ new Date().getFullYear() }} Tulana Darshaka. All rights reserved.
          </p>
          <div class="flex gap-4">
            <a href="#" class="text-text-secondary hover:text-text-primary transition-colors">
              Privacy
            </a>
            <a href="#" class="text-text-secondary hover:text-text-primary transition-colors">
              Terms
            </a>
            <a href="#" class="text-text-secondary hover:text-text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Comparison Bar (Fixed at bottom) -->
    <ComparisonBar />
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
const authStore = useAuthStore()
const router = useRouter()

const mobileMenuOpen = ref(false)
const globalSearch = ref<any>(null)

function openSearch() {
  mobileMenuOpen.value = false
  setTimeout(() => {
    globalSearch.value?.open()
  }, 100)
}

async function handleMobileLogout() {
  mobileMenuOpen.value = false
  await authStore.logout()
  router.push('/auth/login')
}

const navigation = [
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'Comparisons', href: '/comparisons' },
  { name: 'Reviews', href: '/reviews' },
]

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'Browse Products', href: '/products' },
      { name: 'Categories', href: '/categories' },
      { name: 'New Arrivals', href: '/new' },
      { name: 'Best Deals', href: '/deals' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Buying Guides', href: '/guides' },
      { name: 'Expert Reviews', href: '/expert-reviews' },
      { name: 'Blog', href: '/blog' },
      { name: 'FAQ', href: '/faq' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'Advertise', href: '/advertise' },
    ]
  },
]
</script>
