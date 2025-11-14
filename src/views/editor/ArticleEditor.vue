<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- 左侧：返回和标题 -->
          <div class="flex items-center space-x-4">
            <button
              @click="handleBack"
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i class="fas fa-arrow-left text-xl"></i>
            </button>
            <h1 class="text-lg font-bold text-gray-900">
              {{ isEdit ? '编辑文章' : '写文章' }}
            </h1>
            <span v-if="lastSaveTime" class="text-sm text-gray-500">
              <i class="fas fa-check-circle text-green-500 mr-1"></i>
              {{ lastSaveTime }}
            </span>
          </div>

          <!-- 右侧：操作按钮 -->
          <div class="flex items-center space-x-3">
            <el-button @click="handlePreview">
              <i class="fas fa-eye mr-2"></i>
              预览
            </el-button>
            <el-button @click="handleSaveDraft" :loading="saving">
              <i class="fas fa-save mr-2"></i>
              保存草稿
            </el-button>
            <el-button type="primary" @click="showPublishDialog = true">
              <i class="fas fa-paper-plane mr-2"></i>
              发布
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑器主体 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：编辑区 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 标题输入 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <input
              v-model="articleForm.title"
              type="text"
              placeholder="请输入文章标题..."
              class="w-full text-3xl font-bold border-none outline-none"
              maxlength="100"
            />
            <div class="text-right text-sm text-gray-400 mt-2">
              {{ articleForm.title.length }}/100
            </div>
          </div>

          <!-- Markdown 编辑器 -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <button
                  v-for="tool in markdownTools"
                  :key="tool.name"
                  @click="insertMarkdown(tool.syntax)"
                  class="p-2 hover:bg-gray-100 rounded transition-colors"
                  :title="tool.name"
                >
                  <i :class="tool.icon"></i>
                </button>
                <div class="w-px h-6 bg-gray-200 mx-2"></div>
                <button
                  @click="handleImageUpload"
                  class="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="上传图片"
                >
                  <i class="fas fa-image"></i>
                </button>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  @click="editorMode = 'edit'"
                  :class="[
                    'px-3 py-1 text-sm rounded transition-colors',
                    editorMode === 'edit' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  编辑
                </button>
                <button
                  @click="editorMode = 'split'"
                  :class="[
                    'px-3 py-1 text-sm rounded transition-colors',
                    editorMode === 'split' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  分屏
                </button>
                <button
                  @click="editorMode = 'preview'"
                  :class="[
                    'px-3 py-1 text-sm rounded transition-colors',
                    editorMode === 'preview' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  预览
                </button>
              </div>
            </div>

            <div class="grid" :class="editorMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'">
              <!-- 编辑区 -->
              <div v-show="editorMode !== 'preview'" class="border-r border-gray-200">
                <textarea
                  ref="editorRef"
                  v-model="articleForm.content"
                  placeholder="请输入文章内容，支持 Markdown 语法..."
                  class="w-full h-[600px] p-6 border-none outline-none resize-none font-mono text-sm"
                  @keydown.tab.prevent="handleTab"
                ></textarea>
              </div>

              <!-- 预览区 -->
              <div v-show="editorMode !== 'edit'" class="overflow-y-auto h-[600px]">
                <div class="prose prose-lg max-w-none p-6" v-html="renderedContent"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：设置区 -->
        <div class="space-y-6">
          <!-- 封面图片 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">封面图片</h3>
            <div
              v-if="articleForm.coverImage"
              class="relative rounded-lg overflow-hidden group"
            >
              <img
                :src="articleForm.coverImage"
                alt="封面"
                class="w-full h-48 object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                <button
                  @click="handleCoverUpload"
                  class="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i class="fas fa-edit mr-2"></i>更换
                </button>
                <button
                  @click="articleForm.coverImage = ''"
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <i class="fas fa-trash mr-2"></i>删除
                </button>
              </div>
            </div>
            <button
              v-else
              @click="handleCoverUpload"
              class="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors"
            >
              <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
              <span class="text-gray-600">点击上传封面</span>
            </button>
          </div>

          <!-- 摘要 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">文章摘要</h3>
            <textarea
              v-model="articleForm.summary"
              placeholder="请输入文章摘要（选填，系统会自动提取）"
              rows="4"
              class="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              maxlength="200"
            ></textarea>
            <div class="text-right text-sm text-gray-400 mt-2">
              {{ articleForm.summary.length }}/200
            </div>
          </div>

          <!-- 分类 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">选择分类</h3>
            <el-select
              v-model="articleForm.categoryId"
              placeholder="请选择分类"
              class="w-full"
              filterable
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              >
                <span><i :class="category.icon" class="mr-2"></i>{{ category.name }}</span>
              </el-option>
            </el-select>
          </div>

          <!-- 标签 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">添加标签</h3>
            <el-select
              v-model="articleForm.tags"
              multiple
              filterable
              allow-create
              placeholder="输入或选择标签"
              class="w-full"
            >
              <el-option
                v-for="tag in tags"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
              />
            </el-select>
            <div class="mt-3 text-sm text-gray-500">
              <i class="fas fa-info-circle mr-1"></i>
              最多添加 5 个标签
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布设置弹窗 -->
    <el-dialog
      v-model="showPublishDialog"
      title="发布文章"
      width="500px"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">发布方式</label>
          <el-radio-group v-model="publishType">
            <el-radio value="now">立即发布</el-radio>
            <el-radio value="schedule">定时发布</el-radio>
          </el-radio-group>
        </div>

        <div v-if="publishType === 'schedule'">
          <label class="block text-sm font-medium text-gray-700 mb-2">发布时间</label>
          <el-date-picker
            v-model="publishTime"
            type="datetime"
            placeholder="选择发布时间"
            :disabled-date="disabledDate"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">文章可见性</label>
          <el-radio-group v-model="visibility">
            <el-radio value="public">公开</el-radio>
            <el-radio value="private">私密</el-radio>
          </el-radio-group>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPublishDialog = false">取消</el-button>
          <el-button type="primary" @click="handlePublish" :loading="publishing">
            确认发布
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 隐藏的文件上传 -->
    <input
      ref="imageUploadRef"
      type="file"
      accept="image/*"
      @change="handleImageChange"
      class="hidden"
    />
    <input
      ref="coverUploadRef"
      type="file"
      accept="image/*"
      @change="handleCoverChange"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import dayjs from 'dayjs'
import { getArticleDetail, createArticle, updateArticle } from '@/api/article'
import { getCategoryList } from '@/api/category'
import { getTagList } from '@/api/tag'
import { uploadImage, uploadCover } from '@/api/upload'

const router = useRouter()
const route = useRoute()

// 配置 marked
marked.setOptions({
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-'
})

// 是否为编辑模式
const isEdit = computed(() => !!route.query.id)
const articleId = computed(() => route.query.id ? Number(route.query.id) : null)

// 引用
const editorRef = ref<HTMLTextAreaElement>()
const imageUploadRef = ref<HTMLInputElement>()
const coverUploadRef = ref<HTMLInputElement>()

// 编辑器模式
const editorMode = ref<'edit' | 'split' | 'preview'>('split')

// 状态
const saving = ref(false)
const publishing = ref(false)
const lastSaveTime = ref('')
const showPublishDialog = ref(false)
const publishType = ref('now')
const publishTime = ref('')
const visibility = ref('public')

// 表单数据
const articleForm = reactive({
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  categoryId: null as number | null,
  tags: [] as number[]
})

// 分类和标签数据
const categories = ref<any[]>([])
const tags = ref<any[]>([])

// 加载分类
const loadCategories = async () => {
  try {
    const res = await getCategoryList()
    categories.value = res.data || []
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 加载标签
const loadTags = async () => {
  try {
    const res = await getTagList()
    tags.value = res.data || []
  } catch (error) {
    console.error('加载标签失败:', error)
  }
}

// 加载文章数据（编辑模式）
const loadArticle = async () => {
  if (!articleId.value) return

  try {
    const res = await getArticleDetail(articleId.value)
    const article = res.data

    // 预填充表单数据
    articleForm.title = article.title || ''
    articleForm.summary = article.summary || ''
    articleForm.content = article.content || ''
    articleForm.coverImage = article.coverImage || ''
    articleForm.categoryId = article.category?.id || null
    articleForm.tags = article.tags?.map((t: any) => t.id) || []

    ElMessage.success('文章加载成功')
  } catch (error: any) {
    console.error('加载文章失败:', error)
    ElMessage.error(error.message || '加载文章失败')
  }
}

// Markdown 工具栏
const markdownTools = [
  { name: '加粗', icon: 'fas fa-bold', syntax: '**文字**' },
  { name: '斜体', icon: 'fas fa-italic', syntax: '*文字*' },
  { name: '标题', icon: 'fas fa-heading', syntax: '## 标题' },
  { name: '引用', icon: 'fas fa-quote-right', syntax: '> 引用' },
  { name: '代码', icon: 'fas fa-code', syntax: '```\n代码\n```' },
  { name: '链接', icon: 'fas fa-link', syntax: '[链接文字](url)' },
  { name: '列表', icon: 'fas fa-list-ul', syntax: '- 列表项' }
]

// 渲染的 Markdown 内容
const renderedContent = computed(() => {
  return marked(articleForm.content || '')
})

// 插入 Markdown 语法
const insertMarkdown = (syntax: string) => {
  if (!editorRef.value) return

  const textarea = editorRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = articleForm.content.substring(start, end)

  let insertText = syntax
  if (selectedText) {
    // 如果有选中文字，替换模板中的文字
    insertText = syntax.replace('文字', selectedText).replace('代码', selectedText)
  }

  articleForm.content =
    articleForm.content.substring(0, start) +
    insertText +
    articleForm.content.substring(end)

  // 设置光标位置
  setTimeout(() => {
    textarea.focus()
    const newPos = start + insertText.length
    textarea.setSelectionRange(newPos, newPos)
  }, 0)
}

// 处理 Tab 键
const handleTab = (e: KeyboardEvent) => {
  if (!editorRef.value) return

  const textarea = editorRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  articleForm.content =
    articleForm.content.substring(0, start) +
    '  ' +
    articleForm.content.substring(end)

  setTimeout(() => {
    textarea.setSelectionRange(start + 2, start + 2)
  }, 0)
}

// 上传图片
const handleImageUpload = () => {
  imageUploadRef.value?.click()
}

const handleImageChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    target.value = ''
    return
  }

  // 验证文件大小 (最大5MB)
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB')
    target.value = ''
    return
  }

  const loadingMsg = ElMessage({
    message: '正在上传图片...',
    type: 'info',
    duration: 0
  })

  try {
    const res = await uploadImage(file)
    loadingMsg.close()

    if (res.data?.url) {
      // 插入图片Markdown语法
      insertMarkdown(`![${file.name}](${res.data.url})`)
      ElMessage.success('图片上传成功')
    } else {
      ElMessage.error('图片上传失败')
    }
  } catch (error: any) {
    loadingMsg.close()
    console.error('图片上传失败:', error)
    ElMessage.error(error.message || '图片上传失败')
  } finally {
    target.value = ''
  }
}

// 上传封面
const handleCoverUpload = () => {
  coverUploadRef.value?.click()
}

const handleCoverChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    target.value = ''
    return
  }

  // 验证文件大小 (最大5MB)
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB')
    target.value = ''
    return
  }

  const loadingMsg = ElMessage({
    message: '正在上传封面...',
    type: 'info',
    duration: 0
  })

  try {
    const res = await uploadCover(file)
    loadingMsg.close()

    if (res.data?.url) {
      articleForm.coverImage = res.data.url
      ElMessage.success('封面上传成功')
    } else {
      ElMessage.error('封面上传失败')
    }
  } catch (error: any) {
    loadingMsg.close()
    console.error('封面上传失败:', error)
    ElMessage.error(error.message || '封面上传失败')
  } finally {
    target.value = ''
  }
}

// 保存草稿
const handleSaveDraft = async () => {
  if (!articleForm.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }

  if (!articleForm.categoryId) {
    ElMessage.warning('请选择分类')
    return
  }

  saving.value = true
  try {
    const data = {
      title: articleForm.title,
      summary: articleForm.summary,
      content: articleForm.content,
      coverImage: articleForm.coverImage,
      categoryId: articleForm.categoryId,
      tagIds: articleForm.tags,
      isPublished: false
    }

    if (isEdit.value && articleId.value) {
      // 更新文章
      await updateArticle(articleId.value, data)
    } else {
      // 创建新文章
      const res = await createArticle(data)
      // 创建成功后切换到编辑模式
      if (res.data?.id) {
        router.replace(`/editor?id=${res.data.id}`)
      }
    }

    lastSaveTime.value = dayjs().format('HH:mm:ss 已保存')
    ElMessage.success('草稿保存成功')
  } catch (error: any) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '保存失败')
  } finally {
    saving.value = false
  }
}

// 预览
const handlePreview = () => {
  editorMode.value = editorMode.value === 'preview' ? 'split' : 'preview'
}

// 发布
const handlePublish = async () => {
  if (!articleForm.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }

  if (!articleForm.content.trim()) {
    ElMessage.warning('请输入文章内容')
    return
  }

  if (!articleForm.categoryId) {
    ElMessage.warning('请选择分类')
    return
  }

  publishing.value = true
  try {
    const data = {
      title: articleForm.title,
      summary: articleForm.summary,
      content: articleForm.content,
      coverImage: articleForm.coverImage,
      categoryId: articleForm.categoryId,
      tagIds: articleForm.tags,
      isPublished: true
    }

    if (isEdit.value && articleId.value) {
      // 更新并发布
      await updateArticle(articleId.value, data)
    } else {
      // 创建并发布
      await createArticle(data)
    }

    ElMessage.success('发布成功')
    showPublishDialog.value = false

    setTimeout(() => {
      router.push('/user/articles')
    }, 1000)
  } catch (error: any) {
    console.error('发布失败:', error)
    ElMessage.error(error.message || '发布失败')
  } finally {
    publishing.value = false
  }
}

// 禁用的日期
const disabledDate = (date: Date) => {
  return date < new Date()
}

// 返回
const handleBack = async () => {
  if (articleForm.title || articleForm.content) {
    try {
      await ElMessageBox.confirm('文章尚未保存，确定要离开吗？', '提示', {
        confirmButtonText: '离开',
        cancelButtonText: '取消',
        type: 'warning'
      })
      router.back()
    } catch {
      // 用户取消
    }
  } else {
    router.back()
  }
}

// 自动保存
let autoSaveTimer: ReturnType<typeof setInterval> | null = null

const startAutoSave = () => {
  autoSaveTimer = setInterval(() => {
    if (articleForm.title || articleForm.content) {
      handleSaveDraft()
    }
  }, 60000) // 每分钟自动保存
}

// 组件挂载
onMounted(async () => {
  // 加载分类和标签
  await Promise.all([loadCategories(), loadTags()])

  // 如果是编辑模式，加载文章数据
  if (isEdit.value) {
    await loadArticle()
  }

  // 启动自动保存
  startAutoSave()
})

// 组件卸载
onBeforeUnmount(() => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
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
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.prose h1 { font-size: 2em; }
.prose h2 { font-size: 1.5em; }
.prose h3 { font-size: 1.25em; }
.prose h4 { font-size: 1.125em; }

.prose p {
  margin-top: 1em;
  margin-bottom: 1em;
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
  padding: 1em;
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

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1em;
  color: #6b7280;
  font-style: italic;
  margin: 1.5em 0;
}

.prose ul,
.prose ol {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose img {
  border-radius: 0.5rem;
  margin: 1.5em 0;
}
</style>