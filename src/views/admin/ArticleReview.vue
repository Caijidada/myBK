<template>
  <div class="p-6">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">文章审核</h1>
      <p class="text-gray-600 mt-1">审核用户提交的文章内容</p>
    </div>

    <!-- 待审核文章列表 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <el-table :data="articles" style="width: 100%" v-loading="loading">
        <el-table-column label="文章" min-width="300">
          <template #default="{ row }">
            <div class="flex items-center space-x-3">
              <img
                v-if="row.coverImage"
                :src="row.coverImage"
                :alt="row.title"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div v-else class="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                <i class="fas fa-image text-gray-400"></i>
              </div>
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
                v-if="row.authorAvatar"
                :src="row.authorAvatar"
                :alt="row.authorName"
                class="w-8 h-8 rounded-full"
              />
              <div v-else class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                {{ row.authorName?.charAt(0) || 'U' }}
              </div>
              <span class="text-sm">{{ row.authorName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.categoryName" size="small">{{ row.categoryName }}</el-tag>
            <span v-else class="text-gray-400">无分类</span>
          </template>
        </el-table-column>

        <el-table-column label="提交时间" width="180">
          <template #default="{ row }">
            <div class="text-sm text-gray-600">
              <i class="far fa-clock mr-1"></i>
              {{ formatDate(row.createdAt) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="flex space-x-2">
              <el-button
                type="success"
                size="small"
                @click="handleApprove(row)"
              >
                <i class="fas fa-check mr-1"></i>
                批准
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleReject(row)"
              >
                <i class="fas fa-times mr-1"></i>
                拒绝
              </el-button>
              <el-button
                type="info"
                size="small"
                @click="handlePreview(row)"
              >
                <i class="fas fa-eye mr-1"></i>
                预览
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-center items-center py-4 border-t border-gray-200">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="fetchArticles"
          @size-change="fetchArticles"
        />
      </div>
    </div>

    <!-- 拒绝文章对话框 -->
    <el-dialog
      v-model="rejectDialog.visible"
      title="拒绝文章"
      width="500px"
    >
      <el-form :model="rejectDialog.form" label-width="80px">
        <el-form-item label="拒绝原因">
          <el-input
            v-model="rejectDialog.form.note"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因，将通知作者..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialog.visible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject" :loading="rejectDialog.loading">
          确认拒绝
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

interface Article {
  id: number
  title: string
  summary: string
  coverImage?: string
  authorName: string
  authorAvatar?: string
  categoryName?: string
  createdAt: string
}

const loading = ref(false)
const articles = ref<Article[]>([])
const pagination = ref({
  page: 1,
  size: 10,
  total: 0
})

const rejectDialog = ref({
  visible: false,
  loading: false,
  articleId: null as number | null,
  form: {
    note: ''
  }
})

// 获取待审核文章列表
const fetchArticles = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/admin/articles/pending', {
      params: {
        page: pagination.value.page,
        size: pagination.value.size
      }
    })

    if (response.data.code === 200) {
      articles.value = response.data.data.records
      pagination.value.total = response.data.data.total
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '获取待审核文章失败')
  } finally {
    loading.value = false
  }
}

// 批准文章
const handleApprove = async (article: Article) => {
  try {
    await ElMessageBox.confirm(
      `确认批准文章"${article.title}"吗？`,
      '批准文章',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }
    )

    const response = await axios.post(`/api/admin/articles/${article.id}/review`, {
      action: 'APPROVE',
      note: ''
    })

    if (response.data.code === 200) {
      ElMessage.success('文章已批准')
      fetchArticles()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '批准失败')
    }
  }
}

// 拒绝文章
const handleReject = (article: Article) => {
  rejectDialog.value.articleId = article.id
  rejectDialog.value.form.note = ''
  rejectDialog.value.visible = true
}

// 确认拒绝
const confirmReject = async () => {
  if (!rejectDialog.value.form.note.trim()) {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  rejectDialog.value.loading = true
  try {
    const response = await axios.post(
      `/api/admin/articles/${rejectDialog.value.articleId}/review`,
      {
        action: 'REJECT',
        note: rejectDialog.value.form.note
      }
    )

    if (response.data.code === 200) {
      ElMessage.success('文章已拒绝')
      rejectDialog.value.visible = false
      fetchArticles()
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '拒绝失败')
  } finally {
    rejectDialog.value.loading = false
  }
}

// 预览文章
const handlePreview = (article: Article) => {
  window.open(`/article/${article.id}`, '_blank')
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '-'
  const d = new Date(date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 604800) return `${Math.floor(diff / 86400)}天前`

  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>
