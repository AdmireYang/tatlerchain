<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
    <div class="flex items-center justify-between h-16 px-6 md:px-10">
      <!-- 左侧：菜单按钮 -->
      <button
        class="flex flex-col justify-center items-center w-8 h-8 gap-1.5 hover:opacity-70 transition-opacity"
        @click="toggleMenu"
        aria-label="菜单"
      >
        <span
          class="w-6 h-0.5 bg-dark transition-transform"
          :class="{ 'rotate-45 translate-y-2': isMenuOpen }"
        ></span>
        <span
          class="w-6 h-0.5 bg-dark transition-opacity"
          :class="{ 'opacity-0': isMenuOpen }"
        ></span>
        <span
          class="w-6 h-0.5 bg-dark transition-transform"
          :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"
        ></span>
      </button>

      <!-- 中间：Logo -->
      <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2">
        <h1 class="font-display text-3xl md:text-4xl font-medium tracking-wide text-dark">PORT</h1>
      </NuxtLink>

      <!-- 右侧：订阅按钮 -->
      <div class="flex items-center gap-4">
        <a
          href="#subscribe"
          class="hidden md:flex items-center gap-2 text-primary text-sm font-medium hover:opacity-70 transition-opacity"
        >
          GET PORT IN PRINT
        </a>
        <button
          class="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="邮件订阅"
        >
          <ElIcon :size="20">
            <Message />
          </ElIcon>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <Transition name="slide-down">
      <nav
        v-if="isMenuOpen"
        class="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg"
      >
        <div class="flex flex-col py-4 px-6">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="py-3 text-dark hover:text-primary transition-colors border-b border-gray-50 last:border-0"
            @click="isMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
          <a
            href="#subscribe"
            class="py-3 text-primary font-medium md:hidden"
            @click="isMenuOpen = false"
          >
            GET PORT IN PRINT
          </a>
        </div>
      </nav>
    </Transition>
  </header>

  <!-- 占位，防止内容被 fixed header 遮挡 -->
  <div class="h-16"></div>
</template>

<script setup lang="ts">
import { Message } from '@element-plus/icons-vue'

const isMenuOpen = ref(false)

const menuItems = [
  { label: 'HOME', path: '/' },
  { label: 'FASHION', path: '/category/fashion' },
  { label: 'MUSIC', path: '/category/music' },
  { label: 'ART', path: '/category/art' },
  { label: 'FILM', path: '/category/film' },
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 点击外部关闭菜单
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('header')) {
    isMenuOpen.value = false
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
