<template>
  <div class="tag-cloud">
    <!-- 标签展示模式切换 -->
    <div v-if="showModeSwitch" class="flex justify-end mb-4">
      <div class="inline-flex rounded-lg border border-gray-200 p-1">
        <button
          @click="displayMode = 'cloud'"
          :class="[
            'px-3 py-1 rounded text-sm transition-colors',
            displayMode === 'cloud' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-blue-500'
          ]"
        >
          <i class="fas fa-cloud mr-1"></i>云状
        </button>
        <button
          @click="displayMode = 'list'"
          :class="[
            'px-3 py-1 rounded text-sm transition-colors',
            displayMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-blue-500'
          ]"
        >
          <i class="fas fa-list mr-1"></i>列表
        </button>
      </div>
    </div>

    <!-- 云状模式 -->
    <div v-if="displayMode === 'cloud'" class="flex flex-wrap justify-center gap-3">
      <span
        v-for="tag in tags"
        :key="tag.id"
        @click="handleTagClick(tag)"
        :style="{
          fontSize: getTagSize(tag.articleCount),
          color: tag.color || getRandomColor()
        }"
        class="tag-item px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-110"
      >
        #{{ tag.name }}
        <span class="text-xs text-gray-400 ml-1">({{ tag.articleCount }})</span>
      </span>
    </div>

    <!-- 列表模式 -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <div
        v-for="tag in tags"
        :key="tag.id"
        @click="handleTagClick(tag)"
        class="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-blue-500 border border-transparent"
      >
        <div class="flex items-center space-x-2">
          <span 
            class="w-2 h-2 rounded-full"
            :style="{ backgroundColor: tag.color || getRandomColor() }"
          ></span>
          <span class="font-medium">{{ tag.name }}</span>
        </div>
        <span class="text-xs text-gray-400">{{ tag.articleCount }}</span>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="showLoadMore && hasMore" class="text-center mt-6">
      <button
        @click="loadMore"
        class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
      >
        加载更多标签
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Tag {
  id: number
  name: string
  color?: string
  articleCount: number
}

interface Props {
  tags: Tag[]
  showModeSwitch?: boolean
  showLoadMore?: boolean
  hasMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showModeSwitch: true,
  showLoadMore: false,
  hasMore: false
})

const emit = defineEmits<{
  'tag-click': [tag: Tag]
  'load-more': []
}>()

const router = useRouter()
const displayMode = ref<'cloud' | 'list'>('cloud')

// 预设颜色
const colors = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', 
  '#EF4444', '#EC4899', '#06B6D4', '#84CC16'
]

// 获取随机颜色
const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)]
}

// 根据文章数量计算标签大小
const getTagSize = (count: number) => {
  if (count >= 50) return '1.2rem'
  if (count >= 30) return '1.1rem'
  if (count >= 20) return '1rem'
  if (count >= 10) return '0.95rem'
  return '0.9rem'
}

// 处理标签点击
const handleTagClick = (tag: Tag) => {
  emit('tag-click', tag)
  router.push(`/articles?tag=${tag.id}`)
}

// 加载更多
const loadMore = () => {
  emit('load-more')
}
</script>

<style scoped>
.tag-item {
  transition: all 0.3s ease;
}

.tag-item:hover {
  transform: scale(1.1) rotate(-2deg);
}
</style>