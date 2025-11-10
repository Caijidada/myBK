<template>
  <footer class="bg-gray-800 text-white py-10 px-8">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- 关于我们 -->
      <div>
        <h3 class="text-lg font-semibold mb-4">关于我们</h3>
        <p class="text-gray-400 text-sm">
          这是一个专注于技术和生活的博客平台，致力于分享高质量的内容，帮助读者获得有价值的信息。
        </p>
      </div>

      <!-- 快速链接 -->
      <div>
        <h3 class="text-lg font-semibold mb-4">快速链接</h3>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li v-for="link in quickLinks" :key="link.path">
            <router-link :to="link.path" class="hover:text-white transition-colors">
              {{ link.label }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 联系方式 -->
      <div>
        <h3 class="text-lg font-semibold mb-4">联系方式</h3>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li>
            <i class="fas fa-envelope mr-2"></i>
            <a href="mailto:contact@example.com" class="hover:text-white">
              contact@example.com
            </a>
          </li>
          <li>
            <i class="fab fa-github mr-2"></i>
            <a href="https://github.com" target="_blank" class="hover:text-white">
              GitHub
            </a>
          </li>
          <li>
            <i class="fab fa-twitter mr-2"></i>
            <a href="https://twitter.com" target="_blank" class="hover:text-white">
              Twitter
            </a>
          </li>
        </ul>
      </div>

      <!-- 订阅更新 -->
      <div>
        <h3 class="text-lg font-semibold mb-4">订阅更新</h3>
        <p class="text-gray-400 text-sm mb-3">获取最新的文章推送</p>
        <div class="flex">
          <input
            v-model="subscribeEmail"
            type="email"
            placeholder="你的邮箱"
            class="px-4 py-2 text-sm rounded-l focus:outline-none w-full text-gray-800"
          />
          <button 
            @click="handleSubscribe"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors rounded-r"
          >
            订阅
          </button>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="mt-10 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
      <p>© {{ currentYear }} 我的博客. 版权所有.</p>
      <div class="mt-2 space-x-4">
        <a href="#" class="hover:text-white transition-colors">隐私政策</a>
        <span>|</span>
        <a href="#" class="hover:text-white transition-colors">服务条款</a>
        <span>|</span>
        <a href="#" class="hover:text-white transition-colors">网站地图</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 当前年份
const currentYear = computed(() => new Date().getFullYear())

// 快速链接
const quickLinks = [
  { label: '首页', path: '/' },
  { label: '分类', path: '/categories' },
  { label: '标签', path: '/tags' },
  { label: '归档', path: '/archives' },
  { label: '关于', path: '/about' }
]

// 订阅邮箱
const subscribeEmail = ref('')

// 处理订阅
const handleSubscribe = () => {
  if (!subscribeEmail.value) {
    ElMessage.warning('请输入邮箱地址')
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(subscribeEmail.value)) {
    ElMessage.error('请输入有效的邮箱地址')
    return
  }

  // TODO: 调用订阅API
  ElMessage.success('订阅成功！')
  subscribeEmail.value = ''
}
</script>