import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginAPI, getUserInfo } from '@/api/user'
import type { User, LoginForm } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('token') || '')
  const user = ref<User | null>(null)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  
  // ✅ 开发模式下自动登录管理员
  if (import.meta.env.MODE === 'development' && !token.value) {
    token.value = 'dev-admin-token'
    user.value = {
      id: 1,
      username: 'Admin',
      role: 'ADMIN',
      email: 'admin@example.com'
    } as User
    localStorage.setItem('token', token.value)
  }

  // 登录
  const login = async (credentials: LoginForm) => {
    const { data } = await loginAPI(credentials)
    token.value = data.token
    user.value = data.user
    
    // 保存到本地存储
    localStorage.setItem('token', data.token)
    
    // 如果选择记住我，保存更长时间
    if (credentials.remember) {
      localStorage.setItem('rememberMe', 'true')
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const { data } = await getUserInfo()
      user.value = data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('rememberMe')
  }

  // 更新用户信息
  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    fetchUserInfo,
    updateUser
  }
})