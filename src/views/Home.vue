<template>
  <div class="min-h-screen bg-gray-50">

    <!-- 每日算法 Banner -->
    <section class="bg-white border-b border-gray-200 py-12">
      <div class="max-w-7xl mx-auto px-8 text-center">
        <h1 class="text-4xl font-bold mb-3 text-gray-800">每日算法</h1>
        <p class="text-lg text-gray-600">
          今日题目：{{ todayProblem.title }} —— {{ todayProblem.description }}
        </p>
        <button
          @click="router.push('/daily-algorithm')"
          class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          前往每日算法
        </button>
      </div>
    </section>

    <!-- Featured Articles Carousel -->
    <section class="py-12 px-8 max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">精选推荐</h2>
      <div v-if="featuredArticles.length > 0">
        <Swiper
          :modules="swiperModules"
          :pagination="{ clickable: true }"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :loop="featuredArticles.length >= 2"
          class="rounded-xl overflow-hidden shadow-lg"
        >
          <SwiperSlide v-for="article in featuredArticles" :key="article.id">
            <div class="relative h-96 cursor-pointer" @click="goToArticle(article.id)">
              <img
                :src="article.coverImage || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80'"
                :alt="article.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div class="flex items-center space-x-2 mb-3">
                  <span class="px-3 py-1 bg-blue-500 rounded-full text-xs font-medium">
                    {{ article.categoryName }}
                  </span>
                  <span class="text-sm opacity-80">{{ formatDate(article.publishedAt) }}</span>
                </div>
                <h3 class="text-2xl font-bold mb-2">{{ article.title }}</h3>
                <p class="text-sm opacity-90 line-clamp-2">{{ article.summary }}</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>

    <!-- Category Navigation -->
    <section class="py-10 px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">热门分类</h2>
        <div v-if="categories.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
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
          v-if="tags.length > 0"
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
        </div>

        <!-- 文章网格 -->
        <div v-if="!loading && articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>

        <!-- 加载状态 -->
        <div v-else-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    <section class="py-16 px-8 bg-gradient-to-r text-white">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import ArticleCard from '@/components/common/ArticleCard.vue'
import CategoryCard from '@/components/common/CategoryCard.vue'
import TagCloud from '@/components/common/TagCloud.vue'
import { getArticleList } from '@/api/article'
import { getCategoryList } from '@/api/category'
import { getTagList } from '@/api/tag'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/swiper-bundle.css'

const router = useRouter()
const swiperModules = [Pagination, Autoplay]

const todayProblem = ref({
  title: '两数之和',
  description: '在数组中找到和为目标值的两个下标'
})

// 状态
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)

// 数据
const featuredArticles = ref<any[]>([])
const categories = ref<any[]>([])
const tags = ref<any[]>([])
const articles = ref<any[]>([])
const stats = ref({
  articleCount: 0,
  viewCount: 0,
  userCount: 0,
  commentCount: 0
})

// 加载分类
const loadCategories = async () => {
  try {
    const res = await getCategoryList()
    categories.value = res.data || []
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 加载标签
const loadTags = async () => {
  try {
    const res = await getTagList()
    tags.value = res.data || []
  } catch (error) {
    console.error('加载标签失败:', error)
  }
}

// 加载文章
const loadArticles = async (page: number = 1) => {
  try {
    loading.value = true
    const res = await getArticleList({ page, size: 9 })

    if (page === 1) {
      articles.value = res.data.records || []
      // 提取置顶或精选文章作为轮播图
      featuredArticles.value = (res.data.records || []).filter((a: any) => a.isTop || a.isFeatured).slice(0, 3)
      if (featuredArticles.value.length === 0) {
        // 如果没有精选文章，使用前3篇
        featuredArticles.value = (res.data.records || []).slice(0, 3)
      }
    } else {
      articles.value = [...articles.value, ...(res.data.records || [])]
    }

    hasMore.value = res.data.page < res.data.pages

    // 计算统计数据
    stats.value.articleCount = res.data.total || 0
    stats.value.viewCount = articles.value.reduce((sum: number, a: any) => sum + (a.viewCount || 0), 0)
    stats.value.commentCount = articles.value.reduce((sum: number, a: any) => sum + (a.commentCount || 0), 0)
    stats.value.userCount = 100 // 这个需要单独的API，暂时写死

  } catch (error: any) {
    console.error('加载文章失败:', error)
    ElMessage.error(error.message || '加载文章失败')
  } finally {
    loading.value = false
  }
}

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
  router.push(`/articles?tagId=${tag.id}`)
}

// 加载更多文章
const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  currentPage.value++
  await loadArticles(currentPage.value)
}

// 组件挂载
onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadTags(),
    loadArticles(1)
  ])
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
</style>
