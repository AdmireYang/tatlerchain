<template>
  <div class="list-skeleton">
    <div v-for="i in count" :key="i" class="skeleton-item">
      <!-- 图片骨架 -->
      <ElSkeleton animated class="skeleton-image">
        <template #template>
          <ElSkeletonItem variant="image" style="width: 120px; height: 80px" />
        </template>
      </ElSkeleton>

      <!-- 内容骨架 -->
      <div class="skeleton-content">
        <ElSkeleton animated :rows="3" />
      </div>

      <!-- 操作按钮骨架 -->
      <div class="skeleton-actions">
        <ElSkeleton animated>
          <template #template>
            <ElSkeletonItem variant="button" style="width: 60px" />
            <ElSkeletonItem variant="button" style="width: 60px" />
            <ElSkeletonItem variant="button" style="width: 60px" />
          </template>
        </ElSkeleton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 5,
})
</script>

<style scoped lang="scss">
.list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .skeleton-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    background: #fff;

    .skeleton-image {
      flex-shrink: 0;
    }

    .skeleton-content {
      flex: 1;
      min-width: 0;
    }

    .skeleton-actions {
      flex-shrink: 0;
      display: flex;
      gap: 8px;
    }
  }
}
</style>
