// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

// 路由配置
const routes: RouteRecordRaw[] = [
  // ==================== 公开路由 ====================
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/articles',
    name: 'ArticleList',
    component: () => import('@/views/ArticleList.vue'),
    meta: { title: '文章列表' }
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/ArticleDetail.vue'),
    meta: { title: '文章详情' }
  },
  {
    path: '/categories',
    name: 'CategoryList',
    component: () => import('@/views/CategoryList.vue'),
    meta: { title: '分类列表' }
  },
  {
    path: '/tags',
    name: 'TagList',
    component: () => import('@/views/TagList.vue'),
    meta: { title: '标签列表' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于' }
  },
  {
  path: '/archives',
  name: 'Archives',
  component: () => import('@/views/Archives.vue'),
  meta: { title: '归档' }
},

  // ==================== 认证路由 ====================
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', hideForAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册', hideForAuth: true }
  },

  // ==================== 用户中心路由 ====================
  {
    path: '/user',
    redirect: '/user/profile',
    meta: { requiresAuth: true }
  },
  {
    path: '/user/profile',
    name: 'Profile',
    component: () => import('@/views/user/Profile.vue'),
    meta: { title: '个人资料', requiresAuth: true }
  },
  {
    path: '/user/articles',
    name: 'MyArticles',
    component: () => import('@/views/user/MyArticles.vue'),
    meta: { title: '我的文章', requiresAuth: true }
  },
  {
    path: '/user/favorites',
    name: 'MyFavorites',
    component: () => import('@/views/user/MyFavorites.vue'),
    meta: { title: '我的收藏', requiresAuth: true }
  },
  {
    path: '/user/settings',
    name: 'Settings',
    component: () => import('@/views/user/Settings.vue'),
    meta: { title: '账号设置', requiresAuth: true }
  },

  // ==================== 编辑器路由 ====================
  {
    path: '/editor',
    name: 'ArticleEditor',
    component: () => import('@/views/editor/ArticleEditor.vue'),
    meta: { title: '文章编辑', requiresAuth: true }
  },

  // ==================== 管理后台路由 ====================
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { title: '数据看板', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/articles',
    name: 'ArticleManage',
    component: () => import('@/views/admin/ArticleManage.vue'),
    meta: { title: '文章管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/comments',
    name: 'CommentManage',
    component: () => import('@/views/admin/CommentManage.vue'),
    meta: { title: '评论管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/categories',
    name: 'CategoryManage',
    component: () => import('@/views/admin/CategoryManage.vue'),
    meta: { title: '分类管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/tags',
    name: 'TagManage',
    component: () => import('@/views/admin/TagManage.vue'),
    meta: { title: '标签管理', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'UserManage',
    component: () => import('@/views/admin/UserManage.vue'),
    meta: { title: '用户管理', requiresAuth: true, requiresAdmin: true }
  },

  // ==================== 404 页面 ====================
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 博客系统` : '博客系统'

  // 如果已登录，不允许访问登录注册页
  if (to.meta.hideForAuth && authStore.isLoggedIn) {
    ElMessage.info('您已登录')
    next('/')
    return
  }

  // 需要登录的页面
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 需要管理员权限的页面
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    ElMessage.error('没有权限访问')
    next('/')
    return
  }

  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 可以在这里添加页面访问统计等逻辑
})

export default router