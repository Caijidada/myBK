<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部（简约白色） -->
    <div class="bg-white border-b border-gray-200 py-12">
      <div class="max-w-7xl mx-auto px-8 text-center">
        <h1 class="text-4xl font-bold mb-3 text-gray-800">文章分类</h1>
        <p class="text-lg text-gray-600">
          探索不同领域的知识，找到你感兴趣的内容
        </p>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="max-w-7xl mx-auto px-8 py-12">
      <!-- 统计信息 -->
      <div class="mb-8 flex items-center justify-between">
        <div class="text-gray-600 whitespace-nowrap">
          共 <span class="font-medium text-blue-600">{{ categories.length }}</span> 个分类
        </div>
        
        <!-- 排序选择 -->
        <el-select v-model="sortBy" placeholder="排序方式" class="w-41 max-w-40">
          <el-option label="按文章数排序" value="articleCount" />
          <el-option label="按名称排序" value="name" />
          <el-option label="按创建时间" value="createTime" />
        </el-select>
      </div>

      <!-- 分类网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="category in sortedCategories"
          :key="category.id"
          @click="goToCategory(category.id)"
          class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
        >
          <!-- 顶部装饰条 -->
          <div :class="['h-2', getCategoryColor(category.id)]"></div>
          
          <div class="p-6">
            <!-- 图标和名称 -->
            <div class="flex items-center justify-between mb-4">
              <div
                :class="[
                  'w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110',
                  getCategoryBgColor(category.id)
                ]"
              >
                <i :class="[category.icon, 'text-2xl', getCategoryIconColor(category.id)]"></i>
              </div>
              
              <!-- 文章数量徽章 -->
              <div class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                {{ category.articleCount }}
              </div>
            </div>

            <!-- 分类名称 -->
            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {{ category.name }}
            </h3>

            <!-- 描述 -->
            <p class="text-gray-600 text-sm line-clamp-2 mb-4">
              {{ category.description }}
            </p>

            <!-- 底部信息 -->
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ category.articleCount }} 篇文章</span>
              <span class="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 font-medium">
                查看更多 <i class="fas fa-arrow-right ml-1"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="categories.length === 0" class="text-center py-20">
        <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">暂无分类</p>
      </div>
    </div>

    <!-- 热门分类统计 -->
    <div class="bg-white py-16 mt-12">
      <div class="max-w-7xl mx-auto px-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">热门分类</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- 文章数量排行 -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-fire text-red-500 mr-2"></i>
              文章数量排行
            </h3>
            <div class="space-y-3">
              <div
                v-for="(category, index) in topCategories"
                :key="category.id"
                @click="goToCategory(category.id)"
                class="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div class="flex items-center space-x-3">
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                      index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                    ]"
                  >
                    {{ index + 1 }}
                  </div>
                  <div>
                    <div class="font-medium text-gray-800">{{ category.name }}</div>
                    <div class="text-xs text-gray-500">{{ category.description }}</div>
                  </div>
                </div>
                <div class="text-blue-600 font-bold">{{ category.articleCount }}</div>
              </div>
            </div>
          </div>

          <!-- 分类分布图表 -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-chart-pie text-blue-500 mr-2"></i>
              分类分布
            </h3>
            <div ref="chartRef" class="h-64"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getCategoryList } from '@/api/category'
import type { Category } from '@/types'

const router = useRouter()

// 状态
const loading = ref(false)
const sortBy = ref('articleCount')
const chartRef = ref<HTMLElement | null>(null)

// 分类数据
const categories = ref<Category[]>([])

// 颜色方案
const colorSchemes = [
  { bg: 'bg-blue-100', icon: 'text-blue-500', bar: 'bg-blue-500' },
  { bg: 'bg-green-100', icon: 'text-green-500', bar: 'bg-green-500' },
  { bg: 'bg-purple-100', icon: 'text-purple-500', bar: 'bg-purple-500' },
  { bg: 'bg-orange-100', icon: 'text-orange-500', bar: 'bg-orange-500' },
  { bg: 'bg-pink-100', icon: 'text-pink-500', bar: 'bg-pink-500' },
  { bg: 'bg-indigo-100', icon: 'text-indigo-500', bar: 'bg-indigo-500' },
  { bg: 'bg-red-100', icon: 'text-red-500', bar: 'bg-red-500' },
  { bg: 'bg-yellow-100', icon: 'text-yellow-500', bar: 'bg-yellow-500' }
]

// 计算属性
const sortedCategories = computed(() => {
  const sorted = [...categories.value]

  switch (sortBy.value) {
    case 'articleCount':
      return sorted.sort((a, b) => b.articleCount - a.articleCount)
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'createTime':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    default:
      return sorted
  }
})

const topCategories = computed(() => {
  return [...categories.value]
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 5)
})

// 获取颜色
const getCategoryColor = (id: number) => {
  const index = (id - 1) % colorSchemes.length
  return colorSchemes[index]?.bar ?? 'bg-gray-300'
}

const getCategoryBgColor = (id: number) => {
  const index = (id - 1) % colorSchemes.length
  return colorSchemes[index]?.bg ?? 'bg-gray-100'
}

const getCategoryIconColor = (id: number) => {
  const index = (id - 1) % colorSchemes.length
  return colorSchemes[index]?.icon ?? 'text-gray-400'
}
// 跳转到分类
const goToCategory = (id: number) => {
  router.push(`/articles?categoryId=${id}`)
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  const chart = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      show: false
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: categories.value.map(cat => ({
          name: cat.name,
          value: cat.articleCount
        }))
      }
    ],
    color: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16']
  }
  
  chart.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 加载分类列表
const loadCategories = async () => {
  try {
    loading.value = true
    const response = await getCategoryList()
    categories.value = response.data
  } catch (error: any) {
    ElMessage.error(error.message || '加载分类列表失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载
onMounted(async () => {
  await loadCategories()
  initChart()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>