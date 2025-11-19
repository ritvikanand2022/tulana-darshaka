<template>
  <div class="auth-prompt">
    <div class="auth-prompt-content">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <div class="text-content">
        <h3 class="title">{{ title }}</h3>
        <p class="description">{{ description }}</p>
      </div>
    </div>
    <div class="auth-prompt-actions">
      <NuxtLink :to="`/auth/login?redirect=${redirectUrl}`" class="btn btn-primary">
        Sign In
      </NuxtLink>
      <NuxtLink to="/auth/register" class="btn btn-secondary">
        Create Account
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Sign in required',
    description: 'Please sign in to continue with this action.',
  }
)

const route = useRoute()
const redirectUrl = computed(() => route.fullPath)
</script>

<style scoped>
.auth-prompt {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.auth-prompt-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  color: var(--accent-primary);
}

.text-content {
  flex: 1;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.auth-prompt-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

@media (max-width: 640px) {
  .auth-prompt-content {
    flex-direction: column;
  }

  .auth-prompt-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
