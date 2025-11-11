<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 面包屑导航 -->
      <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <router-link to="/" class="hover:text-blue-600">首页</router-link>
        <i class="fas fa-chevron-right text-xs"></i>
        <router-link to="/articles" class="hover:text-blue-600">文章</router-link>
        <i class="fas fa-chevron-right text-xs"></i>
        <router-link :to="`/articles?category=${article.categoryId}`" class="hover:text-blue-600">
          {{ article.categoryName }}
        </router-link>
        <i class="fas fa-chevron-right text-xs"></i>
        <span class="text-gray-800">正文</span>
      </nav>

      <!-- 文章主体 -->
      <article class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- 文章头部 -->
        <div class="p-8 sm:p-12 border-b border-gray-100">
          <!-- 标题 -->
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {{ article.title }}
          </h1>

          <!-- 元信息 -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <!-- 作者信息 -->
            <div class="flex items-center space-x-2">
              <img
                :src="article.authorAvatar"
                :alt="article.authorName"
                class="w-10 h-10 rounded-full"
              />
              <div>
                <div class="font-medium text-gray-900">{{ article.authorName }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(article.createdAt) }}</div>
              </div>
            </div>

            <span class="text-gray-300">|</span>

            <!-- 统计信息 -->
            <div class="flex items-center space-x-4">
              <span><i class="far fa-eye mr-1"></i>{{ article.viewCount }} 阅读</span>
              <span><i class="far fa-clock mr-1"></i>{{ article.readTime }} 分钟</span>
            </div>
          </div>

          <!-- 分类和标签 -->
          <div class="flex flex-wrap items-center gap-2">
            <router-link
              :to="`/articles?category=${article.categoryId}`"
              class="px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors"
            >
              {{ article.categoryName }}
            </router-link>
            <router-link
              v-for="tag in article.tags"
              :key="tag.id"
              :to="`/articles?tag=${tag.id}`"
              class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              #{{ tag.name }}
            </router-link>
          </div>
        </div>

        <!-- 封面图 -->
        <div v-if="article.coverImage" class="w-full h-96 overflow-hidden">
          <img
            :src="article.coverImage"
            :alt="article.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- 文章内容 -->
        <div class="p-8 sm:p-12">
          <!-- 目录 -->
          <div v-if="showToc && tocItems.length > 0" class="mb-8 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold text-gray-800">目录</h3>
              <button @click="tocExpanded = !tocExpanded" class="text-blue-600 text-sm">
                {{ tocExpanded ? '收起' : '展开' }}
              </button>
            </div>
            <nav v-show="tocExpanded" class="space-y-2">
              <a
                v-for="(item, index) in tocItems"
                :key="index"
                :href="`#${item.id}`"
                :class="[
                  'block text-sm hover:text-blue-600 transition-colors',
                  `pl-${(item.level - 1) * 4}`,
                  activeHeading === item.id ? 'text-blue-600 font-medium' : 'text-gray-600'
                ]"
              >
                {{ item.text }}
              </a>
            </nav>
          </div>

          <!-- Markdown 内容 -->
          <div ref="contentRef" class="prose prose-lg max-w-none" v-html="renderedContent"></div>
        </div>

        <!-- 文章底部操作 -->
        <div class="px-8 sm:px-12 py-6 bg-gray-50 border-t border-gray-100">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <!-- 点赞和收藏 -->
            <div class="flex items-center space-x-4">
              <button
                @click="handleLike"
                :class="[
                  'flex items-center space-x-2 px-6 py-3 rounded-full transition-all',
                  article.isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-red-500 hover:text-red-500'
                ]"
              >
                <i :class="article.isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
                <span>{{ article.isLiked ? '已点赞' : '点赞' }}</span>
                <span>({{ article.likeCount }})</span>
              </button>

              <button
                @click="handleCollect"
                :class="[
                  'flex items-center space-x-2 px-6 py-3 rounded-full transition-all',
                  article.isCollected
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-yellow-500 hover:text-yellow-500'
                ]"
              >
                <i :class="article.isCollected ? 'fas fa-star' : 'far fa-star'"></i>
                <span>{{ article.isCollected ? '已收藏' : '收藏' }}</span>
              </button>
            </div>

            <!-- 分享 -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">分享到:</span>
              <button
                v-for="platform in sharePlatforms"
                :key="platform.name"
                @click="handleShare(platform.name)"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <i :class="platform.icon"></i>
              </button>
            </div>
          </div>
        </div>
      </article>

      <!-- 作者信息卡片 -->
      <div class="mt-8 bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-start space-x-4">
          <img
            :src="article.authorAvatar"
            :alt="article.authorName"
            class="w-16 h-16 rounded-full"
          />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-900">{{ article.authorName }}</h3>
              <button
                v-if="!isAuthor"
                @click="handleFollow"
                :class="[
                  'px-4 py-2 rounded-full text-sm transition-colors',
                  isFollowing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                ]"
              >
                {{ isFollowing ? '已关注' : '+ 关注' }}
              </button>
            </div>
            <p class="text-gray-600 text-sm mt-2">{{ article.authorBio || '这个人很懒，什么都没有留下。' }}</p>
          </div>
        </div>
      </div>

      <!-- 相关文章推荐 -->
      <div v-if="relatedArticles.length > 0" class="mt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">相关推荐</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ArticleCard
            v-for="article in relatedArticles"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>

      <!-- 评论区 -->
      <div class="mt-8 bg-white rounded-xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          评论 <span class="text-blue-600">({{ article.commentCount }})</span>
        </h2>

        <!-- 发表评论 -->
        <div v-if="isLoggedIn" class="mb-8">
          <div class="flex space-x-4">
            <img
              :src="currentUser.avatar"
              alt="avatar"
              class="w-10 h-10 rounded-full"
            />
            <div class="flex-1">
              <textarea
                v-model="commentContent"
                placeholder="写下你的评论..."
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              ></textarea>
              <div class="flex justify-end mt-3">
                <button
                  @click="submitComment"
                  :disabled="!commentContent.trim()"
                  class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  发表评论
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mb-8 text-center py-8 bg-gray-50 rounded-lg">
          <p class="text-gray-600 mb-4">登录后才能发表评论</p>
          <button
            @click="router.push('/login')"
            class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            立即登录
          </button>
        </div>

        <!-- 评论列表 -->
        <div class="space-y-6">
          <CommentItem
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            @reply="handleReply"
            @like="handleCommentLike"
            @delete="handleCommentDelete"
          />
        </div>

        <!-- 加载更多评论 -->
        <div v-if="hasMoreComments" class="text-center mt-8">
          <button
            @click="loadMoreComments"
            class="px-6 py-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            加载更多评论
          </button>
        </div>
      </div>
    </div>

    <!-- 浮动工具栏 -->
    <div class="fixed right-8 bottom-8 flex flex-col space-y-3">
      <!-- 回到顶部 -->
      <button
        v-show="showBackTop"
        @click="scrollToTop"
        class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all"
      >
        <i class="fas fa-arrow-up"></i>
      </button>

      <!-- 目录 -->
      <button
        v-if="tocItems.length > 0"
        @click="showToc = !showToc"
        class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all"
      >
        <i class="fas fa-list"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ArticleCard from '@/components/common/ArticleCard.vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import CommentItem from '@/components/common/CommentItem.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 配置 marked
marked.setOptions({
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-'
})

// 状态
const contentRef = ref<HTMLElement | null>(null)
const showBackTop = ref(false)
const showToc = ref(false)
const tocExpanded = ref(true)
const activeHeading = ref('')
const tocItems = ref<Array<{ id: string; text: string; level: number }>>([])
const commentContent = ref('')
const comments = ref<any[]>([])
const hasMoreComments = ref(true)
const isFollowing = ref(false)

// 文章数据
const article = ref({
  id: 1,
  title: '深入理解 Vue 3 Composition API',
  summary: '全面解析 Vue 3 新一代组合式 API 的设计理念与实践应用',
  content: `# Vue 3 Composition API 简介

Vue 3 引入了全新的 Composition API，这是一种基于函数的 API，可以更灵活地组织组件逻辑。

## 为什么需要 Composition API？

在 Vue 2 中，我们使用 Options API 来组织组件代码。虽然这种方式简单易懂，但在大型组件中会遇到一些问题：

### 1. 逻辑复用困难

传统的 mixin 方式存在命名冲突、数据来源不清晰等问题。

### 2. 代码组织困难

相关的逻辑被拆分到不同的选项中，增加了维护难度。

## Composition API 的优势

\`\`\`javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    
    const increment = () => {
      count.value++
    }
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return {
      count,
      double,
      increment
    }
  }
}
\`\`\`

## 总结

Composition API 为 Vue 3 带来了更好的代码组织方式和逻辑复用能力。`,
  coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
  authorId: 1,
  authorName: '张三',
  authorAvatar: 'https://i.pravatar.cc/150?img=1',
  authorBio: '全栈开发工程师，热爱技术分享',
  categoryId: 1,
  categoryName: '前端开发',
  tags: [
    { id: 2, name: 'Vue.js' },
    { id: 4, name: 'TypeScript' }
  ],
  viewCount: 1245,
  likeCount: 87,
  commentCount: 23,
  readTime: 8,
  isLiked: false,
  isCollected: false,
  createdAt: '2024-11-05T10:00:00Z'
})

const relatedArticles = ref<any[]>([])

const sharePlatforms = [
  { name: 'wechat', icon: 'fab fa-weixin' },
  { name: 'weibo', icon: 'fab fa-weibo' },
  { name: 'twitter', icon: 'fab fa-twitter' },
  { name: 'link', icon: 'fas fa-link' }
]

// 计算属性
const isLoggedIn = computed(() => authStore.isLoggedIn)
const currentUser = computed(() => authStore.user || {})
const isAuthor = computed(() => currentUser.value.id === article.value.authorId)

const renderedContent = computed(() => {
  return marked(article.value.content)
})

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 生成目录
const generateToc = () => {
  if (!contentRef.value) return
  
  const headings = contentRef.value.querySelectorAll('h1, h2, h3, h4')
  tocItems.value = Array.from(headings).map((heading, index) => {
    const id = `heading-${index}`
    heading.id = id
    return {
      id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1))
    }
  })
}

// 监听滚动
const handleScroll = () => {
  showBackTop.value = window.scrollY > 300
  
  // 高亮当前标题
  if (contentRef.value) {
    const headings = contentRef.value.querySelectorAll('h1, h2, h3, h4')
    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i] as HTMLElement
      if (heading.offsetTop <= window.scrollY + 100) {
        activeHeading.value = heading.id
        break
      }
    }
  }
}

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 点赞
const handleLike = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  article.value.isLiked = !article.value.isLiked
  article.value.likeCount += article.value.isLiked ? 1 : -1
  ElMessage.success(article.value.isLiked ? '点赞成功' : '取消点赞')
}

// 收藏
const handleCollect = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  article.value.isCollected = !article.value.isCollected
  ElMessage.success(article.value.isCollected ? '收藏成功' : '取消收藏')
}

// 分享
const handleShare = (platform: string) => {
  const url = window.location.href
  const title = article.value.title
  
  switch (platform) {
    case 'link':
      navigator.clipboard.writeText(url)
      ElMessage.success('链接已复制到剪贴板')
      break
    default:
      ElMessage.info('分享功能开发中...')
  }
}

// 关注
const handleFollow = async () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  isFollowing.value = !isFollowing.value
  ElMessage.success(isFollowing.value ? '关注成功' : '取消关注')
}

// 发表评论
const submitComment = async () => {
  if (!commentContent.value.trim()) return
  
  // TODO: 调用API发表评论
  ElMessage.success('评论发表成功')
  commentContent.value = ''
}

// 回复评论
const handleReply = (commentId: number) => {
  console.log('回复评论:', commentId)
}

// 点赞评论
const handleCommentLike = (commentId: number) => {
  console.log('点赞评论:', commentId)
}

// 删除评论
const handleCommentDelete = (commentId: number) => {
  console.log('删除评论:', commentId)
}

// 加载更多评论
const loadMoreComments = () => {
  // TODO: 加载更多评论
  hasMoreComments.value = false
}

// 组件挂载
onMounted(async () => {
  // 加载文章详情
  const articleId = route.params.id
  // TODO: 调用API加载文章
  
  await nextTick()
  generateToc()
  
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Prose 样式 */
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  color: #111827;
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 1em;
  scroll-margin-top: 100px;
}

.prose h1 { font-size: 2.25em; }
.prose h2 { font-size: 1.875em; }
.prose h3 { font-size: 1.5em; }
.prose h4 { font-size: 1.25em; }

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose code {
  color: #ef4444;
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1.25em;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose a:hover {
  color: #2563eb;
}

.prose ul,
.prose ol {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1em;
  color: #6b7280;
  font-style: italic;
  margin: 1.5em 0;
}

.prose img {
  border-radius: 0.5rem;
  margin: 2em 0;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 2em 0;
}

.prose th,
.prose td {
  border: 1px solid #e5e7eb;
  padding: 0.75em;
  text-align: left;
}

.prose th {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>