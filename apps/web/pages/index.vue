<template>
  <div class="min-h-screen">
    <!-- Hero 区域 - 可以放第一篇推文 -->
    <section class="py-12 md:py-20">
      <div class="max-w-7xl mx-auto px-6 md:px-10">
        <div class="text-center space-y-6">
          <p class="text-xs text-gray-500 tracking-widest uppercase">Welcome to Port Magazine</p>
          <h1 class="font-display text-4xl md:text-6xl font-medium text-dark leading-tight">
            Stories that inspire
          </h1>
          <p class="text-gray-600 max-w-2xl mx-auto">探索时尚、音乐、艺术与电影的交汇点</p>
        </div>
      </div>
    </section>

    <!-- 推文列表区域（占位） -->
    <section class="py-12 bg-light">
      <div class="max-w-7xl mx-auto px-6 md:px-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 推文卡片占位 -->
          <div
            v-for="i in 6"
            :key="i"
            class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="aspect-[4/3] bg-gray-200 animate-pulse"></div>
            <div class="p-6 space-y-3">
              <div class="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
              <div class="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- 加载更多按钮 -->
        <div class="mt-12 text-center">
          <ElButton size="large" class="!px-8"> SHOW ME MORE </ElButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '首页',
})
</script>
