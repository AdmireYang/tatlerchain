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

  <!-- 遮罩层 -->
  <Transition name="overlay-fade">
    <div v-if="menuOpen" class="menu-overlay" @click="closeMenu"></div>
  </Transition>

  <Transition name="menu-slide">
    <nav v-if="menuOpen" class="menu-panel">
      <div class="menu-content">
        <!-- 装饰线条 -->
        <div class="menu-decoration">
          <div class="decoration-line"></div>
        </div>
        
        <h3 class="menu-title">栏目导航</h3>
        
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
              :class="{ active: isActive(cat.key) }"
              @click="closeMenu"
            >
              <span class="menu-link-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="menu-link-label">{{ cat.label }}</span>
              <span class="menu-link-indicator"></span>
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
const route = useRoute()

// 判断菜单项是否激活
const isActive = (categoryKey: string) => {
  return route.path.includes(`/category/${categoryKey}`)
}

function handleScroll() {
  // 如果菜单打开，不处理滚动动画
  if (menuOpen.value) return

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
  // document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function closeMenu() {
  menuOpen.value = false
  // document.body.style.overflow = ''
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
  height: 78px;

  @media (min-width: 768px) {
    height: 86px;
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

// 遮罩层
.menu-overlay {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 90;
  backdrop-filter: blur(2px);

  @media (min-width: 768px) {
    top: 88px;
  }
}

// 菜单面板 - 下拉式
.menu-panel {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 95;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  @media (min-width: 768px) {
    top: 88px;
  }
}

.menu-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
  gap: 12px 32px;

  @media (min-width: 768px) {
    align-items: flex-start;
    padding: 16px 40px 32px;
    gap: 16px 48px;
  }
}

// 菜单面板 - 下拉式
.menu-panel {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 95;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #e5e5e5;

  @media (min-width: 768px) {
    top: 88px;
  }
}

// 装饰线条
.menu-decoration {
  display: flex;
  align-items: center;
  padding: 0 24px;

  @media (min-width: 768px) {
    padding: 0;
  }

  .decoration-line {
    width: 32px;
    height: 2px;
    background: #c45c4a;
    animation: expandLine 0.4s ease-out 0.1s both;
  }
}

@keyframes expandLine {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 32px;
    opacity: 1;
  }
}

.menu-title {
  font-size: 10px;
  font-weight: 600;
  color: #999;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;
  padding: 0 24px;
  opacity: 0;
  animation: fadeInTitle 0.4s ease-out 0.15s both;

  @media (min-width: 768px) {
    font-size: 11px;
    padding: 0;
  }
}

@keyframes fadeInTitle {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-list {
  width: calc(100% - 48px);
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: #e5e5e5;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    padding: 0 24px;
    background: transparent;
  }

  @media (min-width: 768px) {
    width: 100%;
    padding: 0;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
  }
}

.menu-item {
  opacity: 0;
  animation: menuItemFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes menuItemFadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 32px;
  text-decoration: none;
  color: inherit;
  background: #f5f5f5;
  border-radius: 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: auto;

  @media (min-width: 640px) {
    padding: 14px 12px;
    gap: 8px;
    border-radius: 4px;
    background: #fafafa;
  }

  // 悬停效果背景
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #c45c4a 0%, #a84a3a 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover {
    @media (min-width: 640px) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(196, 92, 74, 0.15);
    }

    &::before {
      opacity: 1;
    }

    .menu-link-number,
    .menu-link-label {
      color: #fff;
    }
  }

  // 激活状态
  &.active {
    .menu-link-indicator {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  // 确保内容在背景之上
  > * {
    position: relative;
    z-index: 1;
  }
}

// 底部指示器线条
.menu-link-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #c45c4a;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: all 0.3s ease;
  z-index: 2;

  @media (min-width: 640px) {
    height: 2px;
  }
}

.menu-link-number {
  font-size: 11px;
  font-weight: 600;
  color: #c45c4a;
  letter-spacing: 1px;
  transition: color 0.3s ease;

  @media (min-width: 768px) {
    font-size: 11px;
  }
}

.menu-link-label {
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 15px;
  }
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

// 遮罩层动画
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
