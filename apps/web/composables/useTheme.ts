import { ref, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

export const useTheme = () => {
  const theme = ref<Theme>('system')
  const isDark = ref(false)

  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme') as Theme | null
      theme.value = savedTheme || 'system'
      applyTheme(theme.value)
    }
  }

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (!process.client) return

    let shouldBeDark = false

    if (newTheme === 'system') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      shouldBeDark = newTheme === 'dark'
    }

    isDark.value = shouldBeDark

    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Set theme
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    if (process.client) {
      localStorage.setItem('theme', newTheme)
      applyTheme(newTheme)
    }
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Watch for system theme changes
  if (process.client) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (theme.value === 'system') {
        isDark.value = e.matches
        applyTheme('system')
      }
    })
  }

  return {
    theme,
    isDark,
    initTheme,
    setTheme,
    toggleTheme,
  }
}
