<template>
  <div class="loading-wrapper" :class="[`size-${size}`, { overlay: overlay }]">
    <div class="spinner">
      <div class="dot dot-1" />
      <div class="dot dot-2" />
      <div class="dot dot-3" />
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'small' | 'medium' | 'large'
    text?: string
    overlay?: boolean
  }>(),
  {
    size: 'medium',
    text: '',
    overlay: false,
  }
)
</script>

<style lang="scss" scoped>
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  &.overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  }

  // 尺寸变体
  &.size-small {
    .spinner {
      gap: 6px;
    }
    .dot {
      width: 6px;
      height: 6px;
    }
    .loading-text {
      font-size: 12px;
    }
  }

  &.size-medium {
    .spinner {
      gap: 8px;
    }
    .dot {
      width: 10px;
      height: 10px;
    }
    .loading-text {
      font-size: 13px;
    }
  }

  &.size-large {
    .spinner {
      gap: 12px;
    }
    .dot {
      width: 14px;
      height: 14px;
    }
    .loading-text {
      font-size: 14px;
    }
  }
}

.spinner {
  display: flex;
  align-items: center;
}

.dot {
  background-color: #1a1a1a;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;

  &.dot-1 {
    animation-delay: -0.32s;
  }

  &.dot-2 {
    animation-delay: -0.16s;
  }

  &.dot-3 {
    animation-delay: 0s;
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-text {
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #666;
  margin: 0;
}
</style>

