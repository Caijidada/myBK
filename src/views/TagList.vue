<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部（简约白色） -->
    <div class="bg-white border-b border-gray-200 py-12">
      <div class="max-w-7xl mx-auto px-8 text-center">
        <h1 class="text-4xl font-bold mb-3 text-gray-800">标签云</h1>
        <p class="text-lg text-gray-600">
          通过标签快速找到你感兴趣的文章
        </p>
      </div>
    </div>

    <!-- 标签内容 -->
    <div class="max-w-7xl mx-auto px-8 py-12">
      <!-- 工具栏 -->
      <div class="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <!-- 统计信息 -->
        <div class="text-gray-600">
          共 <span class="font-medium text-purple-600">{{ tags.length }}</span> 个标签，
          <span class="font-medium text-purple-600">{{ totalArticles }}</span> 篇文章
        </div>

        <!-- 工具按钮 -->
        <div class="flex items-center space-x-3">
          <!-- 搜索标签 -->
          <el-input
            v-model="searchKeyword"
            placeholder="搜索标签..."
            class="w-64"
            clearable
          >
            <template #prefix>
              <i class="fas fa-search text-gray-400"></i>
            </template>
          </el-input>

          <!-- 排序 -->
          <el-select v-model="sortBy" placeholder="排序方式" class="w-40">
            <el-option label="按热度" value="hot" />
            <el-option label="按名称" value="name" />
            <el-option label="按文章数" value="count" />
          </el-select>

          <!-- 视图切换 -->
          <div class="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              @click="viewMode = 'cloud'"
              :class="[
                'px-3 py-2 transition-colors',
                viewMode === 'cloud' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              ]"
            >
              <i class="fas fa-cloud"></i>
            </button>
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-3 py-2 transition-colors',
                viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              ]"
            >
              <i class="fas fa-th"></i>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-3 py-2 transition-colors',
                viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              ]"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 云状视图 -->
      <div v-if="viewMode === 'cloud'" class="bg-white rounded-xl shadow-sm p-8">
        <div class="flex flex-wrap justify-center gap-4">
          <span
            v-for="tag in filteredTags"
            :key="tag.id"
            @click="goToTag(tag.id)"
            :style="{
              fontSize: getTagSize(tag.articleCount),
              color: tag.color
            }"
            class="tag-cloud-item px-4 py-2 bg-gray-50 rounded-full cursor-pointer transition-all hover:shadow-lg"
          >
            #{{ tag.name }}
            <span class="text-xs text-gray-400 ml-1">({{ tag.articleCount }})</span>
          </span>
        </div>
      </div>

      <!-- 网格视图 -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="tag in filteredTags"
          :key="tag.id"
          @click="goToTag(tag.id)"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-4 text-center group"
        >
          <div
            class="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            :style="{ backgroundColor: tag.color + '20' }"
          >
            <i class="fas fa-tag" :style="{ color: tag.color }"></i>
          </div>
          <div class="font-medium text-gray-800 mb-1 truncate">{{ tag.name }}</div>
          <div class="text-xs text-gray-500">{{ tag.articleCount }} 篇</div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">排名</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">标签</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-700">颜色</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-700">文章数</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(tag, index) in filteredTags"
              :key="tag.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                  ]"
                >
                  {{ index + 1 }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <i class="fas fa-tag text-gray-400"></i>
                  <span class="font-medium text-gray-800">{{ tag.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <span
                    class="w-6 h-6 rounded-full border-2 border-gray-200"
                    :style="{ backgroundColor: tag.color }"
                  ></span>
                  <span class="text-sm text-gray-600">{{ tag.color }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                  {{ tag.articleCount }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="goToTag(tag.id)"
                  class="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  查看文章 <i class="fas fa-arrow-right ml-1"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTags.length === 0" class="text-center py-20">
        <i class="fas fa-tags text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">未找到相关标签</p>
      </div>
    </div>

    <!-- 热门标签统计 -->
    <div class="bg-white py-16 mt-12">
      <div class="max-w-7xl mx-auto px-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">热门标签 TOP 10</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- 柱状图 -->
          <div class="bg-gray-50 rounded-xl p-6">
            <div ref="barChartRef" class="h-80"></div>
          </div>

          <!-- 词云图 -->
          <div class="bg-gray-50 rounded-xl p-6">
            <div ref="wordCloudRef" class="h-80"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签统计卡片 -->
    <div class="max-w-7xl mx-auto px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <i class="fas fa-tags text-3xl opacity-80"></i>
            <div class="text-right">
              <div class="text-3xl font-bold">{{ tags.length }}</div>
              <div class="text-sm opacity-80">标签总数</div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <i class="fas fa-file-alt text-3xl opacity-80"></i>
            <div class="text-right">
              <div class="text-3xl font-bold">{{ totalArticles }}</div>
              <div class="text-sm opacity-80">文章总数</div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <i class="fas fa-chart-line text-3xl opacity-80"></i>
            <div class="text-right">
              <div class="text-3xl font-bold">{{ averageArticles }}</div>
              <div class="text-sm opacity-80">平均文章数</div>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <i class="fas fa-fire text-3xl opacity-80"></i>
            <div class="text-right">
              <div class="text-3xl font-bold">{{ hottestTag?.articleCount || 0 }}</div>
              <div class="text-sm opacity-80">最热标签</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()

// 状态
const viewMode = ref<'cloud' | 'grid' | 'list'>('cloud')
const sortBy = ref('hot')
const searchKeyword = ref('')
const barChartRef = ref<HTMLElement | null>(null)
const wordCloudRef = ref<HTMLElement | null>(null)

// 标签数据
const tags = ref([
  { id: 1, name: 'JavaScript', color: '#F7DF1E', articleCount: 45 },
  { id: 2, name: 'Vue.js', color: '#42B883', articleCount: 38 },
  { id: 3, name: 'React', color: '#61DAFB', articleCount: 35 },
  { id: 4, name: 'TypeScript', color: '#3178C6', articleCount: 32 },
  { id: 5, name: 'Node.js', color: '#339933', articleCount: 28 },
  { id: 6, name: 'Python', color: '#3776AB', articleCount: 25 },
  { id: 7, name: 'CSS', color: '#1572B6', articleCount: 22 },
  { id: 8, name: 'Docker', color: '#2496ED', articleCount: 20 },
  { id: 9, name: 'Git', color: '#F05032', articleCount: 18 },
  { id: 10, name: 'Webpack', color: '#8DD6F9', articleCount: 16 },
  { id: 11, name: 'MySQL', color: '#4479A1', articleCount: 15 },
  { id: 12, name: 'Redis', color: '#DC382D', articleCount: 14 },
  { id: 13, name: 'MongoDB', color: '#47A248', articleCount: 13 },
  { id: 14, name: 'Spring Boot', color: '#6DB33F', articleCount: 12 },
  { id: 15, name: 'Nginx', color: '#009639', articleCount: 11 },
  { id: 16, name: 'Linux', color: '#FCC624', articleCount: 10 },
  { id: 17, name: 'AWS', color: '#FF9900', articleCount: 9 },
  { id: 18, name: 'Kubernetes', color: '#326CE5', articleCount: 8 },
  { id: 19, name: 'GraphQL', color: '#E10098', articleCount: 7 },
  { id: 20, name: 'TailwindCSS', color: '#06B6D4', articleCount: 6 }
])

// 计算属性
const filteredTags = computed(() => {
  let result = tags.value

  // 搜索过滤
  if (searchKeyword.value) {
    result = result.filter(tag =>
      tag.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  // 排序
  switch (sortBy.value) {
    case 'hot':
    case 'count':
      return [...result].sort((a, b) => b.articleCount - a.articleCount)
    case 'name':
      return [...result].sort((a, b) => a.name.localeCompare(b.name))
    default:
      return result
  }
})

const totalArticles = computed(() => {
  return tags.value.reduce((sum, tag) => sum + tag.articleCount, 0)
})

const averageArticles = computed(() => {
  return Math.round(totalArticles.value / tags.value.length)
})

const hottestTag = computed(() => {
  return [...tags.value].sort((a, b) => b.articleCount - a.articleCount)[0]
})

const topTags = computed(() => {
  return [...tags.value].sort((a, b) => b.articleCount - a.articleCount).slice(0, 10)
})

// 获取标签大小（根据文章数量）
const getTagSize = (count: number) => {
  if (count >= 40) return '2rem'
  if (count >= 30) return '1.75rem'
  if (count >= 20) return '1.5rem'
  if (count >= 15) return '1.25rem'
  if (count >= 10) return '1.1rem'
  return '1rem'
}

// 跳转到标签
const goToTag = (id: number) => {
  router.push(`/articles?tag=${id}`)
}

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return

  const chart = echarts.init(barChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '文章数'
    },
    yAxis: {
      type: 'category',
      data: topTags.value.map(t => t.name).reverse()
    },
    series: [
      {
        type: 'bar',
        data: topTags.value.map(t => ({
          value: t.articleCount,
          itemStyle: { color: t.color }
        })).reverse(),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right'
        }
      }
    ]
  }

  chart.setOption(option)

  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化词云图
const initWordCloud = () => {
  if (!wordCloudRef.value) return

  const chart = echarts.init(wordCloudRef.value)

  const option = {
    tooltip: {
      show: true
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '100%',
        height: '100%',
        sizeRange: [14, 40],
        rotationRange: [0, 0],
        rotationStep: 0,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold'
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        data: topTags.value.map(tag => ({
          name: tag.name,
          value: tag.articleCount,
          textStyle: {
            color: tag.color
          }
        }))
      }
    ]
  }

  chart.setOption(option)

  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 组件挂载
onMounted(() => {
  initBarChart()
  // 注意：词云需要额外安装 echarts-wordcloud 插件
  // npm install echarts-wordcloud
  // import 'echarts-wordcloud'
  // initWordCloud()
})
</script>

<style scoped>
.tag-cloud-item {
  transition: all 0.3s ease;
}

.tag-cloud-item:hover {
  transform: scale(1.15) rotate(-3deg);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

table {
  border-collapse: collapse;
}
</style>