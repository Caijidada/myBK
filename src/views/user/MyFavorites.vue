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
              <div class="text-2xl font-bold text-yellow-600">{{ favorites.length }}</div>
              <div class="text-sm text-gray-500">收藏文章</div>
            </div>
          </div>

          <!-- 右侧：搜索和排序 -->
          <div class="flex items-center space-x-3">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索收藏..."
              class="w-64"
              clearable
            >
              <template #prefix>
                <i class="fas fa-search text-gray-400"></i>
              </template>
            </el-input>
            
            <el-select v-model="sortBy" placeholder="排序" class="w-40">
              <el-option label="收藏时间" value="time" />
              <el-option label="文章热度" value="hot" />
            </el-select>

            <el-button
              v-if="selectedIds.length > 0"
              type="danger"
              @click="handleBatchDelete"
            >
              <i class="fas fa-trash mr-2"></i>
              批量删除 ({{ selectedIds.length }})
            </el-button>
          </div>
        </div>
      </div>

      <!-- 收藏列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filteredFavorites"
          :key="item.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden group relative"
        >
          <!-- 选择框 -->
          <el-checkbox
            v-model="selectedIds"
            :label="item.id"
            class="absolute top-4 left-4 z-10"
          >
          </el-checkbox>

          <!-- 封面图 -->
          <div class="relative h-48 overflow-hidden cursor-pointer" @click="goToArticle(item.article.id)">
            <img
              :src="item.article.coverImage"
              :alt="item.article.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <!-- 收藏时间标签 -->
            <div class="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
              {{ formatDate(item.createdAt) }}
            </div>
          </div>

          <!-- 内容 -->
          <div class="p-6">
            <!-- 分类 -->
            <span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
              {{ item.article.categoryName }}
            </span>

            <!-- 标题 -->
            <h3
              @click="goToArticle(item.article.id)"
              class="text-lg font-bold text-gray-900 mt-3 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2"
            >
              {{ item.article.title }}
            </h3>

            <!-- 摘要 -->
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
              {{ item.article.summary }}
            </p>

            <!-- 作者信息 -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-2">
                <img
                  :src="item.article.authorAvatar"
                  :alt="item.article.authorName"
                  class="w-6 h-6 rounded-full"
                />
                <span class="text-sm text-gray-600">{{ item.article.authorName }}</span>
              </div>

              <!-- 取消收藏按钮 -->
              <button
                @click="handleUnfavorite(item.id)"
                class="text-yellow-500 hover:text-red-500 transition-colors"
                title="取消收藏"
              >
                <i class="fas fa-star text-lg"></i>
              </button>
            </div>

            <!-- 统计数据 -->
            <div class="flex items-center space-x-4 mt-3 text-xs text-gray-500">
              <span><i class="far fa-eye mr-1"></i>{{ item.article.viewCount }}</span>
              <span><i class="far fa-thumbs-up mr-1"></i>{{ item.article.likeCount }}</span>
              <span><i class="far fa-comment mr-1"></i>{{ item.article.commentCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredFavorites.length === 0" class="text-center py-20">
        <i class="fas fa-star text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg mb-6">
          {{ searchKeyword ? '没有找到相关收藏' : '还没有收藏任何文章' }}
        </p>
        <router-link to="/articles" v-if="!searchKeyword">
          <el-button type="primary" size="large">
            <i class="fas fa-compass mr-2"></i>
            去发现好文章
          </el-button>
        </router-link>
      </div>

      <!-- 分页 -->
      <div v-if="filteredFavorites.length > 0" class="mt-8">
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
import { ElMessage, ElMessageBox } from 'element-plus'
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
const sortBy = ref('time')
const currentPage = ref(1)
const pageSize = ref(9)
const totalCount = ref(0)
const selectedIds = ref<number[]>([])

// 收藏列表
const favorites = ref([
  {
    id: 1,
    article: {
      id: 1,
      title: 'Vue 3 Composition API 完全指南',
      summary: '深入理解 Vue 3 的新特性和设计理念',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80',
      categoryName: '前端开发',
      authorName: '张三',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      viewCount: 1245,
      likeCount: 87,
      commentCount: 23
    },
    createdAt: '2024-11-05T10:00:00Z'
  },
  {
    id: 2,
    article: {
      id: 2,
      title: 'TypeScript 高级技巧与实践',
      summary: '掌握 TypeScript 的高级特性和最佳实践',
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80',
      categoryName: '编程语言',
      authorName: '李四',
      authorAvatar: 'https://i.pravatar.cc/150?img=2',
      viewCount: 987,
      likeCount: 65,
      commentCount: 18
    },
    createdAt: '2024-11-03T10:00:00Z'
  },
  {
    id: 3,
    article: {
      id: 3,
      title: 'Docker 容器化部署实战',
      summary: '从入门到精通 Docker 容器化技术',
      coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&q=80',
      categoryName: 'DevOps',
      authorName: '王五',
      authorAvatar: 'https://i.pravatar.cc/150?img=3',
      viewCount: 1567,
      likeCount: 102,
      commentCount: 31
    },
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 4,
    article: {
      id: 4,
      title: 'React Hooks 深入浅出',
      summary: '全面理解 React Hooks 的工作原理',
      coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&q=80',
      categoryName: '前端开发',
      authorName: '赵六',
      authorAvatar: 'https://i.pravatar.cc/150?img=4',
      viewCount: 876,
      likeCount: 54,
      commentCount: 12
    },
    createdAt: '2024-10-30T10:00:00Z'
  },
  {
    id: 5,
    article: {
      id: 5,
      title: 'Kubernetes 生产环境实践',
      summary: 'K8s 集群管理和运维最佳实践',
      coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&q=80',
      categoryName: 'DevOps',
      authorName: '孙七',
      authorAvatar: 'https://i.pravatar.cc/150?img=5',
      viewCount: 2103,
      likeCount: 145,
      commentCount: 42
    },
    createdAt: '2024-10-28T10:00:00Z'
  },
  {
    id: 6,
    article: {
      id: 6,
      title: 'MySQL 性能优化实战',
      summary: '数据库性能调优的技巧和方法',
      coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&q=80',
      categoryName: '数据库',
      authorName: '周八',
      authorAvatar: 'https://i.pravatar.cc/150?img=6',
      viewCount: 1342,
      likeCount: 98,
      commentCount: 27
    },
    createdAt: '2024-10-25T10:00:00Z'
  }
])

// 过滤和排序
const filteredFavorites = computed(() => {
  let result = favorites.value

  // 搜索过滤
  if (searchKeyword.value) {
    result = result.filter(item =>
      item.article.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  // 排序
  if (sortBy.value === 'time') {
    result = [...result].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } else if (sortBy.value === 'hot') {
    result = [...result].sort((a, b) =>
      (b.article.viewCount + b.article.likeCount) - (a.article.viewCount + a.article.likeCount)
    )
  }

  totalCount.value = result.length
  return result
})

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).fromNow()
}

// 跳转到文章详情
const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

// 取消收藏
const handleUnfavorite = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要取消收藏吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用取消收藏API
    const index = favorites.value.findIndex(item => item.id === id)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }

    ElMessage.success('已取消收藏')
  } catch {
    // 用户取消操作
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) return

  try {
    await ElMessageBox.confirm(`确定要取消收藏选中的 ${selectedIds.value.length} 篇文章吗？`, '批量操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用批量取消收藏API
    favorites.value = favorites.value.filter(item => !selectedIds.value.includes(item.id))
    selectedIds.value = []

    ElMessage.success('批量取消收藏成功')
  } catch {
    // 用户取消操作
  }
}

// 分页变化
const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.el-checkbox) {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4px;
  border-radius: 4px;
}
</style>