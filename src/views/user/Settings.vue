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
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 修改密码 -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <i class="fas fa-lock text-blue-500 mr-3"></i>
          修改密码
        </h2>
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px">
          <el-form-item label="当前密码" prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="请输入当前密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码（至少6位）"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleChangePassword" :loading="passwordLoading">
              修改密码
            </el-button>
            <el-button @click="resetPasswordForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 邮箱绑定 -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <i class="fas fa-envelope text-green-500 mr-3"></i>
          邮箱设置
        </h2>
        <div class="space-y-6">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <i class="fas fa-check-circle text-green-500 text-xl"></i>
              <div>
                <div class="font-medium text-gray-900">当前邮箱</div>
                <div class="text-sm text-gray-500">{{ userInfo.email }}</div>
              </div>
            </div>
            <el-button @click="showChangeEmailDialog = true">修改邮箱</el-button>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <i class="fas fa-bell text-blue-500 text-xl"></i>
              <div>
                <div class="font-medium text-gray-900">邮件通知</div>
                <div class="text-sm text-gray-500">接收评论、点赞等通知邮件</div>
              </div>
            </div>
            <el-switch v-model="emailNotification" @change="handleEmailNotificationChange" />
          </div>
        </div>
      </div>

      <!-- 隐私设置 -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <i class="fas fa-shield-alt text-purple-500 mr-3"></i>
          隐私设置
        </h2>
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <i class="fas fa-eye text-gray-500 text-xl"></i>
              <div>
                <div class="font-medium text-gray-900">公开个人资料</div>
                <div class="text-sm text-gray-500">其他用户可以查看你的个人资料</div>
              </div>
            </div>
            <el-switch v-model="privacySettings.publicProfile" />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <i class="fas fa-comment text-gray-500 text-xl"></i>
              <div>
                <div class="font-medium text-gray-900">允许评论</div>
                <div class="text-sm text-gray-500">其他用户可以评论你的文章</div>
              </div>
            </div>
            <el-switch v-model="privacySettings.allowComments" />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <i class="fas fa-user-friends text-gray-500 text-xl"></i>
              <div>
                <div class="font-medium text-gray-900">显示关注列表</div>
                <div class="text-sm text-gray-500">其他用户可以查看你的关注和粉丝</div>
              </div>
            </div>
            <el-switch v-model="privacySettings.showFollowers" />
          </div>

          <el-button type="primary" @click="handleSavePrivacy">保存隐私设置</el-button>
        </div>
      </div>

      <!-- 账号绑定 -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <i class="fas fa-link text-orange-500 mr-3"></i>
          账号绑定
        </h2>
        <div class="space-y-4">
          <div
            v-for="social in socialAccounts"
            :key="social.name"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <i :class="[social.icon, 'text-2xl', social.color]"></i>
              <div>
                <div class="font-medium text-gray-900">{{ social.name }}</div>
                <div class="text-sm text-gray-500">
                  {{ social.bound ? `已绑定：${social.account}` : '未绑定' }}
                </div>
              </div>
            </div>
            <el-button
              :type="social.bound ? 'danger' : 'primary'"
              size="small"
              @click="handleSocialBind(social)"
            >
              {{ social.bound ? '解绑' : '绑定' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 危险操作 -->
      <div class="bg-white rounded-xl shadow-sm p-8 border-2 border-red-200">
        <h2 class="text-xl font-bold text-red-600 mb-6 flex items-center">
          <i class="fas fa-exclamation-triangle mr-3"></i>
          危险操作
        </h2>
        <div class="space-y-6">
          <div class="p-4 bg-red-50 rounded-lg">
            <div class="font-medium text-gray-900 mb-2">注销账号</div>
            <p class="text-sm text-gray-600 mb-4">
              注销账号后，你的所有数据将被永久删除且无法恢复。请谨慎操作。
            </p>
            <el-button type="danger" @click="handleDeleteAccount">
              <i class="fas fa-trash mr-2"></i>
              注销账号
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改邮箱弹窗 -->
    <el-dialog v-model="showChangeEmailDialog" title="修改邮箱" width="500px">
      <el-form :model="emailForm" label-width="100px">
        <el-form-item label="新邮箱">
          <el-input v-model="emailForm.newEmail" type="email" placeholder="请输入新邮箱" />
        </el-form-item>
        <el-form-item label="验证码">
          <div class="flex space-x-2">
            <el-input v-model="emailForm.captcha" placeholder="请输入验证码" class="flex-1" />
            <el-button
              @click="handleSendEmailCaptcha"
              :disabled="emailCaptchaCountdown > 0"
            >
              {{ emailCaptchaCountdown > 0 ? `${emailCaptchaCountdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="当前密码">
          <el-input
            v-model="emailForm.password"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showChangeEmailDialog = false">取消</el-button>
          <el-button type="primary" @click="handleChangeEmail">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()

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
  email: 'zhangsan@example.com'
})

// 修改密码
const passwordFormRef = ref<FormInstance>()
const passwordLoading = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateNewPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度至少6位'))
  } else if (value === passwordForm.oldPassword) {
    callback(new Error('新密码不能与旧密码相同'))
  } else {
    if (passwordForm.confirmPassword !== '') {
      passwordFormRef.value?.validateField('confirmPassword')
    }
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [{ required: true, validator: validateNewPassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (!valid) return

    passwordLoading.value = true
    try {
      // TODO: 调用修改密码API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      ElMessage.success('密码修改成功，请重新登录')
      resetPasswordForm()
      
      // 跳转到登录页
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error: any) {
      ElMessage.error(error.message || '修改密码失败')
    } finally {
      passwordLoading.value = false
    }
  })
}

const resetPasswordForm = () => {
  passwordFormRef.value?.resetFields()
}

// 邮箱设置
const showChangeEmailDialog = ref(false)
const emailNotification = ref(true)
const emailCaptchaCountdown = ref(0)
const emailForm = reactive({
  newEmail: '',
  captcha: '',
  password: ''
})

const handleSendEmailCaptcha = async () => {
  if (!emailForm.newEmail) {
    ElMessage.warning('请先输入新邮箱')
    return
  }

  try {
    // TODO: 调用发送验证码API
    ElMessage.success('验证码已发送')
    
    emailCaptchaCountdown.value = 60
    const timer = setInterval(() => {
      emailCaptchaCountdown.value--
      if (emailCaptchaCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error: any) {
    ElMessage.error(error.message || '发送验证码失败')
  }
}

const handleChangeEmail = async () => {
  if (!emailForm.newEmail || !emailForm.captcha || !emailForm.password) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    // TODO: 调用修改邮箱API
    userInfo.value.email = emailForm.newEmail
    ElMessage.success('邮箱修改成功')
    showChangeEmailDialog.value = false
    
    Object.assign(emailForm, {
      newEmail: '',
      captcha: '',
      password: ''
    })
  } catch (error: any) {
    ElMessage.error(error.message || '修改邮箱失败')
  }
}

const handleEmailNotificationChange = (value: boolean) => {
  ElMessage.success(value ? '已开启邮件通知' : '已关闭邮件通知')
  // TODO: 调用更新设置API
}

// 隐私设置
const privacySettings = reactive({
  publicProfile: true,
  allowComments: true,
  showFollowers: true
})

const handleSavePrivacy = async () => {
  try {
    // TODO: 调用保存隐私设置API
    ElMessage.success('隐私设置已保存')
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

// 社交账号绑定
const socialAccounts = ref([
  { name: 'GitHub', icon: 'fab fa-github', color: 'text-gray-700', bound: true, account: 'zhangsan' },
  { name: 'Google', icon: 'fab fa-google', color: 'text-red-500', bound: false, account: '' },
  { name: 'WeChat', icon: 'fab fa-weixin', color: 'text-green-500', bound: false, account: '' }
])

const handleSocialBind = async (social: any) => {
  if (social.bound) {
    // 解绑
    try {
      await ElMessageBox.confirm(`确定要解绑 ${social.name} 账号吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      // TODO: 调用解绑API
      social.bound = false
      social.account = ''
      ElMessage.success('解绑成功')
    } catch {
      // 用户取消
    }
  } else {
    // 绑定
    ElMessage.info(`${social.name} 绑定功能开发中...`)
    // TODO: 实现第三方账号绑定
  }
}

// 注销账号
const handleDeleteAccount = async () => {
  try {
    await ElMessageBox.confirm(
      '注销账号后，你的所有数据将被永久删除且无法恢复。确定要继续吗？',
      '危险操作',
      {
        confirmButtonText: '确定注销',
        cancelButtonText: '取消',
        type: 'error',
        distinguishCancelAndClose: true
      }
    )

    // 二次确认
    await ElMessageBox.prompt('请输入 "确认注销" 以继续', '最终确认', {
      confirmButtonText: '注销账号',
      cancelButtonText: '取消',
      inputPattern: /^确认注销$/,
      inputErrorMessage: '请输入"确认注销"'
    })

    // TODO: 调用注销账号API
    ElMessage.success('账号已注销')
    
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>