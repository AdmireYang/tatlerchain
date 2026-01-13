<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 全局错误捕获
 * 捕获所有未处理的组件错误
 */
onErrorCaptured((err, instance, info) => {
  console.error('全局错误捕获:', err, info)

  // 显示友好的错误提示
  ElMessage.error('应用发生错误，请刷新页面重试')

  // 返回 false 阻止错误继续传播
  return false
})
</script>

<style scoped></style>
