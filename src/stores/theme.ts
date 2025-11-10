import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 主题模式：light 或 dark
  const mode = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )

  // 切换主题
  const toggleTheme = () => {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
  }

  // 设置主题
  const setTheme = (theme: 'light' | 'dark') => {
    mode.value = theme
  }

  // 监听主题变化，保存到本地存储
  watch(mode, (newMode) => {
    localStorage.setItem('theme', newMode)
    
    // 添加或移除 dark 类
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  return {
    mode,
    toggleTheme,
    setTheme
  }
})
