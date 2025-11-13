<template>
 <div class="flex flex-col min-h-screen">
    <!-- 顶部导航 -->
    <AppHeader />

    <!-- 中间内容填充剩余空间 -->
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- 底部页脚 -->
    <AppFooter />
  </div>
</template>


<style>
@import "@/assets/styles/global.css";
</style>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'


const authStore = useAuthStore()

onMounted(() => {
  // 如果已登录，获取用户信息
  if (authStore.token) {
    authStore.fetchUserInfo()
  }
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>