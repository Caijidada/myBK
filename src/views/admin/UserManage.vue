<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">用户管理</h1>

    <!-- 搜索栏 -->
    <div class="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div class="flex gap-4">
        <el-input v-model="searchKeyword" placeholder="搜索用户名或邮箱..." clearable class="flex-1">
          <template #prefix><i class="fas fa-search"></i></template>
        </el-input>
        <el-select v-model="filterRole" placeholder="角色" class="w-32">
          <el-option label="全部" value="" />
          <el-option label="用户" value="USER" />
          <el-option label="管理员" value="ADMIN" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" class="w-32">
          <el-option label="全部" value="" />
          <el-option label="正常" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="bg-white rounded-xl shadow-sm border">
      <el-table :data="users" v-loading="loading">
        <el-table-column label="用户" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center space-x-3">
              <img :src="row.avatar" class="w-10 h-10 rounded-full" />
              <div>
                <div class="font-medium text-gray-900">{{ row.nickname }}</div>
                <div class="text-sm text-gray-500">@{{ row.username }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱" width="200" />

        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'primary'" size="small">
              {{ row.role === 'ADMIN' ? '管理员' : '用户' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="注册时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button
              size="small"
              :type="row.status === 1 ? 'danger' : 'success'"
              link
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
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
const filterRole = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(100)

const users = ref([
  {
    id: 1,
    username: 'zhangsan',
    nickname: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'USER',
    status: 1,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    username: 'admin',
    nickname: '管理员',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'ADMIN',
    status: 1,
    createdAt: '2024-01-01T10:00:00Z'
  }
])

const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD')
const handleSearch = () => console.log('搜索')
const handleEdit = (row: any) => console.log('编辑', row)
const handleToggleStatus = (row: any) => {
  row.status = row.status === 1 ? 0 : 1
  ElMessage.success(row.status === 1 ? '已启用' : '已禁用')
}
const handleDelete = (row: any) => ElMessage.success('删除成功')
</script>