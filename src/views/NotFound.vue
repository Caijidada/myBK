<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
    <div class="text-center">
      <!-- 404 插画 -->
      <div class="mb-8">
        <div class="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          404
        </div>
      </div>

      <!-- 标题和描述 -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">页面未找到</h1>
      <p class="text-lg text-gray-600 mb-8">
        抱歉，您访问的页面不存在或已被删除
      </p>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          @click="router.back()"
          class="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          返回上页
        </button>
        <button
          @click="router.push('/')"
          class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:shadow-xl transition-all"
        >
          <i class="fas fa-home mr-2"></i>
          回到首页
        </button>
      </div>

      <!-- 推荐链接 -->
      <div class="mt-12">
        <p class="text-sm text-gray-500 mb-4">或者访问以下页面：</p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link
            v-for="link in quickLinks"
            :key="link.path"
            :to="link.path"
            class="px-4 py-2 bg-white rounded-lg text-gray-700 hover:shadow-md transition-shadow"
          >
            <i :class="link.icon" class="mr-2"></i>
            {{ link.label }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 装饰性元素 -->
    <div class="fixed top-0 left-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
    <div class="fixed bottom-0 right-0 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const quickLinks = [
  { path: '/', label: '首页', icon: 'fas fa-home' },
  { path: '/articles', label: '文章', icon: 'fas fa-file-alt' },
  { path: '/categories', label: '分类', icon: 'fas fa-folder' },
  { path: '/about', label: '关于', icon: 'fas fa-info-circle' }
]
</script>