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
                    v-for="tagName in article.tagNames?.slice(0, 3)"
                    :key="tagName"
                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    #{{ tagName }}
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/common/Pagination.vue'
import { getMyArticles, publishArticle, unpublishArticle, deleteArticle } from '@/api/article'
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
const loading = ref(false)

// 统计数据
const stats = ref({
  total: 0,
  published: 0,
  draft: 0
})

// 文章列表
const articles = ref<any[]>([])

// 加载文章列表
const loadArticles = async () => {
  try {
    loading.value = true
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }

    // 根据筛选状态传递参数
    if (filterStatus.value !== 'all') {
      params.status = filterStatus.value
    }

    const res = await getMyArticles(params)
    articles.value = res.data.records || []
    totalCount.value = res.data.total || 0

    // 计算统计数据（从后端返回的总数据）
    stats.value.total = res.data.total || 0
    stats.value.published = articles.value.filter((a: any) => a.isPublished).length
    stats.value.draft = articles.value.filter((a: any) => !a.isPublished).length

  } catch (error: any) {
    console.error('加载文章失败:', error)
    ElMessage.error(error.message || '加载文章失败')
    articles.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

// 过滤文章（仅用于关键词搜索）
const filteredArticles = computed(() => {
  let result = articles.value

  // 关键词搜索
  if (searchKeyword.value) {
    result = result.filter((a: any) =>
      a.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

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
    await publishArticle(id)
    ElMessage.success('发布成功')
    await loadArticles() // 重新加载数据
  } catch (error: any) {
    console.error('发布失败:', error)
    ElMessage.error(error.message || '发布失败')
  }
}

// 下架文章
const handleUnpublish = async (id: number) => {
  try {
    await unpublishArticle(id)
    ElMessage.success('已下架')
    await loadArticles() // 重新加载数据
  } catch (error: any) {
    console.error('下架失败:', error)
    ElMessage.error(error.message || '下架失败')
  }
}

// 删除文章
const handleDelete = async (id: number) => {
  try {
    await deleteArticle(id)
    ElMessage.success('删除成功')
    await loadArticles() // 重新加载数据
  } catch (error: any) {
    console.error('删除失败:', error)
    ElMessage.error(error.message || '删除失败')
  }
}

// 分页变化
const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  loadArticles()
}

// 监听筛选状态变化
watch(filterStatus, () => {
  currentPage.value = 1 // 重置页码
  loadArticles()
})

// 组件挂载时加载数据
onMounted(() => {
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