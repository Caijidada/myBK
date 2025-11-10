<template>
  <div class="search-bar relative" :class="size === 'large' ? 'w-full' : 'w-64'">
    <!-- 搜索输入框 -->
    <div class="relative">
      <input
        v-model="searchKeyword"
        type="text"
        :placeholder="placeholder"
        @keyup.enter="handleSearch"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        :class="[
          'w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all',
          size === 'large' ? 'text-base py-3' : 'text-sm'
        ]"
      />
      
      <!-- 搜索图标 -->
      <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>

      <!-- 清除按钮 -->
      <button
        v-if="searchKeyword"
        @click="clearSearch"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- 搜索建议下拉框 -->
    <div
      v-if="showSuggestions && (suggestions.length > 0 || recentSearches.length > 0)"
      class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
    >
      <!-- 最近搜索 -->
      <div v-if="recentSearches.length > 0 && !searchKeyword" class="p-3 border-b border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-gray-500 font-medium">最近搜索</span>
          <button
            @click="clearRecentSearches"
            class="text-xs text-blue-500 hover:text-blue-600"
          >
            清空
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(item, index) in recentSearches"
            :key="index"
            @click="selectSuggestion(item)"
            class="px-3 py-1 bg-gray-100 text-sm rounded-full cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            {{ item }}
          </span>
        </div>
      </div>

      <!-- 搜索建议 -->
      <div v-if="suggestions.length > 0" class="p-2">
        <div class="text-xs text-gray-500 font-medium px-3 py-2">搜索建议</div>
        <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @mousedown="selectSuggestion(suggestion.keyword)"
          class="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded transition-colors flex items-center justify-between"
        >
          <div class="flex items-center space-x-2">
            <i class="fas fa-search text-gray-400 text-xs"></i>
            <span v-html="highlightKeyword(suggestion.keyword)"></span>
          </div>
          <span class="text-xs text-gray-400">{{ suggestion.count }} 个结果</span>
        </div>
      </div>

      <!-- 热门搜索 -->
      <div v-if="hotKeywords.length > 0 && !searchKeyword" class="p-3 border-t border-gray-100">
        <div class="text-xs text-gray-500 font-medium mb-2">热门搜索</div>
        <div class="space-y-2">
          <div
            v-for="(item, index) in hotKeywords"
            :key="index"
            @click="selectSuggestion(item.keyword)"
            class="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded px-2 py-1 transition-colors"
          >
            <div class="flex items-center space-x-2">
              <span 
                :class="[
                  'text-xs font-bold w-4 h-4 flex items-center justify-center rounded',
                  index < 3 ? 'text-red-500' : 'text-gray-400'
                ]"
              >
                {{ index + 1 }}
              </span>
              <span class="text-sm">{{ item.keyword }}</span>
              <i v-if="item.isHot" class="fas fa-fire text-red-500 text-xs"></i>
            </div>
            <span class="text-xs text-gray-400">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash-es'

interface Suggestion {
  keyword: string
  count: number
}

interface HotKeyword {
  keyword: string
  count: number
  isHot?: boolean
}

interface Props {
  placeholder?: string
  size?: 'normal' | 'large'
  suggestions?: Suggestion[]
  hotKeywords?: HotKeyword[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索文章...',
  size: 'normal',
  suggestions: () => [],
  hotKeywords: () => []
})

const emit = defineEmits<{
  search: [keyword: string]
  'update:suggestions': [keyword: string]
}>()

const router = useRouter()
const searchKeyword = ref('')
const showSuggestions = ref(false)
const recentSearches = ref<string[]>([])

// 从本地存储加载最近搜索
const loadRecentSearches = () => {
  const stored = localStorage.getItem('recentSearches')
  if (stored) {
    recentSearches.value = JSON.parse(stored)
  }
}

// 保存最近搜索
const saveRecentSearch = (keyword: string) => {
  const searches = recentSearches.value.filter(item => item !== keyword)
  searches.unshift(keyword)
  recentSearches.value = searches.slice(0, 10) // 只保留最近10条
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

// 清空最近搜索
const clearRecentSearches = () => {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}

// 执行搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  
  saveRecentSearch(searchKeyword.value)
  emit('search', searchKeyword.value)
  router.push(`/articles?keyword=${encodeURIComponent(searchKeyword.value)}`)
  showSuggestions.value = false
}

// 选择建议
const selectSuggestion = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearch()
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  showSuggestions.value = false
}

// 失去焦点处理
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// 高亮关键词
const highlightKeyword = (text: string) => {
  if (!searchKeyword.value) return text
  const regex = new RegExp(`(${searchKeyword.value})`, 'gi')
  return text.replace(regex, '<span class="text-blue-600 font-medium">$1</span>')
}

// 监听搜索关键词变化，获取建议
const fetchSuggestions = debounce((keyword: string) => {
  if (keyword.trim()) {
    emit('update:suggestions', keyword)
  }
}, 300)

watch(searchKeyword, (newVal) => {
  if (newVal) {
    fetchSuggestions(newVal)
  }
})

// 组件挂载时加载最近搜索
loadRecentSearches()
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>