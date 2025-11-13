import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginAPI, getUserInfo } from '@/api/user'
import type { User, LoginForm } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // 状态 - 使用 accessToken 和 refreshToken
  const accessToken = ref<string>(localStorage.getItem('accessToken') || '')
  const refreshToken = ref<string>(localStorage.getItem('refreshToken') || '')
  const user = ref<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )

  // 计算属性
  const isLoggedIn = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  
  // 登录
  const login = async (credentials: LoginForm) => {
    console.log('🔐 开始登录，用户名:', credentials.username)
    
    const response = await loginAPI(credentials)
    console.log('📡 后端响应:', response)
    
    // ⚠️ 后端返回格式: { code: 200, message: "...", data: { accessToken, refreshToken, user } }
    const { accessToken: token, refreshToken: refresh, user: userData } = response.data
    
    console.log('✅ Token:', token)
    console.log('👤 用户信息:', userData)
    console.log('🎭 用户角色:', userData.role)
    
    // 保存状态
    accessToken.value = token
    refreshToken.value = refresh
    user.value = userData
    
    // 保存到本地存储
    localStorage.setItem('accessToken', token)
    localStorage.setItem('refreshToken', refresh)
    localStorage.setItem('user', JSON.stringify(userData))
    
    console.log('💾 已保存到 localStorage')
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo()
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
    }
  }

  // 登出
  const logout = () => {
    accessToken.value = ''
    refreshToken.value = ''
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')
  }

  // 更新用户信息
  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    accessToken,      
    refreshToken,     
    user,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    fetchUserInfo,
    updateUser
  }
})