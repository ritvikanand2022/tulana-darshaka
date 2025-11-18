<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Set up global meta tags
useHead({
  htmlAttrs: {
    lang: 'en',
  },
})

// Initialize theme on mount
onMounted(() => {
  const { initTheme } = useTheme()
  initTheme()
})
</script>
