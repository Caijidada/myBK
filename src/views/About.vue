<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部（简约白色） -->
    <div class="bg-white border-b border-gray-200 py-12">
      <div class="max-w-7xl mx-auto px-8 text-center">
        <h1 class="text-5xl font-bold mb-3 text-gray-800">关于我</h1>
        <p class="text-xl text-gray-600">热爱技术，热爱分享</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="max-w-5xl mx-auto px-8 py-16">
      <!-- 个人简介 -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-12">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- 头像 -->
          <div class="flex-shrink-0">
            <img
              src="https://i.pravatar.cc/200?img=12"
              alt="Avatar"
              class="w-48 h-48 rounded-full border-4 border-blue-100 shadow-lg mx-auto"
            />
          </div>

          <!-- 介绍文字 -->
          <div class="flex-1">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">你好，我是张三</h2>
            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p>
                一名热爱技术的全栈开发工程师，专注于前端和后端技术的研究与实践。
              </p>
              <p>
                我相信技术可以改变世界，也相信分享能让知识传播得更远。这个博客是我记录技术成长、
                分享开发经验的地方，希望能对你有所帮助。
              </p>
              <p>
                除了编程，我还喜欢阅读、旅行和摄影。在工作之余，我会通过这些爱好来平衡生活，
                保持对世界的好奇心。
              </p>
            </div>

            <!-- 社交链接 -->
            <div class="flex items-center space-x-4 mt-6">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
              >
                <i :class="social.icon"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 技能标签 -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i class="fas fa-code text-blue-500 mr-3"></i>
          技能树
        </h2>
        
        <div class="space-y-6">
          <div v-for="skill in skills" :key="skill.category">
            <h3 class="text-lg font-medium text-gray-700 mb-3">{{ skill.category }}</h3>
            <div class="flex flex-wrap gap-3">
              <span
                v-for="item in skill.items"
                :key="item.name"
                class="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                {{ item.name }}
                <span v-if="item.level" class="ml-1 text-xs opacity-75">
                  {{ '★'.repeat(item.level) }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间线 -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <i class="fas fa-history text-blue-500 mr-3"></i>
          成长历程
        </h2>

        <div class="relative">
          <!-- 时间线竖线 -->
          <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>

          <!-- 时间点 -->
          <div class="space-y-8">
            <div
              v-for="(event, index) in timeline"
              :key="index"
              class="relative pl-20"
            >
              <!-- 时间点图标 -->
              <div class="absolute left-5 top-1 w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow"></div>

              <!-- 内容卡片 -->
              <div class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-blue-600">{{ event.date }}</span>
                  <span
                    v-if="event.type"
                    class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                  >
                    {{ event.type }}
                  </span>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">{{ event.title }}</h3>
                <p class="text-gray-600 text-sm">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目经验 -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i class="fas fa-project-diagram text-blue-500 mr-3"></i>
          项目经验
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="project in projects"
            :key="project.name"
            class="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {{ project.name }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">{{ project.time }}</p>
              </div>
              <a
                v-if="project.link"
                :href="project.link"
                target="_blank"
                class="text-blue-500 hover:text-blue-600"
              >
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
            <p class="text-gray-600 text-sm mb-4">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project.tech"
                :key="tech"
                class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h2 class="text-2xl font-bold mb-6 text-center">联系我</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i class="fas fa-envelope text-2xl"></i>
            </div>
            <div class="font-medium mb-1">邮箱</div>
            <a href="mailto:contact@example.com" class="text-sm opacity-90 hover:opacity-100">
              contact@example.com
            </a>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i class="fab fa-github text-2xl"></i>
            </div>
            <div class="font-medium mb-1">GitHub</div>
            <a href="https://github.com" target="_blank" class="text-sm opacity-90 hover:opacity-100">
              @yourusername
            </a>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i class="fab fa-weixin text-2xl"></i>
            </div>
            <div class="font-medium mb-1">微信</div>
            <div class="text-sm opacity-90">your_wechat_id</div>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i class="fab fa-qq text-2xl"></i>
            </div>
            <div class="font-medium mb-1">QQ</div>
            <div class="text-sm opacity-90">123456789</div>
          </div>
        </div>

        <div class="text-center">
          <p class="mb-4">欢迎与我交流技术话题，或者只是打个招呼 👋</p>
          <button
            @click="showContactForm = true"
            class="px-8 py-3 bg-white text-blue-600 rounded-full font-medium hover:shadow-xl transition-all"
          >
            发送消息
          </button>
        </div>
      </div>
    </div>

    <!-- 联系表单弹窗 -->
    <el-dialog
      v-model="showContactForm"
      title="发送消息"
      width="500px"
    >
      <el-form :model="contactForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="contactForm.name" placeholder="请输入您的姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="contactForm.email" type="email" placeholder="请输入您的邮箱" />
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="contactForm.subject" placeholder="请输入消息主题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="contactForm.message"
            type="textarea"
            :rows="6"
            placeholder="请输入消息内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showContactForm = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitContact">发送</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 状态
const showContactForm = ref(false)
const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// 社交链接
const socialLinks = [
  { name: 'GitHub', icon: 'fab fa-github', url: 'https://github.com' },
  { name: 'LinkedIn', icon: 'fab fa-linkedin', url: 'https://linkedin.com' },
  { name: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com' },
  { name: 'Email', icon: 'fas fa-envelope', url: 'mailto:contact@example.com' }
]

// 技能
const skills = [
  {
    category: '前端技术',
    items: [
      { name: 'Vue.js', level: 5 },
      { name: 'React', level: 4 },
      { name: 'TypeScript', level: 5 },
      { name: 'JavaScript', level: 5 },
      { name: 'HTML/CSS', level: 5 },
      { name: 'TailwindCSS', level: 4 }
    ]
  },
  {
    category: '后端技术',
    items: [
      { name: 'Node.js', level: 4 },
      { name: 'Spring Boot', level: 4 },
      { name: 'Python', level: 3 },
      { name: 'MySQL', level: 4 },
      { name: 'Redis', level: 4 },
      { name: 'MongoDB', level: 3 }
    ]
  },
  {
    category: '工具 & 其他',
    items: [
      { name: 'Git', level: 5 },
      { name: 'Docker', level: 4 },
      { name: 'Linux', level: 4 },
      { name: 'Nginx', level: 3 },
      { name: 'Webpack', level: 4 },
      { name: 'Vite', level: 4 }
    ]
  }
]

// 时间线
const timeline = [
  {
    date: '2024.01',
    type: '当前',
    title: '全栈开发工程师',
    description: '负责公司核心产品的前后端开发，带领团队完成多个重要项目'
  },
  {
    date: '2023.06',
    type: '里程碑',
    title: '技术博客上线',
    description: '正式启动个人技术博客，开始系统化地分享技术知识和经验'
  },
  {
    date: '2022.03',
    type: '职业',
    title: '加入某互联网公司',
    description: '担任前端开发工程师，参与多个大型项目的开发与维护'
  },
  {
    date: '2021.07',
    type: '学习',
    title: '大学毕业',
    description: '获得计算机科学与技术学士学位，开始职业生涯'
  },
  {
    date: '2020.01',
    type: '成就',
    title: '第一个开源项目',
    description: '发布第一个开源项目，获得社区积极反馈'
  }
]

// 项目经验
const projects = [
  {
    name: '企业级后台管理系统',
    time: '2023.06 - 2024.01',
    description: '基于 Vue 3 和 Element Plus 构建的企业级后台管理系统，支持动态路由、权限管理等功能',
    tech: ['Vue 3', 'TypeScript', 'Element Plus', 'Vite'],
    link: 'https://github.com'
  },
  {
    name: '微服务架构项目',
    time: '2022.09 - 2023.05',
    description: '使用 Spring Boot 和 Spring Cloud 构建的微服务架构，包含用户服务、订单服务等多个模块',
    tech: ['Spring Boot', 'Spring Cloud', 'MySQL', 'Redis'],
    link: 'https://github.com'
  },
  {
    name: '在线教育平台',
    time: '2022.03 - 2022.08',
    description: '完整的在线教育平台，包含视频播放、直播、作业系统等功能',
    tech: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    link: 'https://github.com'
  },
  {
    name: '个人博客系统',
    time: '2021.10 - 2022.02',
    description: '从零开发的个人博客系统，支持 Markdown 编辑、评论、标签等功能',
    tech: ['Vue 3', 'Express', 'MySQL', 'Docker'],
    link: 'https://github.com'
  }
]

// 提交联系表单
const handleSubmitContact = () => {
  if (!contactForm.name || !contactForm.email || !contactForm.message) {
    ElMessage.warning('请填写完整信息')
    return
  }

  // TODO: 调用API发送消息
  ElMessage.success('消息发送成功，我会尽快回复您！')
  showContactForm.value = false
  
  // 重置表单
  Object.assign(contactForm, {
    name: '',
    email: '',
    subject: '',
    message: ''
  })
}
</script>

<style scoped>
/* 自定义样式 */
</style>