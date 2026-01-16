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
})
