<template>
  <div class="pagination-wrapper flex flex-col sm:flex-row items-center justify-between gap-4">
    <!-- 左侧：总数信息 -->
    <div v-if="showTotal" class="text-sm text-gray-600">
      共 <span class="font-medium text-blue-600">{{ total }}</span> 条数据
    </div>

    <!-- 中间：分页按钮 -->
    <div class="flex items-center space-x-2">
      <!-- 上一页 -->
      <button
        @click="handlePrevious"
        :disabled="currentPage === 1"
        :class="[
          'px-3 py-2 rounded-lg border transition-all',
          currentPage === 1
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
        ]"
      >
        <i class="fas fa-chevron-left text-xs"></i>
      </button>

      <!-- 首页 -->
      <button
        v-if="showFirstLast"
        @click="handlePageChange(1)"
        :class="getPageButtonClass(1)"
      >
        1
      </button>

      <!-- 左省略号 -->
      <span v-if="showLeftEllipsis" class="px-2 text-gray-400">...</span>

      <!-- 页码按钮 -->
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="handlePageChange(page)"
        :class="getPageButtonClass(page)"
      >
        {{ page }}
      </button>

      <!-- 右省略号 -->
      <span v-if="showRightEllipsis" class="px-2 text-gray-400">...</span>

      <!-- 末页 -->
      <button
        v-if="showFirstLast"
        @click="handlePageChange(totalPages)"
        :class="getPageButtonClass(totalPages)"
      >
        {{ totalPages }}
      </button>

      <!-- 下一页 -->
      <button
        @click="handleNext"
        :disabled="currentPage === totalPages"
        :class="[
          'px-3 py-2 rounded-lg border transition-all',
          currentPage === totalPages
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
        ]"
      >
        <i class="fas fa-chevron-right text-xs"></i>
      </button>
    </div>

    <!-- 右侧：页码跳转和每页数量 -->
    <div class="flex items-center space-x-4">
      <!-- 每页数量选择 -->
      <div v-if="showSizeChanger" class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">每页</span>
        <select
          v-model="localPageSize"
          @change="handleSizeChange"
          class="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
        <span class="text-sm text-gray-600">条</span>
      </div>

      <!-- 快速跳转 -->
      <div v-if="showQuickJumper" class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">跳至</span>
        <input
          v-model.number="jumpPage"
          @keyup.enter="handleJump"
          type="number"
          min="1"
          :max="totalPages"
          class="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <span class="text-sm text-gray-600">页</span>
        <button
          @click="handleJump"
          class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  total: number
  currentPage?: number
  pageSize?: number
  pageSizeOptions?: number[]
  showTotal?: boolean
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  maxVisiblePages?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  pageSize: 10,
  pageSizeOptions: () => [10, 20, 30, 50],
  showTotal: true,
  showSizeChanger: true,
  showQuickJumper: true,
  maxVisiblePages: 7
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
  'change': [page: number, size: number]
}>()

const localPageSize = ref(props.pageSize)
const jumpPage = ref<number | null>(null)

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(props.total / localPageSize.value)
})

// 是否显示首页/末页
const showFirstLast = computed(() => {
  return totalPages.value > props.maxVisiblePages
})

// 可见的页码
const visiblePages = computed(() => {
  const pages: number[] = []
  const current = props.currentPage
  const max = props.maxVisiblePages
  
  if (totalPages.value <= max) {
    // 总页数小于最大显示数，显示所有页码
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于最大显示数，智能显示
    const half = Math.floor(max / 2)
    let start = Math.max(2, current - half)
    let end = Math.min(totalPages.value - 1, current + half)
    
    if (current <= half + 1) {
      end = max - 1
    } else if (current >= totalPages.value - half) {
      start = totalPages.value - max + 2
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// 是否显示左侧省略号
const showLeftEllipsis = computed(() => {
  return showFirstLast.value && visiblePages.value[0] > 2
})

// 是否显示右侧省略号
const showRightEllipsis = computed(() => {
  return showFirstLast.value && visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1
})

// 获取页码按钮样式
const getPageButtonClass = (page: number) => {
  const isActive = page === props.currentPage
  return [
    'min-w-[40px] px-3 py-2 rounded-lg border transition-all',
    isActive
      ? 'bg-blue-500 text-white border-blue-500'
      : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
  ]
}

// 页码变化
const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('update:currentPage', page)
  emit('change', page, localPageSize.value)
}

// 上一页
const handlePrevious = () => {
  if (props.currentPage > 1) {
    handlePageChange(props.currentPage - 1)
  }
}

// 下一页
const handleNext = () => {
  if (props.currentPage < totalPages.value) {
    handlePageChange(props.currentPage + 1)
  }
}

// 每页数量变化
const handleSizeChange = () => {
  emit('update:pageSize', localPageSize.value)
  emit('update:currentPage', 1)
  emit('change', 1, localPageSize.value)
}

// 快速跳转
const handleJump = () => {
  if (jumpPage.value && jumpPage.value >= 1 && jumpPage.value <= totalPages.value) {
    handlePageChange(jumpPage.value)
    jumpPage.value = null
  }
}

// 监听 pageSize 变化
watch(() => props.pageSize, (newVal) => {
  localPageSize.value = newVal
})
</script>

<style scoped>
/* 移除数字输入框的上下箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>