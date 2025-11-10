<template>
  <div 
    class="group cursor-pointer text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
    @click="goToCategory"
  >
    <!-- 图标 -->
    <div 
      :class="[
        'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors',
        iconBgColor,
        'group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300'
      ]"
    >
      <i :class="[category.icon, 'text-2xl', iconColor]"></i>
    </div>

    <!-- 分类名称 -->
    <h3 class="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
      {{ category.name }}
    </h3>

    <!-- 描述 -->
    <p v-if="category.description" class="text-gray-500 text-sm mb-3 line-clamp-2">
      {{ category.description }}
    </p>

    <!-- 文章数量 -->
    <div class="flex items-center justify-center space-x-1 text-gray-400 text-sm">
      <i class="fas fa-file-alt"></i>
      <span>{{ category.articleCount }} 篇文章</span>
    </div>

    <!-- 悬停效果 -->
    <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <span class="text-blue-500 text-sm font-medium">
        查看更多 <i class="fas fa-arrow-right ml-1"></i>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Category {
  id: number
  name: string
  description?: string
  icon: string
  articleCount: number
  color?: string
}

interface Props {
  category: Category
}

const props = defineProps<Props>()
const router = useRouter()

// 预设颜色方案
const colorSchemes = [
  { bg: 'bg-blue-100', icon: 'text-blue-500' },
  { bg: 'bg-green-100', icon: 'text-green-500' },
  { bg: 'bg-purple-100', icon: 'text-purple-500' },
  { bg: 'bg-orange-100', icon: 'text-orange-500' },
  { bg: 'bg-pink-100', icon: 'text-pink-500' },
  { bg: 'bg-indigo-100', icon: 'text-indigo-500' },
  { bg: 'bg-red-100', icon: 'text-red-500' },
  { bg: 'bg-yellow-100', icon: 'text-yellow-500' }
]

// 根据分类ID选择颜色
const colorIndex = computed(() => props.category.id % colorSchemes.length)
const iconBgColor = computed(() => colorSchemes[colorIndex.value].bg)
const iconColor = computed(() => colorSchemes[colorIndex.value].icon)

// 跳转到分类页面
const goToCategory = () => {
  router.push(`/articles?category=${props.category.id}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>