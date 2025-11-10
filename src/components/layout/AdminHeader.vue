<template>
  <header class="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-40">
    <div class="flex items-center space-x-4">
      <!-- 侧边栏切换按钮 -->
      <button 
        @click="emit('toggle-sidebar')"
        class="text-gray-600 hover:text-blue-500 focus:outline-none"
      >
        <i class="fas fa-bars fa-lg"></i>
      </button>
      
      <h1 class="text-xl font-semibold text-gray-800 hidden sm:block">
        管理后台
      </h1>
    </div>

    <div class="flex items-center space-x-4">
      <!-- 通知 -->
      <div class="relative">
        <button class="text-gray-600 hover:text-blue-500 relative">
          <i class="far fa-bell fa-lg"></i>
          <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </button>
      </div>

      <!-- 用户菜单 -->
      <div class="relative group">
        <div class="flex items-center space-x-2 cursor-pointer">
          <img 
            :src="userInfo.avatar || 'https://via.placeholder.com/32'" 
            alt="avatar"
            class="w-8 h-8 rounded-full"
          />
          <span class="hidden sm:inline text-sm">{{ userInfo.nickname }}</span>
          <i class="fas fa-chevron-down text-xs text-gray-400"></i>
        </div>

        <!-- 下拉菜单 -->
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <router-link to="/user/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <i class="fas fa-user mr-2"></i>个人中心
          </router-link>
          <router-link to="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <i class="fas fa-home mr-2"></i>返回首页
          </router-link>
          <hr class="my-1" />
          <a @click="handleLogout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
            <i class="fas fa-sign-out-alt mr-2"></i>退出登录
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Emits
const emit = defineEmits<{
  'toggle-sidebar': []
}>()

// 计算属性
const userInfo = computed(() => authStore.user || {})
const unreadCount = computed(() => 5) // TODO: 从 API 获取未读消息数

// 退出登录
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>