<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-primary via-primary-secondary to-primary-tertiary">
      <!-- Animated Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div class="absolute top-40 right-20 w-72 h-72 bg-accent-secondary rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-1/2 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div class="container-custom relative z-10 py-20 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Hero Content -->
          <div class="text-center lg:text-left">
            <!-- Beta Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6 animate-pulse-slow">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span class="text-sm font-medium text-accent">Now in Beta</span>
            </div>

            <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
              Make Smarter
              <span class="block bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
                Purchase Decisions
              </span>
            </h1>

            <p class="text-xl text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Compare products side-by-side with intelligent highlighting, price tracking, expert reviews, and community insights. Stop second-guessing your purchases.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <NuxtLink to="/auth/register" class="btn btn-primary btn-lg group">
                Get Started Free
                <svg class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </NuxtLink>
              <NuxtLink to="/home" class="btn btn-secondary btn-lg">
                Explore Products
              </NuxtLink>
            </div>

            <!-- Social Proof -->
            <div class="flex items-center gap-6 justify-center lg:justify-start text-sm text-text-tertiary">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>10K+ Products</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>25K+ Users</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Verified Reviews</span>
              </div>
            </div>
          </div>

          <!-- Hero Visual -->
          <div class="hidden lg:block">
            <div class="relative">
              <!-- Mock Comparison Cards -->
              <div class="grid grid-cols-2 gap-4">
                <div class="card p-4 transform -rotate-2 hover:rotate-0 transition-transform">
                  <div class="aspect-square bg-gradient-to-br from-accent/20 to-accent-secondary/20 rounded-lg mb-3"></div>
                  <div class="h-3 bg-text-primary/10 rounded mb-2"></div>
                  <div class="h-3 bg-text-primary/10 rounded w-2/3"></div>
                </div>
                <div class="card p-4 transform rotate-2 hover:rotate-0 transition-transform mt-8">
                  <div class="aspect-square bg-gradient-to-br from-accent-secondary/20 to-accent/20 rounded-lg mb-3"></div>
                  <div class="h-3 bg-text-primary/10 rounded mb-2"></div>
                  <div class="h-3 bg-text-primary/10 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-primary-secondary">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Everything You Need to Compare Products
          </h2>
          <p class="text-xl text-text-secondary max-w-3xl mx-auto">
            Powerful features designed to help you make confident purchasing decisions
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="group card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">Side-by-Side Comparisons</h3>
            <p class="text-text-secondary leading-relaxed">
              Compare up to 4 products at once with intelligent highlighting of key differences and similarities.
            </p>
          </div>

          <div class="group card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">Price Tracking & Alerts</h3>
            <p class="text-text-secondary leading-relaxed">
              Set price alerts on your wishlist and get notified when products hit your target price.
            </p>
          </div>

          <div class="group card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">Verified Reviews</h3>
            <p class="text-text-secondary leading-relaxed">
              Read authentic reviews from verified purchasers to get real insights from real users.
            </p>
          </div>

          <div class="group card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">Community Insights</h3>
            <p class="text-text-secondary leading-relaxed">
              Benefit from the collective wisdom of our community with ratings and shared comparisons.
            </p>
          </div>

          <div class="group card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">Advanced Filtering</h3>
            <p class="text-text-secondary leading-relaxed">
              Find exactly what you need with powerful filters for price, features, brands, and more.
            </p>
          </div>

          <div class="group card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">Smart Wishlists</h3>
            <p class="text-text-secondary leading-relaxed">
              Save products you're interested in and track their prices over time to get the best deals.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p class="text-xl text-text-secondary max-w-3xl mx-auto">
            Start comparing products in three simple steps
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-accent text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
              1
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">Search Products</h3>
            <p class="text-text-secondary">
              Find products you're interested in using our powerful search and filtering tools.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-accent text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
              2
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">Add to Compare</h3>
            <p class="text-text-secondary">
              Click "Add to Compare" on products you want to evaluate side-by-side.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-accent text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
              3
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-3">Make a Decision</h3>
            <p class="text-text-secondary">
              Review the intelligent comparison highlighting and make your choice with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br from-accent to-accent-secondary text-white">
      <div class="container-custom text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Ready to Make Smarter Decisions?
        </h2>
        <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of users who are already comparing products and saving money with Comparo.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register" class="btn bg-white text-accent hover:bg-gray-100 btn-lg">
            Create Free Account
          </NuxtLink>
          <NuxtLink to="/home" class="btn bg-transparent border-2 border-white text-white hover:bg-white/10 btn-lg">
            Browse Without Signing Up
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

// SEO
useHead({
  title: 'Comparo - Smart Product Comparisons Made Simple',
  meta: [
    {
      name: 'description',
      content: 'Compare products side-by-side with intelligent highlighting, price tracking, verified reviews, and community insights. Make smarter purchasing decisions with Comparo.',
    },
    {
      property: 'og:title',
      content: 'Comparo - Smart Product Comparisons Made Simple',
    },
    {
      property: 'og:description',
      content: 'Compare products side-by-side with intelligent highlighting, price tracking, verified reviews, and community insights.',
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

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.btn-lg {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
}
</style>
