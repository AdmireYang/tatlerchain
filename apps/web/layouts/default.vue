<template>
  <div class="min-h-screen flex flex-col">
    <!-- 顶部导航 -->
    <AppHeader />

    <!-- 主内容区 -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- 底部 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// 默认布局
</script>

