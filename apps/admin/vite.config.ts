import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { ports, apiConfig } from '@port/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/assets/scss/variables.scss" as *;',
        // 使用新版 Sass API，消除 legacy-js-api 警告
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    port: ports.admin,
    open: true, // 使用系统默认浏览器打开
    proxy: {
      '/api': {
        target: apiConfig.baseUrl,
        changeOrigin: true,
      },
    },
  },
  // 构建优化
  build: {
    // 分包策略，减少内存压力
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus'],
          'echarts': ['echarts'],
        },
      },
    },
    // 降低构建并行度，减少内存使用
    minify: 'esbuild',
    sourcemap: false,
  },
})
