<template>
  <div class="p-6">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">文章管理</h1>
      <p class="text-gray-600 mt-1">管理所有用户发布的文章内容</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索文章标题或作者..."
          clearable
          class="flex-1"
        >
          <template #prefix>
            <i class="fas fa-search text-gray-400"></i>
          </template>
        </el-input>

        <el-select v-model="searchForm.status" placeholder="文章状态" clearable class="w-40">
          <el-option label="全部" value="" />
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
          <el-option label="待审核" value="pending" />
        </el-select>

        <el-select v-model="searchForm.categoryId" placeholder="分类" clearable class="w-40">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>

        <el-button type="primary" @click="handleSearch">
          <i class="fas fa-search mr-2"></i>
          搜索
        </el-button>
        <el-button @click="handleReset">
          <i class="fas fa-redo mr-2"></i>
          重置
        </el-button>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <el-table :data="articles" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="文章" min-width="300">
          <template #default="{ row }">
            <div class="flex items-center space-x-3">
              <img
                :src="row.coverImage"
                :alt="row.title"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 truncate">{{ row.title }}</h4>
                <p class="text-sm text-gray-500 truncate">{{ row.summary }}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="作者" width="120">
          <template #default="{ row }">
            <div class="flex items-center space-x-2">
              <img
                :src="row.authorAvatar"
                :alt="row.authorName"
                class="w-8 h-8 rounded-full"
              />
              <span class="text-sm">{{ row.authorName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.categoryName }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.status)"
              size="small"
            >
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="数据" width="180">
          <template #default="{ row }">
            <div class="text-sm text-gray-600 space-y-1">
              <div><i class="far fa-eye mr-1"></i>{{ row.viewCount }}</div>
              <div><i class="far fa-thumbs-up mr-1"></i>{{ row.likeCount }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="发布时间" width="180">
          <template #default="{ row }">
            <div class="text-sm text-gray-600">
              {{ formatDate(row.createdAt) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center space-x-2">
              <el-button
                size="small"
                type="primary"
                link
                @click="handleView(row)"
              >
                查看
              </el-button>
              <el-button
                v-if="row.status === 'pending'"
                size="small"
                type="success"
                link
                @click="handleApprove(row)"
              >
                通过
              </el-button>
              <el-button
                size="small"
                type="warning"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-popconfirm
                title="确定删除这篇文章吗？"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button size="small" type="danger" link>
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="p-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()

// 状态
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  categoryId: null as number | null
})

// 分类数据
const categories = ref([
  { id: 1, name: '前端开发' },
  { id: 2, name: '后端开发' },
  { id: 3, name: '移动开发' }
])

// 文章数据
const articles = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 完全指南',
    summary: '深入理解 Vue 3 的新特性',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=80',
    authorName: '张三',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    categoryName: '前端开发',
    status: 'published',
    viewCount: 1245,
    likeCount: 87,
    createdAt: '2024-11-05T10:00:00Z'
  },
  {
    id: 2,
    title: 'TypeScript 高级技巧',
    summary: '掌握 TypeScript 进阶特性',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200&q=80',
    authorName: '李四',
    authorAvatar: 'https://i.pravatar.cc/150?img=2',
    categoryName: '编程语言',
    status: 'pending',
    viewCount: 987,
    likeCount: 65,
    createdAt: '2024-11-03T10:00:00Z'
  }
])

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    published: 'success',
    pending: 'warning',
    draft: 'info'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    published: '已发布',
    pending: '待审核',
    draft: '草稿'
  }
  return texts[status] || '未知'
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadArticles()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.categoryId = null
  currentPage.value = 1
  loadArticles()
}

// 查看
const handleView = (row: any) => {
  window.open(`/article/${row.id}`, '_blank')
}

// 审核通过
const handleApprove = async (row: any) => {
  try {
    // TODO: 调用审核API
    ElMessage.success('审核通过')
    loadArticles()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/editor?id=${row.id}`)
}

// 删除
const handleDelete = async (row: any) => {
  try {
    // TODO: 调用删除API
    ElMessage.success('删除成功')
    loadArticles()
  } catch (error: any) {
    ElMessage.error(error.message || '删除失败')
  }
}

// 分页变化
const handlePageChange = () => {
  loadArticles()
}

// 加载文章列表
const loadArticles = async () => {
  loading.value = true
  try {
    // TODO: 调用API
    await new Promise(resolve => setTimeout(resolve, 500))
    totalCount.value = 50
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载
onMounted(() => {
  loadArticles()
})
</script>