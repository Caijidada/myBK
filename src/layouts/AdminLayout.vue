<template>
  <div class="flex h-screen bg-gray-100">
    <!-- 侧边栏 -->
    <aside class="w-64 bg-gray-800 text-white p-4">
      <h2 class="text-lg font-bold mb-4">管理后台</h2>
      <ul class="space-y-2">
        <li><RouterLink to="/admin" class="hover:text-blue-300">仪表盘</RouterLink></li>
        <li><RouterLink to="/" class="hover:text-blue-300">返回前台</RouterLink></li>
      </ul>
    </aside>

    <!-- 主体 -->
    <main class="flex-1 p-6 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>