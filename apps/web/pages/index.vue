<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="container-custom py-20">
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-display mb-6 animate-slide-up">
          Compare Products.
          <span class="text-accent">Make Smart Choices.</span>
        </h1>
        <p class="text-xl text-text-secondary mb-8 animate-slide-up" style="animation-delay: 100ms">
          Side-by-side product comparisons with price tracking, expert reviews, and community insights.
        </p>
        <div class="flex gap-4 justify-center animate-slide-up" style="animation-delay: 200ms">
          <button class="btn btn-primary">
            Start Comparing
          </button>
          <button class="btn btn-secondary">
            Browse Products
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container-custom py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(feature, idx) in features"
          :key="feature.title"
          class="card p-6 animate-slide-up"
          :style="`animation-delay: ${idx * 100}ms`"
        >
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-h3 mb-2">{{ feature.title }}</h3>
          <p class="text-text-secondary">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-primary-secondary py-16 mt-16">
      <div class="container-custom">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-h1 text-accent mb-2">{{ stat.value }}</div>
            <div class="text-text-secondary">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const features = [
  {
    icon: '⚡',
    title: 'Smart Comparisons',
    description: 'Compare products side-by-side with intelligent highlighting of key differences.'
  },
  {
    icon: '📊',
    title: 'Price Tracking',
    description: 'Track historical prices and get alerts when prices drop on your favorite products.'
  },
  {
    icon: '⭐',
    title: 'Expert Reviews',
    description: 'Read detailed reviews from experts and real users to make informed decisions.'
  },
]

const stats = [
  { value: '10,000+', label: 'Products' },
  { value: '50,000+', label: 'Comparisons' },
  { value: '5,000+', label: 'Reviews' },
  { value: '100%', label: 'Free' },
]
</script>
