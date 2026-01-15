<template>
  <ElCard class="stat-card" :body-style="{ padding: '20px' }">
    <div class="stat-card-content">
      <div class="stat-icon" :style="{ backgroundColor: color + '20', color: color }">
        <ElIcon :size="32">
          <component :is="icon" />
        </ElIcon>
      </div>
      <div class="stat-info">
        <div class="stat-title">{{ title }}</div>
        <div class="stat-value">{{ formattedValue }}</div>
      </div>
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: number | string
  icon: any
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#409eff',
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})
</script>

<style scoped lang="scss">
.stat-card {
  height: 100%;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.stat-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
}
</style>
