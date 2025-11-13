<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo 和标题 -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <i class="fas fa-blog text-3xl text-white"></i>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h2>
        <p class="text-gray-600">登录您的账户继续使用</p>
      </div>

      <!-- 登录表单 -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- 第三方登录 -->
        <div class="mb-6">
          <div class="grid grid-cols-2 gap-3">
            <button @click="handleSocialLogin('github')"
              class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <i class="fab fa-github text-xl mr-2"></i>
              <span class="text-sm font-medium">GitHub</span>
            </button>
            <button @click="handleSocialLogin('google')"
              class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <i class="fab fa-google text-xl mr-2"></i>
              <span class="text-sm font-medium">Google</span>
            </button>
          </div>
        </div>

        <!-- 分隔线 -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">或使用邮箱登录</span>
          </div>
        </div>

        <!-- 表单 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @submit.prevent="handleSubmit">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" size="large" />
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" size="large" :prefix-icon="Lock"
              show-password>
            </el-input>
          </el-form-item>

          <!-- 记住我和忘记密码 -->
          <div class="flex items-center justify-between mb-6">
            <el-checkbox v-model="loginForm.remember">
              记住我
            </el-checkbox>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-700">
              忘记密码？
            </a>
          </div>

          <!-- 登录按钮 -->
          <el-button type="primary" size="large" class="w-full" :loading="loading" @click="handleSubmit">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form>

        <!-- 注册链接 -->
        <div class="mt-6 text-center text-sm">
          <span class="text-gray-600">还没有账户？</span>
          <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-medium ml-1">
            立即注册
          </router-link>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>登录即表示您同意我们的</p>
        <div class="mt-1">
          <a href="#" class="text-blue-600 hover:text-blue-700">服务条款</a>
          <span class="mx-2">和</span>
          <a href="#" class="text-blue-600 hover:text-blue-700">隐私政策</a>
        </div>
      </div>
    </div>

    <!-- 装饰性元素 -->
    <div
      class="fixed top-0 left-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2">
    </div>
    <div
      class="fixed bottom-0 right-0 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

// 提交登录
const handleSubmit = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      // TODO: 调用登录API
      await authStore.login({
        username: loginForm.username,  
        password: loginForm.password,
        remember: loginForm.remember
      })

      ElMessage.success('登录成功')

      // 跳转到首页或之前的页面
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')
    } catch (error: any) {
      ElMessage.error(error.message || '登录失败，请检查账号密码')
    } finally {
      loading.value = false
    }
  })
}

// 第三方登录
const handleSocialLogin = (platform: string) => {
  ElMessage.info(`${platform} 登录功能开发中...`)
  // TODO: 实现第三方登录
}
</script>

<style scoped>
:deep(.el-input__wrapper) {
  padding: 12px 16px;
  border-radius: 12px;
}

:deep(.el-button--large) {
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
}
</style>