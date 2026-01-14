<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <div class="header-inner">
      <!-- 中间：Logo -->
      <NuxtLink to="/" class="logo-link">
        <h1 class="logo-text">PORT</h1>
      </NuxtLink>
    </div>
  </header>

  <!-- 占位，防止内容被 fixed header 遮挡 -->
  <div class="header-spacer" />
</template>

<script setup lang="ts">
const isScrolled = ref(false)
const hasAnimated = ref(false)

function handleScroll() {
  const currentScrollY = window.scrollY

  // 滚动超过阈值时触发动画
  if (currentScrollY > 50 && !hasAnimated.value) {
    hasAnimated.value = true
    isScrolled.value = true
  }

  // 回到顶部时重置
  if (currentScrollY < 10) {
    hasAnimated.value = false
    isScrolled.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  // 滚动后的状态 - 从上往下滑入
  &.scrolled {
    animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(12px);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  padding: 0 24px;

  @media (min-width: 768px) {
    height: 88px;
    padding: 0 40px;
  }
}

.logo-link {
  text-decoration: none;
}

.logo-text {
  font-size: 36px;
  font-weight: 500;
  letter-spacing: 4px;
  color: #1a1a1a;
  margin: 0;
  transition: opacity 0.3s ease;

  @media (min-width: 768px) {
    font-size: 42px;
  }

  &:hover {
    opacity: 0.7;
  }
}

.header-spacer {
  height: 80px;

  @media (min-width: 768px) {
    height: 88px;
  }
}
</style>
