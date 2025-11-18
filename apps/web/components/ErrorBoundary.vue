<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const error = ref<Error | null>(null)
const errorInfo = ref<string>('')

onErrorCaptured((err: Error, instance, info) => {
  error.value = err
  errorInfo.value = info
  console.error('Error captured:', err, info)

  // Prevent error from propagating
  return false
})

function reload() {
  window.location.reload()
}

function goHome() {
  window.location.href = '/'
}
</script>

<template>
  <div v-if="error" class="error-boundary">
    <div class="error-container">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>

      <h1 class="error-title">Oops! Something went wrong</h1>

      <p class="error-message">
        We encountered an unexpected error. Don't worry, our team has been notified.
      </p>

      <details v-if="error" class="error-details">
        <summary class="error-summary">Error details</summary>
        <div class="error-code">
          <div class="error-name">{{ error.name }}</div>
          <div class="error-text">{{ error.message }}</div>
          <div v-if="error.stack" class="error-stack">{{ error.stack }}</div>
        </div>
      </details>

      <div class="error-actions">
        <button class="btn btn-primary" @click="reload">
          Reload Page
        </button>
        <button class="btn btn-secondary" @click="goHome">
          Go to Homepage
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg-primary);
}

.error-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.error-icon {
  width: 80px;
  height: 80px;
  color: var(--accent-primary);
  margin: 0 auto 24px;
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.error-message {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 32px;
}

.error-details {
  text-align: left;
  margin-bottom: 32px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  overflow: hidden;
}

.error-summary {
  padding: 16px;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-primary);
  user-select: none;
}

.error-summary:hover {
  background: var(--bg-tertiary);
}

.error-code {
  padding: 16px;
  border-top: 1px solid var(--border-primary);
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
}

.error-name {
  color: var(--accent-primary);
  font-weight: 700;
  margin-bottom: 8px;
}

.error-text {
  color: var(--text-primary);
  margin-bottom: 12px;
}

.error-stack {
  color: var(--text-tertiary);
  font-size: 11px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

@media (max-width: 640px) {
  .error-actions {
    flex-direction: column;
  }

  .error-actions .btn {
    width: 100%;
  }
}
</style>
