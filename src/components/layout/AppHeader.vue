<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo 和导航 -->
        <div class="flex items-center space-x-8">
          <h1 
            class="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors" 
            @click="router.push('/')"
          >
            bond博客
          </h1>
          
          <!-- 桌面端导航 -->
          <nav ref="navContainer" class="hidden md:flex items-center space-x-6 relative">
            <router-link
              v-for="(item, idx) in navItems" 
              :key="item.path"
              :to="item.path" 
              class="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
              active-class="text-blue-600 bg-blue-50 font-medium"
            >
              {{ item.label }}
            </router-link>
            <span 
              v-if="indicatorWidth > 0"
              class="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
              :style="{ left: indicatorLeft + 'px', width: indicatorWidth + 'px' }"
            ></span>
          </nav>
        </div>
        
        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-4">
          <!-- 搜索框 -->
          <div class="relative hidden lg:block">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索文章..."
              @keyup.enter="handleSearch"
              class="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>

          <!-- 移动端搜索按钮 -->
          <button class="lg:hidden p-2 text-gray-600 hover:text-blue-600">
            <i class="fas fa-search"></i>
          </button>

          <!-- 用户菜单 -->
          <div v-if="isLoggedIn" class="relative">
            <div 
              class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
              @click="userMenuOpen = !userMenuOpen"
            >
              <img 
                :src="userInfo?.avatar || 'https://i.pravatar.cc/150?img=1'" 
                alt="avatar"
                class="w-8 h-8 rounded-full ring-2 ring-gray-200"
              />
              <span class="hidden md:inline text-sm font-medium">{{ userInfo?.nickname || '用户' }}</span>
              <i class="fas fa-chevron-down text-xs text-gray-400"></i>
            </div>
            
            <!-- 下拉菜单 -->
            <transition name="menu">
              <div 
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <router-link 
                  to="/user/profile" 
                  class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  @click="userMenuOpen = false"
                >
                  <i class="fas fa-user w-5 text-gray-400"></i>
                  <span class="ml-3">个人中心</span>
                </router-link>
                <router-link 
                  to="/user/articles" 
                  class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  @click="userMenuOpen = false"
                >
                  <i class="fas fa-file-alt w-5 text-gray-400"></i>
                  <span class="ml-3">我的文章</span>
                </router-link>
                <router-link 
                  to="/editor" 
                  class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  @click="userMenuOpen = false"
                >
                  <i class="fas fa-edit w-5 text-gray-400"></i>
                  <span class="ml-3">写文章</span>
                </router-link>
                <router-link 
                  v-if="isAdmin" 
                  to="/admin/dashboard" 
                  class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  @click="userMenuOpen = false"
                >
                  <i class="fas fa-cog w-5 text-gray-400"></i>
                  <span class="ml-3">后台管理</span>
                </router-link>
                <hr class="my-2 border-gray-200" />
                <button
                  @click="handleLogout" 
                  class="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <i class="fas fa-sign-out-alt w-5"></i>
                  <span class="ml-3">退出登录</span>
                </button>
              </div>
            </transition>
          </div>

          <!-- 登录按钮 -->
          <button 
            v-else
            @click="router.push('/login')"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-sm hover:shadow-md"
          >
            登录
          </button>

          <!-- 移动端菜单按钮 -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-600 hover:text-blue-600"
          >
            <i class="fas text-xl" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <transition name="slide">
      <div 
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-gray-200 bg-white"
      >
        <nav class="px-4 py-4 space-y-1">
          <router-link
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path" 
            class="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </router-link>
        </nav>
        
        <!-- 移动端搜索 -->
        <div class="px-4 pb-4">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索文章..."
            @keyup.enter="handleSearch"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { label: '首页', path: '/' },
  { label: '文章', path: '/articles' },
  { label: '分类', path: '/categories' },
  { label: '标签', path: '/tags' },
  { label: '关于', path: '/about' }
]

const searchKeyword = ref('')
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const userInfo = computed(() => authStore.user)
const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/articles?keyword=${searchKeyword.value}`)
    mobileMenuOpen.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  userMenuOpen.value = false
  router.push('/')
}

const navContainer = ref<HTMLElement | null>(null)
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

const updateIndicator = () => {
  const container = navContainer.value
  if (!container) return
  const currentIndex = navItems.findIndex(n => {
    if (n.path === '/') return route.path === '/'
    return route.path.startsWith(n.path)
  })
  const links = container.querySelectorAll('a')
  const el = currentIndex >= 0 ? links[currentIndex] : undefined
  if (!el || typeof (el as HTMLElement).getBoundingClientRect !== 'function') {
    indicatorWidth.value = 0
    return
  }
  const rect = (el as HTMLElement).getBoundingClientRect()
  const cRect = container.getBoundingClientRect()
  indicatorLeft.value = rect.left - cRect.left
  indicatorWidth.value = rect.width
}

onMounted(() => {
  nextTick(updateIndicator)
  window.addEventListener('resize', updateIndicator)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIndicator)
})

watch(() => route.fullPath, async () => {
  userMenuOpen.value = false
  mobileMenuOpen.value = false
  await nextTick()
  updateIndicator()
})
</script>