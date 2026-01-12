<template>
  <footer class="bg-light border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        <!-- 第一列：Logo + 链接 + 订阅表单 -->
        <div class="space-y-6">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full border-2 border-dark flex items-center justify-center"
            >
              <span class="font-display text-sm font-medium">P</span>
            </div>
            <div class="text-xs text-gray-600 leading-tight">
              <div class="font-medium text-dark">PORT</div>
              <div>MAGAZINE</div>
            </div>
          </div>

          <!-- 导航链接 -->
          <nav class="flex flex-col gap-1">
            <a href="#" class="text-xs text-gray-600 hover:text-primary transition-colors">
              SUBMISSIONS
            </a>
            <a href="#" class="text-xs text-gray-600 hover:text-primary transition-colors">
              ABOUT
            </a>
            <a href="#" class="text-xs text-gray-600 hover:text-primary transition-colors">
              CONTACT
            </a>
          </nav>

          <!-- 邮件订阅描述 -->
          <p class="text-xs text-gray-500 leading-relaxed">
            Sign up to receive our fortnightly Newsletter, direct to your inbox every other
            Thursday.
          </p>

          <!-- 订阅按钮 -->
          <ElButton type="primary" class="!bg-primary !border-primary !text-white text-xs">
            SUBSCRIBE TO NEWSLETTER
          </ElButton>
        </div>

        <!-- 第二列：社交媒体 -->
        <div class="space-y-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 text-xs text-gray-600 hover:text-primary transition-colors group"
          >
            <ElIcon :size="16"
              ><svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg
            ></ElIcon>
            <span
              >Catch us on
              <strong class="font-medium group-hover:underline">Instagram</strong></span
            >
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 text-xs text-gray-600 hover:text-primary transition-colors group"
          >
            <ElIcon :size="16"
              ><svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg
            ></ElIcon>
            <span
              >Like us on <strong class="font-medium group-hover:underline">Facebook</strong></span
            >
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 text-xs text-gray-600 hover:text-primary transition-colors group"
          >
            <ElIcon :size="16"
              ><svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                /></svg
            ></ElIcon>
            <span
              >Follow us on <strong class="font-medium group-hover:underline">Twitter</strong></span
            >
          </a>
        </div>

        <!-- 第三列：订阅杂志 -->
        <div class="md:col-span-2 space-y-4">
          <h3 class="text-sm font-medium text-dark tracking-wide">GET PORT DELIVERED</h3>
          <p class="text-xs text-gray-500 leading-relaxed">
            Subscribe to Port Magazine annually and receive each issue straight to your door.
          </p>
          <ElButton class="!bg-dark !border-dark !text-white text-xs hover:!bg-gray-800">
            GET PORT IN PRINT
          </ElButton>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="mt-12 pt-6 border-t border-gray-200">
        <p class="text-xs text-gray-400 text-center">
          © {{ new Date().getFullYear() }} Port Magazine. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer 组件逻辑
</script>
