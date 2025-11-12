<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">标签管理</h1>
      <el-button type="primary" @click="showDialog = true">
        <i class="fas fa-plus mr-2"></i>添加标签
      </el-button>
    </div>

    <!-- 标签列表 -->
    <div class="bg-white rounded-xl shadow-sm border">
      <el-table :data="tags">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="标签" width="200">
          <template #default="{ row }">
            <span
              class="px-3 py-1 rounded-full text-white font-medium"
              :style="{ backgroundColor: row.color }"
            >
              #{{ row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="articleCount" label="文章数" width="120" />
        <el-table-column label="颜色" width="150">
          <template #default="{ row }">
            <div class="flex items-center space-x-2">
              <span class="w-6 h-6 rounded border" :style="{ backgroundColor: row.color }"></span>
              <span class="text-sm text-gray-600">{{ row.color }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" type="warning" link @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button size="small" type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/编辑弹窗 -->
    <el-dialog v-model="showDialog" :title="editId ? '编辑标签' : '添加标签'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="form.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="标签颜色">
          <el-color-picker v-model="form.color" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const showDialog = ref(false)
const editId = ref<number | null>(null)

const form = reactive({
  name: '',
  color: '#3b82f6'
})

const tags = ref([
  { id: 1, name: 'JavaScript', color: '#F7DF1E', articleCount: 45, createdAt: '2024-01-15T10:00:00Z' },
  { id: 2, name: 'Vue', color: '#42B883', articleCount: 38, createdAt: '2024-01-20T10:00:00Z' }
])

const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD')
const handleEdit = (row: any) => {
  editId.value = row.id
  Object.assign(form, row)
  showDialog.value = true
}
const handleDelete = (row: any) => ElMessage.success('删除成功')
const handleSave = () => {
  showDialog.value = false
  ElMessage.success('保存成功')
}
</script>