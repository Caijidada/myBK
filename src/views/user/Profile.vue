<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 用户中心导航 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-8 py-4">
          <router-link
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              isActive(tab.path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <i :class="[tab.icon, 'mr-2']"></i>
            {{ tab.label }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 个人信息卡片 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <!-- 封面图 -->
        <div class="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <button
            @click="handleChangeCover"
            class="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <i class="fas fa-camera mr-2"></i>
            更换封面
          </button>
        </div>

        <!-- 用户信息 -->
        <div class="px-8 pb-8">
          <div class="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
            <!-- 头像 -->
            <div class="relative group mb-4 sm:mb-0">
              <img
                :src="userInfo.avatar"
                alt="Avatar"
                class="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <button
                @click="handleChangeAvatar"
                class="absolute inset-0 w-32 h-32 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i class="fas fa-camera text-white text-xl"></i>
              </button>
            </div>

            <!-- 基本信息 -->
            <div class="flex-1 sm:ml-6">
              <div class="flex items-center space-x-3 mb-2">
                <h1 class="text-2xl font-bold text-gray-900">{{ userInfo.nickname }}</h1>
                <span
                  v-if="userInfo.role === 'ADMIN'"
                  class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium"
                >
                  管理员
                </span>
              </div>
              <p class="text-gray-500 mb-3">@{{ userInfo.username }}</p>
              <p class="text-gray-600">{{ userInfo.bio || '这个人很懒，什么都没有留下。' }}</p>
            </div>

            <!-- 编辑按钮 -->
            <button
              @click="showEditDialog = true"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <i class="fas fa-edit mr-2"></i>
              编辑资料
            </button>
          </div>

          <!-- 统计数据 -->
          <div class="grid grid-cols-4 gap-4 pt-6 border-t border-gray-100">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ stats.articles }}</div>
              <div class="text-sm text-gray-500 mt-1">文章</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ stats.followers }}</div>
              <div class="text-sm text-gray-500 mt-1">粉丝</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ stats.following }}</div>
              <div class="text-sm text-gray-500 mt-1">关注</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ stats.likes }}</div>
              <div class="text-sm text-gray-500 mt-1">获赞</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细信息 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：详细资料 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 个人资料 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fas fa-user text-blue-500 mr-3"></i>
              个人资料
            </h2>
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="w-24 text-gray-500 text-sm">邮箱</div>
                <div class="flex-1 text-gray-900">{{ userInfo.email }}</div>
              </div>
              <div class="flex items-start">
                <div class="w-24 text-gray-500 text-sm">用户名</div>
                <div class="flex-1 text-gray-900">{{ userInfo.username }}</div>
              </div>
              <div class="flex items-start">
                <div class="w-24 text-gray-500 text-sm">昵称</div>
                <div class="flex-1 text-gray-900">{{ userInfo.nickname }}</div>
              </div>
              <div class="flex items-start">
                <div class="w-24 text-gray-500 text-sm">简介</div>
                <div class="flex-1 text-gray-900">{{ userInfo.bio || '未填写' }}</div>
              </div>
              <div class="flex items-start">
                <div class="w-24 text-gray-500 text-sm">注册时间</div>
                <div class="flex-1 text-gray-900">{{ formatDate(userInfo.createdAt) }}</div>
              </div>
            </div>
          </div>

          <!-- 最近文章 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900 flex items-center">
                <i class="fas fa-file-alt text-blue-500 mr-3"></i>
                最近文章
              </h2>
              <router-link to="/user/articles" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                查看全部 <i class="fas fa-arrow-right ml-1"></i>
              </router-link>
            </div>
            <div class="space-y-4">
              <div
                v-for="article in recentArticles"
                :key="article.id"
                @click="router.push(`/article/${article.id}`)"
                class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <img
                  :src="article.coverImage"
                  :alt="article.title"
                  class="w-20 h-20 rounded-lg object-cover"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-gray-900 mb-1 truncate">{{ article.title }}</h3>
                  <p class="text-sm text-gray-500 line-clamp-2">{{ article.summary }}</p>
                  <div class="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span><i class="far fa-eye mr-1"></i>{{ article.viewCount }}</span>
                    <span><i class="far fa-thumbs-up mr-1"></i>{{ article.likeCount }}</span>
                    <span><i class="far fa-comment mr-1"></i>{{ article.commentCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：成就和徽章 -->
        <div class="space-y-6">
          <!-- 成就徽章 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fas fa-trophy text-yellow-500 mr-3"></i>
              成就徽章
            </h2>
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="badge in badges"
                :key="badge.id"
                class="text-center"
                :class="badge.earned ? '' : 'opacity-40'"
              >
                <div
                  :class="[
                    'w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl',
                    badge.color
                  ]"
                >
                  <i :class="badge.icon"></i>
                </div>
                <div class="text-xs font-medium text-gray-700">{{ badge.name }}</div>
              </div>
            </div>
          </div>

          <!-- 活跃度 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fas fa-chart-line text-green-500 mr-3"></i>
              活跃度
            </h2>
            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600">连续签到</span>
                  <span class="text-sm font-medium text-gray-900">7 天</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 70%"></div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600">本月发文</span>
                  <span class="text-sm font-medium text-gray-900">5 篇</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 50%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 社交链接 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <i class="fas fa-link text-purple-500 mr-3"></i>
              社交链接
            </h2>
            <div class="space-y-3">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i :class="[social.icon, 'text-xl', social.color]"></i>
                <span class="text-sm text-gray-700">{{ social.name }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑资料弹窗 -->
    <el-dialog
      v-model="showEditDialog"
      title="编辑个人资料"
      width="600px"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input
            v-model="editForm.bio"
            type="textarea"
            :rows="4"
            placeholder="介绍一下自己吧..."
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" type="email" disabled />
          <div class="text-xs text-gray-500 mt-1">邮箱不可修改</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSaveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 标签页
const tabs = [
  { label: '个人资料', path: '/user/profile', icon: 'fas fa-user' },
  { label: '我的文章', path: '/user/articles', icon: 'fas fa-file-alt' },
  { label: '我的收藏', path: '/user/favorites', icon: 'fas fa-star' },
  { label: '账号设置', path: '/user/settings', icon: 'fas fa-cog' }
]

const isActive = (path: string) => route.path === path

// 用户信息
const userInfo = ref({
  id: 1,
  username: 'zhangsan',
  email: 'zhangsan@example.com',
  nickname: '张三',
  avatar: 'https://i.pravatar.cc/200?img=12',
  bio: '全栈开发工程师，热爱技术分享',
  role: 'USER',
  createdAt: '2024-01-15T10:00:00Z'
})

// 统计数据
const stats = ref({
  articles: 23,
  followers: 156,
  following: 89,
  likes: 542
})

// 最近文章
const recentArticles = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 实战',
    summary: '全面介绍 Vue 3 的新特性和最佳实践',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=80',
    viewCount: 1245,
    likeCount: 87,
    commentCount: 23
  },
  {
    id: 2,
    title: 'TypeScript 高级技巧',
    summary: '深入理解 TypeScript 的类型系统',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200&q=80',
    viewCount: 987,
    likeCount: 65,
    commentCount: 18
  }
])

// 成就徽章
const badges = ref([
  { id: 1, name: '新人', icon: 'fas fa-seedling', color: 'bg-green-100 text-green-600', earned: true },
  { id: 2, name: '作家', icon: 'fas fa-pen-fancy', color: 'bg-blue-100 text-blue-600', earned: true },
  { id: 3, name: '热门', icon: 'fas fa-fire', color: 'bg-red-100 text-red-600', earned: true },
  { id: 4, name: '达人', icon: 'fas fa-star', color: 'bg-yellow-100 text-yellow-600', earned: false },
  { id: 5, name: '大师', icon: 'fas fa-crown', color: 'bg-purple-100 text-purple-600', earned: false },
  { id: 6, name: '传奇', icon: 'fas fa-trophy', color: 'bg-orange-100 text-orange-600', earned: false }
])

// 社交链接
const socialLinks = ref([
  { name: 'GitHub', icon: 'fab fa-github', color: 'text-gray-700', url: 'https://github.com' },
  { name: 'Twitter', icon: 'fab fa-twitter', color: 'text-blue-400', url: 'https://twitter.com' },
  { name: 'LinkedIn', icon: 'fab fa-linkedin', color: 'text-blue-600', url: 'https://linkedin.com' }
])

// 编辑表单
const showEditDialog = ref(false)
const editForm = reactive({
  nickname: userInfo.value.nickname,
  bio: userInfo.value.bio,
  email: userInfo.value.email
})

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

// 更换头像
const handleChangeAvatar = () => {
  ElMessage.info('上传头像功能开发中...')
  // TODO: 实现头像上传
}

// 更换封面
const handleChangeCover = () => {
  ElMessage.info('上传封面功能开发中...')
  // TODO: 实现封面上传
}

// 保存个人资料
const handleSaveProfile = async () => {
  try {
    // TODO: 调用更新资料API
    userInfo.value.nickname = editForm.nickname
    userInfo.value.bio = editForm.bio
    
    ElMessage.success('保存成功')
    showEditDialog.value = false
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>