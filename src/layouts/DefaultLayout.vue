<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-md py-3 px-6 flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600">My Blog</h1>
      <nav class="space-x-4">
        <RouterLink to="/" class="hover:text-blue-600">首页</RouterLink>
        <RouterLink to="/user" class="hover:text-blue-600">用户中心</RouterLink>
        <RouterLink to="/admin" class="hover:text-blue-600">管理后台</RouterLink>
      </nav>
    </header>

    <!-- 主体内容 -->
    <main class="flex-1 p-6">
      <RouterView />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white text-center py-3 border-t text-gray-500 text-sm">
      © 2025 My Blog. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>