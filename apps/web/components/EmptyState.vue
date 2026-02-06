<template>
  <div class="empty-state">
    <!-- 装饰图案 -->
    <div class="empty-illustration">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 书本/杂志图标 -->
        <rect x="40" y="60" width="120" height="90" rx="4" stroke="currentColor" stroke-width="2" />
        <line x1="100" y1="60" x2="100" y2="150" stroke="currentColor" stroke-width="2" />
        <line x1="55" y1="80" x2="85" y2="80" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
        <line x1="55" y1="95" x2="85" y2="95" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
        <line x1="55" y1="110" x2="75" y2="110" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
        <line x1="115" y1="80" x2="145" y2="80" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
        <line x1="115" y1="95" x2="145" y2="95" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
        <line x1="115" y1="110" x2="135" y2="110" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
        <!-- 装饰圆点 -->
        <circle cx="30" cy="50" r="3" fill="currentColor" opacity="0.2" />
        <circle cx="170" cy="160" r="4" fill="currentColor" opacity="0.2" />
        <circle cx="175" cy="45" r="2" fill="currentColor" opacity="0.15" />
      </svg>
    </div>

    <!-- 文字内容 -->
    <div class="empty-content">
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
    </div>

    <!-- 操作按钮（可选） -->
    <div v-if="$slots.action" class="empty-action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: '暂无内容',
  description: '这里还没有任何内容，敬请期待...',
})
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.empty-illustration {
  width: 180px;
  height: 180px;
  color: #d4d4d4;
  margin-bottom: 32px;

  svg {
    width: 100%;
    height: 100%;
  }
}

.empty-content {
  max-width: 320px;
}

.empty-title {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.empty-description {
  font-size: 15px;
  color: #999;
  line-height: 1.6;
}

.empty-action {
  margin-top: 32px;
}
</style>








