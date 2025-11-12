<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 用户中心导航 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-8 py-4">
          <router-link
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              isActive(tab.path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <i :class="[tab.icon, 'mr-2']"></i>
            {{ tab.label }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 工具栏 -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <!-- 左侧：统计 -->
          <div class="flex items-center space-x-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ stats.total }}</div>
              <div class="text-sm text-gray-500">全部</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ stats.published }}</div>
              <div class="text-sm text-gray-500">已发布</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-600">{{ stats.draft }}</div>
              <div class="text-sm text-gray-500">草稿</div>
            </div>
          </div>

          <!-- 右侧：操作 -->
          <div class="flex items-center space-x-3">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索文章..."
              class="w-64"
              clearable
            >
              <template #prefix>
                <i class="fas fa-search text-gray-400"></i>
              </template>
            </el-input>
            
            <el-select v-model="filterStatus" placeholder="状态" class="w-32">
              <el-option label="全部" value="all" />
              <el-option label="已发布" value="published" />
              <el-option label="草稿" value="draft" />
            </el-select>

            <router-link to="/editor">
              <el-button type="primary">
                <i class="fas fa-plus mr-2"></i>
                写文章
              </el-button>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="space-y-4">
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          <div class="flex">
            <!-- 封面图 -->
            <div class="w-48 h-32 flex-shrink-0">
              <img
                :src="article.coverImage"
                :alt="article.title"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- 内容 -->
            <div class="flex-1 p-6 flex flex-col justify-between">
              <div>
                <!-- 标题和状态 -->
                <div class="flex items-start justify-between mb-2">
                  <h3
                    @click="goToArticle(article.id)"
                    class="text-lg font-bold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-1 flex-1"
                  >
                    {{ article.title }}
                  </h3>
                  <span
                    :class="[
                      'ml-4 px-3 py-1 text-xs rounded-full font-medium flex-shrink-0',
                      article.isPublished
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    ]"
                  >
                    {{ article.isPublished ? '已发布' : '草稿' }}
                  </span>
                </div>

                <!-- 摘要 -->
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                  {{ article.summary }}
                </p>

                <!-- 标签 -->
                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="tag in article.tags.slice(0, 3)"
                    :key="tag.id"
                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    #{{ tag.name }}
                  </span>
                </div>
              </div>

              <!-- 底部信息和操作 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ formatDate(article.createdAt) }}</span>
                  <span><i class="far fa-eye mr-1"></i>{{ article.viewCount }}</span>
                  <span><i class="far fa-thumbs-up mr-1"></i>{{ article.likeCount }}</span>
                  <span><i class="far fa-comment mr-1"></i>{{ article.commentCount }}</span>
                </div>

                <!-- 操作按钮 -->
                <div class="flex items-center space-x-2">
                  <el-button
                    size="small"
                    @click="goToEditor(article.id)"
                  >
                    <i class="fas fa-edit mr-1"></i>
                    编辑
                  </el-button>
                  
                  <el-button
                    v-if="!article.isPublished"
                    size="small"
                    type="success"
                    @click="handlePublish(article.id)"
                  >
                    <i class="fas fa-paper-plane mr-1"></i>
                    发布
                  </el-button>
                  
                  <el-button
                    v-else
                    size="small"
                    @click="handleUnpublish(article.id)"
                  >
                    <i class="fas fa-archive mr-1"></i>
                    下架
                  </el-button>

                  <el-popconfirm
                    title="确定删除这篇文章吗？"
                    @confirm="handleDelete(article.id)"
                  >
                    <template #reference>
                      <el-button
                        size="small"
                        type="danger"
                      >
                        <i class="fas fa-trash mr-1"></i>
                        删除
                      </el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredArticles.length === 0" class="text-center py-20">
        <i class="fas fa-file-alt text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg mb-6">还没有文章</p>
        <router-link to="/editor">
          <el-button type="primary" size="large">
            <i class="fas fa-plus mr-2"></i>
            创作第一篇文章
          </el-button>
        </router-link>
      </div>

      <!-- 分页 -->
      <div v-if="filteredArticles.length > 0" class="mt-8">
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/common/Pagination.vue'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

// 标签页
const tabs = [
  { label: '个人资料', path: '/user/profile', icon: 'fas fa-user' },
  { label: '我的文章', path: '/user/articles', icon: 'fas fa-file-alt' },
  { label: '我的收藏', path: '/user/favorites', icon: 'fas fa-star' },
  { label: '账号设置', path: '/user/settings', icon: 'fas fa-cog' }
]

const isActive = (path: string) => route.path === path

// 筛选条件
const searchKeyword = ref('')
const filterStatus = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 统计数据
const stats = ref({
  total: 23,
  published: 18,
  draft: 5
})

// 文章列表
const articles = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 实战指南',
    summary: '全面解析 Vue 3 新一代组合式 API 的设计理念与实践应用',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80',
    tags: [{ id: 1, name: 'Vue' }, { id: 2, name: 'JavaScript' }],
    isPublished: true,
    viewCount: 1245,
    likeCount: 87,
    commentCount: 23,
    createdAt: '2024-11-05T10:00:00Z'
  },
  {
    id: 2,
    title: 'TypeScript 高级技巧与实践',
    summary: '深入理解 TypeScript 的类型系统和高级特性',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80',
    tags: [{ id: 3, name: 'TypeScript' }],
    isPublished: false,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    createdAt: '2024-11-03T10:00:00Z'
  },
  {
    id: 3,
    title: 'Docker 容器化部署完整指南',
    summary: '从基础到实战，掌握 Docker 容器化技术',
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&q=80',
    tags: [{ id: 4, name: 'Docker' }, { id: 5, name: 'DevOps' }],
    isPublished: true,
    viewCount: 987,
    likeCount: 65,
    commentCount: 18,
    createdAt: '2024-11-01T10:00:00Z'
  }
])

// 过滤文章
const filteredArticles = computed(() => {
  let result = articles.value

  // 状态筛选
  if (filterStatus.value === 'published') {
    result = result.filter(a => a.isPublished)
  } else if (filterStatus.value === 'draft') {
    result = result.filter(a => !a.isPublished)
  }

  // 关键词搜索
  if (searchKeyword.value) {
    result = result.filter(a =>
      a.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  totalCount.value = result.length
  return result
})

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 跳转到文章详情
const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

// 跳转到编辑器
const goToEditor = (id: number) => {
  router.push(`/editor?id=${id}`)
}

// 发布文章
const handlePublish = async (id: number) => {
  try {
    // TODO: 调用发布API
    const article = articles.value.find(a => a.id === id)
    if (article) {
      article.isPublished = true
      stats.value.published++
      stats.value.draft--
    }
    ElMessage.success('发布成功')
  } catch (error: any) {
    ElMessage.error(error.message || '发布失败')
  }
}

// 下架文章
const handleUnpublish = async (id: number) => {
  try {
    // TODO: 调用下架API
    const article = articles.value.find(a => a.id === id)
    if (article) {
      article.isPublished = false
      stats.value.published--
      stats.value.draft++
    }
    ElMessage.success('已下架')
  } catch (error: any) {
    ElMessage.error(error.message || '下架失败')
  }
}

// 删除文章
const handleDelete = async (id: number) => {
  try {
    // TODO: 调用删除API
    const index = articles.value.findIndex(a => a.id === id)
    if (index > -1) {
      const article = articles.value[index]
      articles.value.splice(index, 1)
      stats.value.total--
      if (article.isPublished) {
        stats.value.published--
      } else {
        stats.value.draft--
      }
    }
    ElMessage.success('删除成功')
  } catch (error: any) {
    ElMessage.error(error.message || '删除失败')
  }
}

// 分页变化
const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  // TODO: 重新加载数据
}
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