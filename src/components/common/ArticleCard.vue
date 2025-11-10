<template>
  <div 
    class="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    @click="goToDetail"
  >
    <!-- 封面图片 -->
    <div class="relative h-48 overflow-hidden">
      <img
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
      />
      <!-- 分类标签 -->
      <div class="absolute top-3 left-3">
        <span class="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
          {{ article.categoryName }}
        </span>
      </div>
      <!-- 置顶标签 -->
      <div v-if="article.isTop" class="absolute top-3 right-3">
        <span class="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
          <i class="fas fa-thumbtack mr-1"></i>置顶
        </span>
      </div>
    </div>

    <!-- 文章内容 -->
    <div class="p-6">
      <!-- 标题 -->
      <h3 class="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors line-clamp-2">
        {{ article.title }}
      </h3>
      
      <!-- 摘要 -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ article.summary }}
      </p>

      <!-- 标签 -->
      <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="tag in article.tags.slice(0, 3)" 
          :key="tag.id"
          class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          #{{ tag.name }}
        </span>
      </div>

      <!-- 底部信息 -->
      <div class="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div class="flex items-center space-x-1">
          <img 
            :src="article.authorAvatar || 'https://via.placeholder.com/24'" 
            alt="author"
            class="w-5 h-5 rounded-full"
          />
          <span>{{ article.authorName }}</span>
          <span class="mx-1">·</span>
          <span>{{ formatDate(article.createdAt) }}</span>
        </div>
        
        <div class="flex space-x-3">
          <span class="flex items-center">
            <i class="far fa-eye mr-1"></i>{{ formatNumber(article.viewCount) }}
          </span>
          <span class="flex items-center">
            <i class="far fa-thumbs-up mr-1"></i>{{ formatNumber(article.likeCount) }}
          </span>
          <span class="flex items-center">
            <i class="far fa-comment-alt mr-1"></i>{{ formatNumber(article.commentCount) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface Tag {
  id: number
  name: string
  color?: string
}

interface Article {
  id: number
  title: string
  summary: string
  coverImage: string
  authorId: number
  authorName: string
  authorAvatar?: string
  categoryName: string
  tags?: Tag[]
  viewCount: number
  likeCount: number
  commentCount: number
  isTop?: boolean
  createdAt: string
}

interface Props {
  article: Article
}

const props = defineProps<Props>()
const router = useRouter()

// 跳转到文章详情
const goToDetail = () => {
  router.push(`/article/${props.article.id}`)
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).fromNow()
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
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