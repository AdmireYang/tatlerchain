<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <!-- Logo 绝对定位居中 -->
    <NuxtLink to="/" class="logo-link" @click="closeMenu">
      <img src="~/assets/images/logo.webp" alt="Logo" class="logo-img" />
    </NuxtLink>

    <!-- 内容区域 -->
    <div class="header-inner">
      <!-- 左侧：菜单按钮 -->
      <button class="menu-btn" :class="{ active: menuOpen }" @click="toggleMenu">
        <span class="menu-icon">
          <span class="line line-1"></span>
          <span class="line line-2"></span>
          <span class="line line-3"></span>
        </span>
      </button>
    </div>
  </header>

  <!-- 菜单面板 -->
  <Transition name="menu-fade">
    <div v-if="menuOpen" class="menu-overlay" @click="closeMenu"></div>
  </Transition>

  <Transition name="menu-slide">
    <nav v-if="menuOpen" class="menu-panel">
      <div class="menu-content">
        <h3 class="menu-title">栏目</h3>
        <ul class="menu-list">
          <li
            v-for="(cat, index) in CATEGORIES"
            :key="cat.key"
            class="menu-item"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <NuxtLink
              :to="`/category/${cat.key}`"
              class="menu-link"
              @click="closeMenu"
            >
              <span class="menu-link-label">{{ cat.label }}</span>
              <span class="menu-link-arrow">→</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </Transition>

  <!-- 占位，防止内容被 fixed header 遮挡 -->
  <div class="header-spacer" />
</template>

<script setup lang="ts">
import { CATEGORIES } from '@port/types'

const isScrolled = ref(false)
const hasAnimated = ref(false)
const menuOpen = ref(false)

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

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  // 打开菜单时禁止滚动
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  height: 80px;

  @media (min-width: 768px) {
    height: 88px;
  }

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
  max-width: 1200px;
  margin: 0 auto;
  height: 80px;
  padding: 0 24px;

  @media (min-width: 768px) {
    height: 88px;
    padding: 0 40px;
  }
}

.logo-link {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-decoration: none;
  z-index: 1;
}

.logo-img {
  height: 60px;

  @media (min-width: 768px) {
    height: 70px;
  }
}

// 菜单按钮
.menu-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 90px;

  &:hover {
    .menu-icon .line {
      background: #666;
    }
    .menu-text {
      color: #666;
    }
  }

  &.active {
    .line-1 {
      transform: translateY(6px) rotate(45deg);
    }
    .line-2 {
      opacity: 0;
      transform: scaleX(0);
    }
    .line-3 {
      transform: translateY(-6px) rotate(-45deg);
    }
  }
}

.menu-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 20px;
}

.line {
  height: 2px;
  background: #1a1a1a;
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: 2px;
  transition: color 0.3s ease;
}


.header-spacer {
  height: 80px;

  @media (min-width: 768px) {
    height: 88px;
  }
}

// 菜单遮罩
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 90;
  backdrop-filter: blur(4px);
}

// 菜单面板 - 下拉式
.menu-panel {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 95;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);

  @media (min-width: 768px) {
    top: 88px;
  }
}

.menu-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;

  @media (min-width: 768px) {
    padding: 40px;
    gap: 16px 48px;
  }
}

.menu-title {
  display: none;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 32px;

  @media (min-width: 768px) {
    gap: 12px 48px;
  }
}

.menu-item {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;

  &:hover {
    .menu-link-label {
      color: #c45c4a;
    }

    .menu-link-arrow {
      opacity: 1;
      transform: translateX(4px);
    }
  }
}

.menu-link-label {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: 1px;
  transition: color 0.2s ease;

  @media (min-width: 768px) {
    font-size: 16px;
  }
}

.menu-link-arrow {
  font-size: 14px;
  color: #c45c4a;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}

// 菜单动画
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.25s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
