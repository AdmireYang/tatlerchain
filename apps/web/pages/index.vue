<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Port Magazine</h1>
    <p class="text-gray-600">前台首页 - 推文列表</p>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  layout: 'default'
})

useHead({
  title: '首页'
})
</script>
