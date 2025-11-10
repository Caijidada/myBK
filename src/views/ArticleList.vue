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
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <!-- 搜索框 -->
          <SearchBar 
            :placeholder="'搜索文章...'"
            @search="handleSearch"
          />

          <!-- 排序和筛选 -->
          <div class="flex items-center space-x-3">
            <!-- 排序 -->
            <el-select v-model="sortBy" placeholder="排序方式" class="w-40">
              <el-option label="最新发布" value="time" />
              <el-option label="最多浏览" value="views" />
              <el-option label="最多点赞" value="likes" />
            </el-select>

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
              v-model="selectedTags" 
              placeholder="选择标签" 
              multiple
              clearable
              class="w-60"
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
            <div class="flex border border-gray-300 rounded-lg overflow-hidden">
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

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              :src="article.coverImage"
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
                <span>{{ formatDate(article.createdAt) }}</span>
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
                  v-for="tag in article.tags?.slice(0, 3)"
                  :key="tag.id"
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{{ tag.name }}
                </span>
              </div>
            </div>

            <!-- 底部信息 -->
            <div class="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-1">
                <img
                  :src="article.authorAvatar"
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
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('time')
const selectedCategory = ref<number | null>(null)
const selectedTags = ref<number[]>([])
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const totalCount = ref(0)

// 数据
const articles = ref<any[]>([])
const categories = ref([
  { id: 1, name: '前端开发' },
  { id: 2, name: '后端开发' },
  { id: 3, name: '移动开发' },
  { id: 4, name: '人工智能' }
])
const tags = ref([
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'Vue.js' },
  { id: 3, name: 'React' },
  { id: 4, name: 'TypeScript' }
])

// 页面标题
const pageTitle = computed(() => {
  if (searchKeyword.value) {
    return `搜索: ${searchKeyword.value}`
  }
  if (selectedCategory.value) {
    const category = categories.value.find(c => c.id === selectedCategory.value)
    return category ? `分类: ${category.name}` : '文章列表'
  }
  if (selectedTags.value.length > 0) {
    const tagNames = selectedTags.value
      .map(id => tags.value.find(t => t.id === id)?.name)
      .filter(Boolean)
      .join(', ')
    return `标签: ${tagNames}`
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
  if (selectedTags.value.length > 0) {
    const tagNames = selectedTags.value
      .map(id => tags.value.find(t => t.id === id)?.name)
      .filter(Boolean)
      .join(', ')
    filters.push({ key: 'tags', label: '标签', value: tagNames })
  }
  
  return filters
})

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
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
    case 'tags':
      selectedTags.value = []
      break
  }
  loadArticles()
}

// 清除所有筛选
const clearAllFilters = () => {
  searchKeyword.value = ''
  selectedCategory.value = null
  selectedTags.value = []
  sortBy.value = 'time'
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

// 加载文章列表
const loadArticles = async () => {
  loading.value = true
  
  // TODO: 调用API获取文章列表
  // const params = {
  //   page: currentPage.value,
  //   size: pageSize.value,
  //   sortBy: sortBy.value,
  //   category: selectedCategory.value,
  //   tags: selectedTags.value,
  //   keyword: searchKeyword.value
  // }
  
  // 模拟数据
  setTimeout(() => {
    articles.value = [
      {
        id: 1,
        title: '构建高性能 Web 应用的最佳实践',
        summary: '本文探讨了提升 Web 应用性能的关键策略。',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        authorName: '张三',
        authorAvatar: 'https://i.pravatar.cc/150?img=1',
        categoryName: '前端开发',
        tags: [{ id: 1, name: 'JavaScript' }],
        viewCount: 1245,
        likeCount: 87,
        commentCount: 23,
        createdAt: '2024-11-05T10:00:00Z'
      }
    ]
    totalCount.value = 50
    loading.value = false
  }, 500)
}

// 监听排序变化
watch(sortBy, () => {
  currentPage.value = 1
  loadArticles()
})

// 从URL读取查询参数
onMounted(() => {
  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword as string
  }
  if (route.query.category) {
    selectedCategory.value = Number(route.query.category)
  }
  if (route.query.tag) {
    selectedTags.value = [Number(route.query.tag)]
  }
  loadArticles()
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