<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div class="text-center">
      <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
        <i class="fas fa-spinner fa-spin text-3xl text-white"></i>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">正在登录...</h2>
      <p class="text-gray-600">请稍候，我们正在完成您的登录</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    // 从URL查询参数中获取tokens
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('accessToken')
    const refreshToken = urlParams.get('refreshToken')

    if (!accessToken || !refreshToken) {
      throw new Error('未能获取到认证信息')
    }

    // 保存tokens到localStorage和store
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // 更新auth store
    authStore.setTokens(accessToken, refreshToken)

    // 获取用户信息
    await authStore.fetchUserInfo()

    ElMessage.success('登录成功')

    // 跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 500)

  } catch (error: any) {
    console.error('OAuth2 callback error:', error)
    ElMessage.error(error.message || 'OAuth2登录失败')

    // 跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
