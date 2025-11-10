<template>
  <header class="bg-white shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-50">
    <div class="flex items-center space-x-10">
      <h1 class="text-xl font-bold text-blue-600 cursor-pointer" @click="router.push('/')">
        我的博客
      </h1>
      <nav class="hidden md:flex space-x-6">
        <a 
          v-for="item in navItems" 
          :key="item.path"
          :href="item.path" 
          class="hover:text-blue-500 transition-colors"
          :class="{ 'text-blue-500 font-medium': isActive(item.path) }"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
    
    <div class="flex items-center space-x-4">
      <!-- 搜索框 -->
      <div class="relative hidden sm:block">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索文章..."
          @keyup.enter="handleSearch"
          class="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 w-64 text-sm"
        />
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
      </div>

      <!-- 用户菜单 -->
      <div v-if="isLoggedIn" class="relative group">
        <div class="flex items-center space-x-2 cursor-pointer">
          <img 
            :src="userInfo.avatar || 'https://placehold.co/32x32'" 
            alt="avatar"
            class="w-8 h-8 rounded-full"
          />
          <span class="hidden md:inline text-sm">{{ userInfo.nickname }}</span>
        </div>
        
        <!-- 下拉菜单 -->
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <router-link to="/user/profile" class="block px-4 py-2 text-sm hover:bg-gray-100">
            <i class="fas fa-user mr-2"></i>个人中心
          </router-link>
          <router-link to="/user/articles" class="block px-4 py-2 text-sm hover:bg-gray-100">
            <i class="fas fa-file-alt mr-2"></i>我的文章
          </router-link>
          <router-link to="/editor" class="block px-4 py-2 text-sm hover:bg-gray-100">
            <i class="fas fa-edit mr-2"></i>写文章
          </router-link>
          <router-link v-if="isAdmin" to="/admin/dashboard" class="block px-4 py-2 text-sm hover:bg-gray-100">
            <i class="fas fa-cog mr-2"></i>后台管理
          </router-link>
          <hr class="my-2" />
          <a @click="handleLogout" class="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
            <i class="fas fa-sign-out-alt mr-2"></i>退出登录
          </a>
        </div>
      </div>

      <!-- 登录按钮 -->
      <button 
        v-else
        @click="router.push('/login')"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm transition-colors"
      >
        登录 / 注册
      </button>

      <!-- 移动端菜单按钮 -->
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden text-gray-600"
      >
        <i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <div 
      v-if="mobileMenuOpen"
      class="absolute top-full left-0 right-0 bg-white shadow-lg py-4 md:hidden"
    >
      <nav class="flex flex-col space-y-2 px-4">
        <a 
          v-for="item in navItems" 
          :key="item.path"
          :href="item.path" 
          class="py-2 hover:text-blue-500 transition-colors"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 导航项
const navItems = [
  { label: '首页', path: '/' },
  { label: '文章', path: '/articles' },
  { label: '分类', path: '/categories' },
  { label: '标签', path: '/tags' },
  { label: '关于', path: '/about' }
]

// 状态
const searchKeyword = ref('')
const mobileMenuOpen = ref(false)

// 计算属性
const isLoggedIn = computed(() => authStore.isLoggedIn)
const userInfo = computed(() => authStore.user)
const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

// 判断当前路由是否激活
const isActive = (path: string) => {
  return route.path === path
}

// 搜索
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/articles?keyword=${searchKeyword.value}`)
  }
}

// 退出登录
const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>

</style>