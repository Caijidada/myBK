<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">数据看板</h1>
      <p class="text-gray-600 mt-1">实时监控网站运营数据</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm mb-1">{{ stat.label }}</p>
            <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
            <div class="flex items-center mt-2 text-sm">
              <span :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
                <i :class="stat.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-1"></i>
                {{ Math.abs(stat.trend) }}%
              </span>
              <span class="text-gray-500 ml-2">较上周</span>
            </div>
          </div>
          <div :class="['w-14 h-14 rounded-full flex items-center justify-center', stat.bgColor]">
            <i :class="[stat.icon, 'text-2xl', stat.iconColor]"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 访问趋势 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-900">访问趋势</h3>
            <el-radio-group v-model="visitPeriod" size="small">
                <el-radio-button value="7天">7天</el-radio-button>
                <el-radio-button value="30天">30天</el-radio-button>
            </el-radio-group>
        </div>
        <div ref="visitChartRef" class="h-80"></div>
      </div>

      <!-- 文章发布趋势 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-900">文章发布趋势</h3>
          <el-select v-model="articlePeriod" size="small" class="w-32">
            <el-option label="本月" value="month" />
            <el-option label="本季度" value="quarter" />
          </el-select>
        </div>
        <div ref="articleChartRef" class="h-80"></div>
      </div>

      <!-- 用户增长 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">用户增长</h3>
        <div ref="userChartRef" class="h-80"></div>
      </div>

      <!-- 内容分类分布 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">内容分类分布</h3>
        <div ref="categoryChartRef" class="h-80"></div>
      </div>
    </div>

    <!-- 热门内容和待办事项 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 热门文章 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">热门文章 TOP 10</h3>
        <div class="space-y-4">
          <div
            v-for="(article, index) in topArticles"
            :key="article.id"
            class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-200 text-gray-600'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-gray-900 truncate">{{ article.title }}</h4>
              <p class="text-sm text-gray-500">{{ article.author }}</p>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">{{ article.views }}</div>
              <div class="text-xs text-gray-500">阅读</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 待审核内容 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">待审核内容</h3>
        <div class="space-y-4">
          <div
            v-for="item in pendingItems"
            :key="item.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', item.bgColor]">
                <i :class="[item.icon, item.iconColor]"></i>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
                <p class="text-sm text-gray-500">{{ item.time }}</p>
              </div>
            </div>
            <el-button type="primary" size="small" @click="handleReview(item)">
              审核
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统状态 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-6">系统状态</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">CPU 使用率</span>
            <span class="text-sm font-medium text-gray-900">{{ systemStatus.cpu }}%</span>
          </div>
          <el-progress :percentage="systemStatus.cpu" :color="getProgressColor(systemStatus.cpu)" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">内存使用率</span>
            <span class="text-sm font-medium text-gray-900">{{ systemStatus.memory }}%</span>
          </div>
          <el-progress :percentage="systemStatus.memory" :color="getProgressColor(systemStatus.memory)" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">磁盘使用率</span>
            <span class="text-sm font-medium text-gray-900">{{ systemStatus.disk }}%</span>
          </div>
          <el-progress :percentage="systemStatus.disk" :color="getProgressColor(systemStatus.disk)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 图表引用
const visitChartRef = ref<HTMLElement>()
const articleChartRef = ref<HTMLElement>()
const userChartRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()

// 筛选条件
const visitPeriod = ref('7天')
const articlePeriod = ref('month')

// 统计数据
const stats = ref([
  {
    label: '总访问量',
    value: '125,678',
    trend: 12.5,
    icon: 'fas fa-eye',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-500'
  },
  {
    label: '文章总数',
    value: '892',
    trend: 8.3,
    icon: 'fas fa-file-alt',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-500'
  },
  {
    label: '用户总数',
    value: '3,580',
    trend: 15.2,
    icon: 'fas fa-users',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-500'
  },
  {
    label: '评论总数',
    value: '8,920',
    trend: -2.1,
    icon: 'fas fa-comments',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-500'
  }
])

// 热门文章
const topArticles = ref([
  { id: 1, title: 'Vue 3 Composition API 完全指南', author: '张三', views: '12.5k' },
  { id: 2, title: 'TypeScript 高级技巧与实践', author: '李四', views: '10.8k' },
  { id: 3, title: 'Docker 容器化部署实战', author: '王五', views: '9.6k' },
  { id: 4, title: 'React Hooks 深入浅出', author: '赵六', views: '8.9k' },
  { id: 5, title: 'Kubernetes 生产环境实践', author: '孙七', views: '8.2k' },
  { id: 6, title: 'MySQL 性能优化实战', author: '周八', views: '7.8k' },
  { id: 7, title: 'Redis 缓存设计与实现', author: '吴九', views: '7.5k' },
  { id: 8, title: 'Spring Boot 微服务架构', author: '郑十', views: '7.1k' },
  { id: 9, title: 'Nginx 高级配置技巧', author: '钱一', views: '6.9k' },
  { id: 10, title: 'Git 工作流最佳实践', author: '陈二', views: '6.5k' }
])

// 待审核内容
const pendingItems = ref([
  {
    id: 1,
    title: '新文章待审核',
    time: '2分钟前',
    icon: 'fas fa-file-alt',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-500'
  },
  {
    id: 2,
    title: '用户评论待审核',
    time: '5分钟前',
    icon: 'fas fa-comment',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-500'
  },
  {
    id: 3,
    title: '举报内容待处理',
    time: '10分钟前',
    icon: 'fas fa-flag',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-500'
  }
])

// 系统状态
const systemStatus = ref({
  cpu: 45,
  memory: 68,
  disk: 35
})

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage < 50) return '#10b981'
  if (percentage < 80) return '#f59e0b'
  return '#ef4444'
}

// 处理审核
const handleReview = (item: any) => {
  console.log('审核:', item)
}

// 初始化图表
const initCharts = () => {
  // 访问趋势图
  if (visitChartRef.value) {
    const chart = echarts.init(visitChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['PV', 'UV'] },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'PV',
          type: 'line',
          data: [1200, 1900, 1500, 2200, 1800, 2100, 2400],
          smooth: true,
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: 'UV',
          type: 'line',
          data: [800, 1200, 950, 1400, 1100, 1300, 1600],
          smooth: true,
          itemStyle: { color: '#10b981' }
        }
      ]
    })
  }

  // 文章趋势图
  if (articleChartRef.value) {
    const chart = echarts.init(articleChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['1周', '2周', '3周', '4周']
      },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: [20, 35, 30, 50],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#8b5cf6' },
              { offset: 1, color: '#6366f1' }
            ])
          }
        }
      ]
    })
  }

  // 用户增长图
  if (userChartRef.value) {
    const chart = echarts.init(userChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['新增用户', '活跃用户'] },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '新增用户',
          type: 'line',
          data: [120, 132, 101, 134, 190, 230],
          smooth: true,
          areaStyle: { opacity: 0.3 },
          itemStyle: { color: '#10b981' }
        },
        {
          name: '活跃用户',
          type: 'line',
          data: [220, 282, 291, 334, 390, 530],
          smooth: true,
          areaStyle: { opacity: 0.3 },
          itemStyle: { color: '#3b82f6' }
        }
      ]
    })
  }

  // 分类分布图
  if (categoryChartRef.value) {
    const chart = echarts.init(categoryChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '0' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: true },
          data: [
            { value: 335, name: '前端开发', itemStyle: { color: '#3b82f6' } },
            { value: 234, name: '后端开发', itemStyle: { color: '#10b981' } },
            { value: 154, name: '移动开发', itemStyle: { color: '#8b5cf6' } },
            { value: 135, name: '人工智能', itemStyle: { color: '#f59e0b' } },
            { value: 100, name: '其他', itemStyle: { color: '#6b7280' } }
          ]
        }
      ]
    })
  }
}

// 组件挂载
onMounted(async () => {
  await nextTick()
  initCharts()
})
</script>