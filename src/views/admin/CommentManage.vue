<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">评论管理</h1>

    <!-- 搜索栏 -->
    <div class="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div class="flex gap-4">
        <el-input v-model="searchKeyword" placeholder="搜索评论内容..." clearable class="flex-1">
          <template #prefix><i class="fas fa-search"></i></template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="状态" class="w-32">
          <el-option label="全部" value="" />
          <el-option label="正常" value="normal" />
          <el-option label="已删除" value="deleted" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="bg-white rounded-xl shadow-sm border">
      <el-table :data="comments" v-loading="loading">
        <el-table-column label="评论内容" min-width="300">
          <template #default="{ row }">
            <div>
              <p class="text-gray-900 mb-2">{{ row.content }}</p>
              <p class="text-sm text-gray-500">
                文章: <span class="text-blue-600">{{ row.articleTitle }}</span>
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="用户" width="150">
          <template #default="{ row }">
            <div class="flex items-center space-x-2">
              <img :src="row.userAvatar" class="w-8 h-8 rounded-full" />
              <span>{{ row.userName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="点赞数" width="100">
          <template #default="{ row }">
            <span><i class="far fa-thumbs-up mr-1"></i>{{ row.likeCount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>

        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleView(row)">查看</el-button>
            <el-popconfirm title="确定删除？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button size="small" type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="p-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalCount"
          layout="total, prev, pager, next"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(100)

const comments = ref([
  {
    id: 1,
    content: '这篇文章写得很好，学到了很多！',
    articleTitle: 'Vue 3 Composition API 完全指南',
    userName: '张三',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    likeCount: 15,
    createdAt: '2024-11-05T10:00:00Z'
  }
])

const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm')
const handleSearch = () => console.log('搜索')
const handleView = (row: any) => window.open(`/article/${row.articleId}`, '_blank')
const handleDelete = (row: any) => ElMessage.success('删除成功')
</script>