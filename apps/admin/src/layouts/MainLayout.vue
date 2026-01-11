<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-white shadow-md min-h-screen">
        <div class="p-4">
          <h2 class="text-xl font-bold">Port Magazine</h2>
        </div>
        <nav class="mt-4">
          <router-link
            to="/dashboard"
            class="block px-4 py-2 hover:bg-gray-100"
          >
            数据看板
          </router-link>
          <router-link
            to="/posts"
            class="block px-4 py-2 hover:bg-gray-100"
          >
            推文管理
          </router-link>
          <router-link
            to="/ads"
            class="block px-4 py-2 hover:bg-gray-100"
          >
            广告管理
          </router-link>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 主布局
</script>
