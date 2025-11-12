<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">分类管理</h1>
      <el-button type="primary" @click="showDialog = true">
        <i class="fas fa-plus mr-2"></i>添加分类
      </el-button>
    </div>

    <!-- 分类列表 -->
    <div class="bg-white rounded-xl shadow-sm border">
      <el-table :data="categories">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图标" width="80">
          <template #default="{ row }">
            <i :class="row.icon" class="text-2xl text-blue-500"></i>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="150" />
        <el-table-column prop="description" label="描述" min-width="300" />
        <el-table-column prop="articleCount" label="文章数" width="100" />
        <el-table-column label="排序" width="100">
          <template #default="{ row }">
            <el-input-number v-model="row.sortOrder" :min="0" size="small" />
          </template>
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
    <el-dialog v-model="showDialog" :title="editId ? '编辑分类' : '添加分类'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="如: fas fa-code" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
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

const showDialog = ref(false)
const editId = ref<number | null>(null)

const form = reactive({
  name: '',
  icon: '',
  description: ''
})

const categories = ref([
  { id: 1, name: '前端开发', icon: 'fab fa-html5', description: 'HTML、CSS、JavaScript等', articleCount: 45, sortOrder: 1 },
  { id: 2, name: '后端开发', icon: 'fas fa-server', description: 'Java、Python、Node.js等', articleCount: 38, sortOrder: 2 }
])

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