<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Logo 和标题 -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <i class="fas fa-user-plus text-3xl text-white"></i>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">创建账户</h2>
        <p class="text-gray-600">加入我们，开始你的创作之旅</p>
      </div>

      <!-- 注册表单 -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- 第三方注册 -->
        <div class="mb-6">
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="handleSocialRegister('github')"
              class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i class="fab fa-github text-xl mr-2"></i>
              <span class="text-sm font-medium">GitHub</span>
            </button>
            <button
              @click="handleSocialRegister('google')"
              class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
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
            <span class="px-2 bg-white text-gray-500">或使用邮箱注册</span>
          </div>
        </div>

        <!-- 表单 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          @submit.prevent="handleSubmit"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="User"
            >
            </el-input>
          </el-form-item>

          <!-- 邮箱 -->
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              type="email"
              placeholder="请输入邮箱"
              size="large"
              :prefix-icon="Message"
            >
            </el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码（至少6位）"
              size="large"
              :prefix-icon="Lock"
              show-password
            >
            </el-input>
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            >
            </el-input>
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item prop="captcha">
            <div class="flex space-x-2">
              <el-input
                v-model="registerForm.captcha"
                placeholder="请输入验证码"
                size="large"
                class="flex-1"
              >
              </el-input>
              <button
                @click="handleGetCaptcha"
                :disabled="captchaCountdown > 0"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {{ captchaCountdown > 0 ? `${captchaCountdown}s` : '获取验证码' }}
              </button>
            </div>
          </el-form-item>

          <!-- 服务条款 -->
          <el-form-item prop="agree">
            <el-checkbox v-model="registerForm.agree">
              我已阅读并同意
              <a href="#" class="text-blue-600 hover:text-blue-700">《用户协议》</a>
              和
              <a href="#" class="text-blue-600 hover:text-blue-700">《隐私政策》</a>
            </el-checkbox>
          </el-form-item>

          <!-- 注册按钮 -->
          <el-button
            type="primary"
            size="large"
            class="w-full"
            :loading="loading"
            @click="handleSubmit"
          >
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
        </el-form>

        <!-- 登录链接 -->
        <div class="mt-6 text-center text-sm">
          <span class="text-gray-600">已有账户？</span>
          <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium ml-1">
            立即登录
          </router-link>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>注册即表示您同意我们的服务条款</p>
      </div>
    </div>

    <!-- 装饰性元素 -->
    <div class="fixed top-0 right-0 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
    <div class="fixed bottom-0 left-0 w-64 h-64 bg-pink-400 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Message, Lock } from '@element-plus/icons-vue'

const router = useRouter()

// 表单引用
const registerFormRef = ref<FormInstance>()
const loading = ref(false)
const captchaCountdown = ref(0)

// 表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  agree: false
})

// 自定义验证规则
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度至少6位'))
  } else {
    if (registerForm.confirmPassword !== '') {
      registerFormRef.value?.validateField('confirmPassword')
    }
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateAgree = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请阅读并同意服务条款'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  agree: [
    { required: true, validator: validateAgree, trigger: 'change' }
  ]
}

// 获取验证码
const handleGetCaptcha = async () => {
  // 验证邮箱
  if (!registerForm.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }

  try {
    // TODO: 调用发送验证码API
    ElMessage.success('验证码已发送到您的邮箱')
    
    // 开始倒计时
    captchaCountdown.value = 60
    const timer = setInterval(() => {
      captchaCountdown.value--
      if (captchaCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error: any) {
    ElMessage.error(error.message || '发送验证码失败')
  }
}

// 提交注册
const handleSubmit = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      // TODO: 调用注册API
      const { username, email, password, captcha } = registerForm
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      ElMessage.success('注册成功，即将跳转到登录页')
      
      // 跳转到登录页
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error: any) {
      ElMessage.error(error.message || '注册失败，请稍后重试')
    } finally {
      loading.value = false
    }
  })
}

// 第三方注册
const handleSocialRegister = (platform: string) => {
  ElMessage.info(`${platform} 注册功能开发中...`)
  // TODO: 实现第三方注册
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

:deep(.el-checkbox__label) {
  font-size: 14px;
  line-height: 1.5;
}
</style>