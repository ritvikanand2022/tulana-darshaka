<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const config = useRuntimeConfig()

const isOpen = ref(false)
const query = ref('')
const suggestions = ref<any[]>([])
const selectedIndex = ref(-1)
const isLoading = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

let debounceTimeout: NodeJS.Timeout | null = null

// Watch query changes for autocomplete
watch(query, (newQuery) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  if (newQuery.length < 2) {
    suggestions.value = []
    return
  }

  debounceTimeout = setTimeout(() => {
    fetchSuggestions(newQuery)
  }, 300)
})

async function fetchSuggestions(searchQuery: string) {
  if (searchQuery.length < 2) return

  isLoading.value = true
  try {
    const data = await $fetch(`${config.public.apiUrl}/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=8`)
    suggestions.value = data.suggestions || []
  } catch (error) {
    console.error('Failed to fetch suggestions:', error)
    suggestions.value = []
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  if (!query.value.trim()) return

  // Save to search history
  saveToHistory(query.value)

  // Navigate to search results
  router.push(`/search?q=${encodeURIComponent(query.value)}`)

  // Close search
  close()
}

function selectSuggestion(suggestion: any) {
  saveToHistory(suggestion.text)
  router.push(suggestion.url)
  close()
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
        selectSuggestion(suggestions.value[selectedIndex.value])
      } else {
        handleSearch()
      }
      break
    case 'Escape':
      close()
      break
  }
}

function open() {
  isOpen.value = true
  setTimeout(() => {
    searchInput.value?.focus()
  }, 100)
}

function close() {
  isOpen.value = false
  query.value = ''
  suggestions.value = []
  selectedIndex.value = -1
}

function saveToHistory(searchQuery: string) {
  try {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    const newHistory = [searchQuery, ...history.filter((q: string) => q !== searchQuery)].slice(0, 10)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  } catch (error) {
    console.error('Failed to save search history:', error)
  }
}

// Keyboard shortcut (Cmd/Ctrl + K)
function handleGlobalKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
})

defineExpose({ open, close })
</script>

<template>
  <div class="global-search">
    <!-- Search Button -->
    <button class="search-button" @click="open">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span class="search-text">Search</span>
      <kbd class="shortcut">⌘K</kbd>
    </button>

    <!-- Search Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isOpen" class="modal-overlay" @click="close">
          <div class="modal-container" @click.stop>
            <div class="search-box">
              <!-- Input -->
              <div class="search-input-wrapper">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref="searchInput"
                  v-model="query"
                  type="text"
                  class="search-input"
                  placeholder="Search products, categories..."
                  @keydown="handleKeydown"
                  @input="selectedIndex = -1"
                />
                <button v-if="query" class="clear-button" @click="query = ''">
                  <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Loading -->
              <div v-if="isLoading" class="loading-indicator">
                <div class="spinner"></div>
                <span>Searching...</span>
              </div>

              <!-- Suggestions -->
              <div v-else-if="suggestions.length > 0" class="suggestions-list">
                <button
                  v-for="(suggestion, index) in suggestions"
                  :key="index"
                  class="suggestion-item"
                  :class="{ active: index === selectedIndex }"
                  @click="selectSuggestion(suggestion)"
                >
                  <div class="suggestion-icon">
                    <svg v-if="suggestion.type === 'product'" class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <svg v-else class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div class="suggestion-content">
                    <div class="suggestion-text">{{ suggestion.text }}</div>
                    <div v-if="suggestion.subtext" class="suggestion-subtext">{{ suggestion.subtext }}</div>
                  </div>
                  <div class="suggestion-type">
                    {{ suggestion.type }}
                  </div>
                </button>
              </div>

              <!-- Empty state -->
              <div v-else-if="query.length >= 2" class="empty-state">
                <svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No results found for "{{ query }}"</p>
              </div>

              <!-- Footer -->
              <div class="search-footer">
                <div class="footer-shortcuts">
                  <span class="shortcut-hint">
                    <kbd>↑</kbd><kbd>↓</kbd> Navigate
                  </span>
                  <span class="shortcut-hint">
                    <kbd>↵</kbd> Select
                  </span>
                  <span class="shortcut-hint">
                    <kbd>ESC</kbd> Close
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.global-search {
  position: relative;
}

.search-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
}

.search-button:hover {
  border-color: var(--accent-primary);
  color: var(--text-primary);
}

.search-button .icon {
  width: 18px;
  height: 18px;
}

.search-text {
  flex: 1;
  text-align: left;
  font-size: 14px;
}

.shortcut {
  padding: 2px 6px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  z-index: 1000;
}

.modal-container {
  width: 90%;
  max-width: 600px;
}

.search-box {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border-primary);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  font-size: 16px;
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.clear-button {
  padding: 4px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 32px;
  color: var(--text-secondary);
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-primary);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.suggestions-list {
  max-height: 400px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid var(--border-primary);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.active {
  background: var(--bg-secondary);
}

.suggestion-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--bg-secondary);
  border-radius: 6px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.suggestion-item.active .suggestion-icon {
  background: var(--accent-primary);
  color: white;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.suggestion-text {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-subtext {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-type {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  color: var(--text-secondary);
}

.empty-state .icon-lg {
  width: 48px;
  height: 48px;
  color: var(--text-tertiary);
}

.search-footer {
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
}

.footer-shortcuts {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.shortcut-hint {
  display: flex;
  align-items: center;
  gap: 4px;
}

.shortcut-hint kbd {
  padding: 2px 6px;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 3px;
  font-family: monospace;
  font-size: 11px;
}

.icon-sm {
  width: 16px;
  height: 16px;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .search-box {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .search-button {
    min-width: auto;
  }

  .search-text,
  .shortcut {
    display: none;
  }

  .modal-overlay {
    padding-top: 10vh;
  }

  .modal-container {
    width: 95%;
  }

  .footer-shortcuts {
    flex-wrap: wrap;
  }
}
</style>
