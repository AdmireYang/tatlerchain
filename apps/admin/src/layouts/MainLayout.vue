<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-white shadow-md min-h-screen">
        <div class="p-4">
          <h2 class="text-xl font-bold">Port Magazine</h2>
        </div>
        <nav class="mt-4">
          <RouterLink to="/dashboard" class="block px-4 py-2 hover:bg-gray-100">
            数据看板
          </RouterLink>
          <RouterLink to="/posts" class="block px-4 py-2 hover:bg-gray-100"> 推文管理 </RouterLink>
          <RouterLink to="/ads" class="block px-4 py-2 hover:bg-gray-100"> 广告管理 </RouterLink>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 主布局
</script>
