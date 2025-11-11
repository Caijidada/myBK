<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">文章归档</h1>
      
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div v-for="(articles, year) in groupedArticles" :key="year" class="mb-8">
          <h2 class="text-2xl font-bold text-blue-600 mb-4">{{ year }}</h2>
          
          <div class="space-y-4">
            <div
              v-for="article in articles"
              :key="article.id"
              class="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 p-3 rounded transition-colors cursor-pointer"
              @click="$router.push(`/article/${article.id}`)"
            >
              <div class="flex-shrink-0 w-16 text-center">
                <div class="text-sm text-gray-500">{{ formatMonth(article.createdAt) }}</div>
                <div class="text-2xl font-bold text-gray-900">{{ formatDay(article.createdAt) }}</div>
              </div>
              
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600">
                  {{ article.title }}
                </h3>
                <div class="flex items-center space-x-3 text-sm text-gray-500">
                  <span>
                    <i class="fas fa-folder mr-1"></i>
                    {{ article.categoryName }}
                  </span>
                  <span>
                    <i class="far fa-eye mr-1"></i>
                    {{ article.viewCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="Object.keys(groupedArticles).length === 0" class="text-center py-12 text-gray-500">
          暂无文章
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'

interface Article {
  id: number
  title: string
  categoryName: string
  viewCount: number
  createdAt: string
}

const articles = ref<Article[]>([])

// 按年份分组
const groupedArticles = computed(() => {
  const groups: Record<string, Article[]> = {}
  
  articles.value.forEach(article => {
    const year = dayjs(article.createdAt).format('YYYY')
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(article)
  })
  
  return groups
})

const formatMonth = (date: string) => {
  return dayjs(date).format('MM月')
}

const formatDay = (date: string) => {
  return dayjs(date).format('DD')
}

onMounted(() => {
  // TODO: 从 API 加载数据
  // 临时模拟数据
  articles.value = [
    {
      id: 1,
      title: '深入理解 Vue 3 Composition API',
      categoryName: '前端开发',
      viewCount: 1245,
      createdAt: '2024-11-05T10:00:00Z'
    },
    {
      id: 2,
      title: 'TypeScript 高级技巧实战',
      categoryName: '编程语言',
      viewCount: 987,
      createdAt: '2024-10-28T10:00:00Z'
    }
  ]
})
</script>