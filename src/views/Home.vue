<template>

  <div class="min-h-screen bg-gray-50">
    
    <section
      class="relative h-[500px] overflow-hidden flex items-center justify-start pl-20"
      style="background-image: url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80'); background-size: cover; background-position: center;"
    >
      <div class="absolute inset-0 bg-black opacity-50 "></div>
      <div class="relative max-w-lg z-10 text-white">
        <h2 class="text-5xl font-bold mb-4 animate-fade-in">探索知识的无限可能</h2>
        <p class="mb-6 text-lg opacity-90">
          在这里，你可以找到各种技术分享、生活感悟和创意灵感。让我们一起成长，共同进步。
        </p>
        <button 
          @click="router.push('/articles')"
          class="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg"
        >
          开始阅读
        </button>
      </div>
    </section>

    <!-- Featured Articles Carousel -->
    <section class="py-12 px-8 max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">精选推荐</h2>
      <Swiper
        :modules="swiperModules"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :loop="true"
        class="rounded-xl overflow-hidden shadow-lg"
      >
        <SwiperSlide v-for="(article, index) in featuredArticles" :key="index">
          <div class="relative h-96 cursor-pointer" @click="goToArticle(article.id)">
            <img
              :src="article.coverImage"
              :alt="article.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div class="flex items-center space-x-2 mb-3">
                <span class="px-3 py-1 bg-blue-500 rounded-full text-xs font-medium">
                  {{ article.categoryName }}
                </span>
                <span class="text-sm opacity-80">{{ formatDate(article.createdAt) }}</span>
              </div>
              <h3 class="text-2xl font-bold mb-2">{{ article.title }}</h3>
              <p class="text-sm opacity-90 line-clamp-2">{{ article.summary }}</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>

    <!-- Category Navigation -->
    <section class="py-10 px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">热门分类</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          <CategoryCard 
            v-for="category in categories" 
            :key="category.id"
            :category="category"
          />
        </div>
      </div>
    </section>

    <!-- Tag Cloud -->
    <section class="py-10 px-8 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">热门标签</h2>
        <TagCloud 
          :tags="tags" 
          :show-mode-switch="false"
          @tag-click="handleTagClick"
        />
      </div>
    </section>

    <!-- Article List -->
    <section class="py-12 px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">最新文章</h2>
          <div class="flex space-x-2">
            <button
              @click="sortBy = 'time'"
              :class="[
                'px-4 py-2 text-sm border rounded-full transition-all',
                sortBy === 'time' 
                  ? 'border-blue-500 bg-blue-50 text-blue-600' 
                  : 'border-gray-300 hover:border-blue-500'
              ]"
            >
              按时间排序
            </button>
            <button
              @click="sortBy = 'popularity'"
              :class="[
                'px-4 py-2 text-sm border rounded-full transition-all',
                sortBy === 'popularity' 
                  ? 'border-blue-500 bg-blue-50 text-blue-600' 
                  : 'border-gray-300 hover:border-blue-500'
              ]"
            >
              按热度排序
            </button>
          </div>
        </div>

        <!-- 文章网格 -->
        <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard 
            v-for="article in articles" 
            :key="article.id"
            :article="article"
          />
        </div>

        <!-- 加载状态 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="n in 6" :key="n" class="animate-pulse">
            <div class="bg-gray-200 h-48 rounded-t-xl"></div>
            <div class="p-6 bg-white rounded-b-xl">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="mt-10 flex justify-center">
          <button 
            @click="loadMore"
            :disabled="loading || !hasMore"
            class="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {{ loading ? '加载中...' : hasMore ? '加载更多' : '没有更多了' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-16 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="space-y-2">
            <div class="text-4xl font-bold">{{ stats.articleCount }}+</div>
            <div class="text-sm opacity-80">文章总数</div>
          </div>
          <div class="space-y-2">
            <div class="text-4xl font-bold">{{ stats.viewCount }}+</div>
            <div class="text-sm opacity-80">总访问量</div>
          </div>
          <div class="space-y-2">
            <div class="text-4xl font-bold">{{ stats.userCount }}+</div>
            <div class="text-sm opacity-80">注册用户</div>
          </div>
          <div class="space-y-2">
            <div class="text-4xl font-bold">{{ stats.commentCount }}+</div>
            <div class="text-sm opacity-80">评论数量</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import ArticleCard from '@/components/common/ArticleCard.vue'
import CategoryCard from '@/components/common/CategoryCard.vue'
import TagCloud from '@/components/common/TagCloud.vue'
import dayjs from 'dayjs'
import AppHeader from '@/components/layout/AppHeader.vue'
import 'swiper/css'
import 'swiper/css/pagination'

import 'swiper/swiper-bundle.css'

const router = useRouter()
const swiperModules = [Pagination, Autoplay]

// 状态
const loading = ref(false)
const sortBy = ref<'time' | 'popularity'>('time')
const hasMore = ref(true)
const currentPage = ref(1)

// 数据
const featuredArticles = ref([
  {
    id: 1,
    title: '深入理解 Vue 3 Composition API',
    summary: '全面解析 Vue 3 新一代组合式 API 的设计理念与实践应用。',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    categoryName: '前端开发',
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 2,
    title: 'TypeScript 高级技巧实战',
    summary: '掌握 TypeScript 的进阶特性，提高项目开发效率和代码质量。',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80',
    categoryName: '编程语言',
    createdAt: '2024-10-28T10:00:00Z'
  },
  {
    id: 3,
    title: 'Tailwind CSS 实战指南',
    summary: '如何利用 Tailwind CSS 构建现代化响应式网站界面。',
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&q=80',
    categoryName: 'CSS设计',
    createdAt: '2024-10-25T10:00:00Z'
  }
])

const categories = ref([
  { id: 1, name: '前端开发', icon: 'fab fa-html5', articleCount: 24 },
  { id: 2, name: '后端开发', icon: 'fas fa-server', articleCount: 18 },
  { id: 3, name: '移动开发', icon: 'fas fa-mobile-alt', articleCount: 12 },
  { id: 4, name: '人工智能', icon: 'fas fa-brain', articleCount: 15 },
  { id: 5, name: '生活随笔', icon: 'fas fa-book-open', articleCount: 8 }
])

const tags = ref([
  { id: 1, name: 'JavaScript', color: '#F7DF1E', articleCount: 45 },
  { id: 2, name: 'Vue.js', color: '#42B883', articleCount: 38 },
  { id: 3, name: 'React', color: '#61DAFB', articleCount: 32 },
  { id: 4, name: 'TypeScript', color: '#3178C6', articleCount: 28 },
  { id: 5, name: 'Node.js', color: '#339933', articleCount: 25 },
  { id: 6, name: 'Python', color: '#3776AB', articleCount: 22 },
  { id: 7, name: 'CSS', color: '#1572B6', articleCount: 20 },
  { id: 8, name: 'Docker', color: '#2496ED', articleCount: 18 }
])

const articles = ref([
  {
    id: 1,
    title: '构建高性能 Web 应用的最佳实践',
    summary: '本文探讨了提升 Web 应用性能的关键策略，包括资源优化、缓存机制和懒加载技术等。',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    authorId: 1,
    authorName: '张三',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    categoryName: '前端开发',
    tags: [{ id: 1, name: 'JavaScript' }, { id: 7, name: 'CSS' }],
    viewCount: 1245,
    likeCount: 87,
    commentCount: 23,
    isTop: true,
    createdAt: '2024-11-05T10:00:00Z'
  },
  {
    id: 2,
    title: '现代前端框架状态管理深度剖析',
    summary: '分析主流前端框架的状态管理模式及其适用场景，助力开发者做出更优架构决策。',
    coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    authorId: 2,
    authorName: '李四',
    authorAvatar: 'https://i.pravatar.cc/150?img=2',
    categoryName: '前端开发',
    tags: [{ id: 2, name: 'Vue.js' }, { id: 3, name: 'React' }],
    viewCount: 987,
    likeCount: 65,
    commentCount: 18,
    createdAt: '2024-11-03T10:00:00Z'
  },
  {
    id: 3,
    title: '从零搭建企业级 Node.js 微服务架构',
    summary: '详细介绍如何基于 Node.js 和 Docker 技术栈构建可扩展的企业级微服务系统。',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    authorId: 3,
    authorName: '王五',
    authorAvatar: 'https://i.pravatar.cc/150?img=3',
    categoryName: '后端开发',
    tags: [{ id: 5, name: 'Node.js' }, { id: 8, name: 'Docker' }],
    viewCount: 1567,
    likeCount: 102,
    commentCount: 31,
    createdAt: '2024-11-01T10:00:00Z'
  }
])

const stats = ref({
  articleCount: 892,
  viewCount: 125000,
  userCount: 3580,
  commentCount: 8920
})

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 跳转到文章详情
const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

// 处理标签点击
const handleTagClick = (tag: any) => {
  router.push(`/articles?tag=${tag.id}`)
}

// 加载更多文章
const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  currentPage.value++
  
  // TODO: 调用API加载更多文章
  setTimeout(() => {
    // 模拟加载完成
    loading.value = false
    // 假设加载到第3页就没有更多了
    if (currentPage.value >= 3) {
      hasMore.value = false
    }
  }, 1000)
}

// 监听排序方式变化
watch(sortBy, (newVal) => {
  console.log('排序方式变化:', newVal)
  // TODO: 根据排序方式重新加载文章
})

// 组件挂载
onMounted(() => {
  // TODO: 加载首页数据
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>