<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">
          {{ pageTitle }}
        </h1>

        <!-- 筛选条件标签 -->
        <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 mb-4">
          <div
            v-for="filter in activeFilters"
            :key="filter.key"
            class="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
          >
            <span>{{ filter.label }}: {{ filter.value }}</span>
            <button @click="removeFilter(filter.key)" class="hover:text-blue-800">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <button
            @click="clearAllFilters"
            class="px-3 py-1 text-gray-600 hover:text-red-600 text-sm"
          >
            清除所有
          </button>
        </div>

        <!-- 工具栏 -->
        <div class="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          <!-- 搜索框 -->
          <div class="w-full lg:w-64">
            <SearchBar
              :placeholder="'搜索文章...'"
              @search="handleSearch"
            />
          </div>

          <!-- 排序和筛选 -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- 分类筛选 -->
            <el-select
              v-model="selectedCategory"
              placeholder="选择分类"
              clearable
              class="w-40"
              @change="handleCategoryChange"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>

            <!-- 标签筛选 -->
            <el-select
              v-model="selectedTag"
              placeholder="选择标签"
              clearable
              class="w-40"
              @change="handleTagChange"
            >
              <el-option
                v-for="tag in tags"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
              />
            </el-select>

            <!-- 视图切换 -->
            <div class="flex border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'px-3 py-2 transition-colors',
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                ]"
              >
                <i class="fas fa-th"></i>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'px-3 py-2 transition-colors',
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                ]"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="max-w-7xl mx-auto px-8 py-8">
      <!-- 结果统计 -->
      <div class="mb-6 text-gray-600">
        找到 <span class="font-medium text-blue-600">{{ totalCount }}</span> 篇文章
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 6" :key="n" class="animate-pulse">
          <div class="bg-gray-200 h-48 rounded-t-xl"></div>
          <div class="p-6 bg-white rounded-b-xl">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- 网格视图 -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>

      <!-- 列表视图 -->
      <div v-else class="space-y-6">
        <div
          v-for="article in articles"
          :key="article.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer flex gap-6"
          @click="router.push(`/article/${article.id}`)"
        >
          <!-- 封面图 -->
          <div class="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              :src="article.coverImage || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'"
              :alt="article.title"
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>

          <!-- 内容 -->
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <!-- 分类和日期 -->
              <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <span class="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                  {{ article.categoryName }}
                </span>
                <span>·</span>
                <span>{{ formatDate(article.publishedAt) }}</span>
              </div>

              <!-- 标题 -->
              <h3 class="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-1">
                {{ article.title }}
              </h3>

              <!-- 摘要 -->
              <p class="text-gray-600 text-sm line-clamp-2 mb-3">
                {{ article.summary }}
              </p>

              <!-- 标签 -->
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tagName in article.tagNames?.slice(0, 3)"
                  :key="tagName"
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{{ tagName }}
                </span>
              </div>
            </div>

            <!-- 底部信息 -->
            <div class="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-1">
                <img
                  :src="article.authorAvatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                  :alt="article.authorName"
                  class="w-6 h-6 rounded-full"
                />
                <span>{{ article.authorName }}</span>
              </div>

              <div class="flex space-x-4">
                <span><i class="far fa-eye mr-1"></i>{{ article.viewCount }}</span>
                <span><i class="far fa-thumbs-up mr-1"></i>{{ article.likeCount }}</span>
                <span><i class="far fa-comment-alt mr-1"></i>{{ article.commentCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && articles.length === 0" class="text-center py-20">
        <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">暂无文章</p>
        <button
          @click="clearAllFilters"
          class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          清除筛选条件
        </button>
      </div>

      <!-- 分页 -->
      <div v-if="articles.length > 0" class="mt-12">
        <Pagination
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ArticleCard from '@/components/common/ArticleCard.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import Pagination from '@/components/common/Pagination.vue'
import { getArticleList } from '@/api/article'
import { getCategoryList } from '@/api/category'
import { getTagList } from '@/api/tag'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const selectedCategory = ref<number | null>(null)
const selectedTag = ref<number | null>(null)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const totalCount = ref(0)

// 数据
const articles = ref<any[]>([])
const categories = ref<any[]>([])
const tags = ref<any[]>([])

// 页面标题
const pageTitle = computed(() => {
  if (searchKeyword.value) {
    return `搜索: ${searchKeyword.value}`
  }
  if (selectedCategory.value) {
    const category = categories.value.find(c => c.id === selectedCategory.value)
    return category ? `分类: ${category.name}` : '文章列表'
  }
  if (selectedTag.value) {
    const tag = tags.value.find(t => t.id === selectedTag.value)
    return tag ? `标签: ${tag.name}` : '文章列表'
  }
  return '全部文章'
})

// 活跃的筛选条件
const activeFilters = computed(() => {
  const filters: Array<{ key: string; label: string; value: string }> = []

  if (searchKeyword.value) {
    filters.push({ key: 'keyword', label: '关键词', value: searchKeyword.value })
  }
  if (selectedCategory.value) {
    const category = categories.value.find(c => c.id === selectedCategory.value)
    if (category) {
      filters.push({ key: 'category', label: '分类', value: category.name })
    }
  }
  if (selectedTag.value) {
    const tag = tags.value.find(t => t.id === selectedTag.value)
    if (tag) {
      filters.push({ key: 'tag', label: '标签', value: tag.name })
    }
  }

  return filters
})

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

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

// 加载文章列表
const loadArticles = async () => {
  try {
    loading.value = true

    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }

    if (selectedCategory.value) {
      params.categoryId = selectedCategory.value
    }
    if (selectedTag.value) {
      params.tagId = selectedTag.value
    }
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }

    const res = await getArticleList(params)
    articles.value = res.data.records || []
    totalCount.value = res.data.total || 0

  } catch (error: any) {
    console.error('加载文章失败:', error)
    ElMessage.error(error.message || '加载文章失败')
    articles.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
  currentPage.value = 1
  loadArticles()
}

// 处理分类变化
const handleCategoryChange = () => {
  currentPage.value = 1
  loadArticles()
}

// 处理标签变化
const handleTagChange = () => {
  currentPage.value = 1
  loadArticles()
}

// 移除筛选条件
const removeFilter = (key: string) => {
  switch (key) {
    case 'keyword':
      searchKeyword.value = ''
      break
    case 'category':
      selectedCategory.value = null
      break
    case 'tag':
      selectedTag.value = null
      break
  }
  currentPage.value = 1
  loadArticles()
}

// 清除所有筛选
const clearAllFilters = () => {
  searchKeyword.value = ''
  selectedCategory.value = null
  selectedTag.value = null
  currentPage.value = 1
  loadArticles()
}

// 处理分页变化
const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  loadArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 从URL读取查询参数
onMounted(async () => {
  await Promise.all([loadCategories(), loadTags()])

  if (route.query.categoryId) {
    selectedCategory.value = Number(route.query.categoryId)
  }
  if (route.query.tagId) {
    selectedTag.value = Number(route.query.tagId)
  }

  await loadArticles()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
