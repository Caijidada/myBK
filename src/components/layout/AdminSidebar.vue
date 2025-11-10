<template>
  <aside 
    :class="[
      'sidebar bg-white w-64 flex-shrink-0 border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] fixed md:static z-30 transition-transform duration-300',
      { '-translate-x-full md:translate-x-0': collapsed }
    ]"
  >
    <nav class="flex-1 p-4 overflow-y-auto">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.path">
          <router-link
            :to="item.path"
            :class="[
              'menu-item block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3',
              { 'active bg-blue-50 text-blue-600': isActive(item.path) }
            ]"
          >
            <i :class="[item.icon, 'fa-fw', item.color]"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <footer class="p-4 text-center text-xs text-gray-500 border-t border-gray-200">
      © {{ currentYear }} 管理后台 版权所有
    </footer>
  </aside>

  <!-- 移动端遮罩层 -->
  <div 
    v-if="!collapsed"
    @click="emit('toggle-sidebar')"
    class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const route = useRoute()
const currentYear = computed(() => new Date().getFullYear())

// 菜单项
const menuItems = [
  { 
    label: '数据看板', 
    path: '/admin/dashboard', 
    icon: 'fas fa-chart-line', 
    color: 'text-blue-500' 
  },
  { 
    label: '文章管理', 
    path: '/admin/articles', 
    icon: 'fas fa-file-alt', 
    color: 'text-green-500' 
  },
  { 
    label: '评论管理', 
    path: '/admin/comments', 
    icon: 'fas fa-comments', 
    color: 'text-purple-500' 
  },
  { 
    label: '分类管理', 
    path: '/admin/categories', 
    icon: 'fas fa-folder', 
    color: 'text-orange-500' 
  },
  { 
    label: '标签管理', 
    path: '/admin/tags', 
    icon: 'fas fa-tags', 
    color: 'text-pink-500' 
  },
  { 
    label: '用户管理', 
    path: '/admin/users', 
    icon: 'fas fa-users', 
    color: 'text-indigo-500' 
  }
]

// 判断菜单项是否激活
const isActive = (path: string) => {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.menu-item.active {
  background-color: #eff6ff;
  color: #3b82f6;
}
</style>