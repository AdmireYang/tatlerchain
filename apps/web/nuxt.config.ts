// https://nuxt.com/docs/api/configuration/nuxt-config
import { ports, apiConfig } from '@port/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@element-plus/nuxt'],

  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/main.css',
    '~/assets/css/element-overrides.css', // Element Plus 样式覆盖，必须放最后
  ],

  // Vite 配置 - SCSS 变量自动导入
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables.scss" as *;',
        },
      },
    },
  },

  // Tailwind CSS 配置
  tailwindcss: {
    configPath: 'tailwind.config.js',
  },

  // Element Plus 配置
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'css',
  },

  app: {
    head: {
      title: 'Port Magazine',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Port Magazine - 内容管理系统' },
      ],
      link: [
        // Favicon
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // 预加载本地字体文件（减少闪烁）
        {
          rel: 'preload',
          href: '/fonts/Port.otf',
          as: 'font',
          type: 'font/otf',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/FZYouHJW_508R.TTF',
          as: 'font',
          type: 'font/ttf',
          crossorigin: '',
        },
        // 预加载中文字体
        {
          rel: 'preload',
          href: '/fonts/FZYouHJW_503L.TTF',
          as: 'font',
          type: 'font/ttf',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/FZYouHJW_511M.TTF',
          as: 'font',
          type: 'font/ttf',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/FZYouHJW_512B.TTF',
          as: 'font',
          type: 'font/ttf',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/FZYouHJW_513B.TTF',
          as: 'font',
          type: 'font/ttf',
          crossorigin: '',
        },
        // 预加载英文字体
        {
          rel: 'preload',
          href: '/fonts/A2RecordGothic-Light.otf',
          as: 'font',
          type: 'font/otf',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/A2RecordGothic-Regular.otf',
          as: 'font',
          type: 'font/otf',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/A2RecordGothic-Medium.otf',
          as: 'font',
          type: 'font/otf',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/A2RecordGothic-Extrabold.otf',
          as: 'font',
          type: 'font/otf',
          crossorigin: '',
        },
      ],
    },
  },

  runtimeConfig: {
    // 服务端 SSR 使用的 API 地址
    // 开发环境：http://localhost:3001
    // 生产环境：运行时由 NUXT_API_BASE_SERVER 覆盖（如 http://api:3001）
    apiBaseServer: 'http://localhost:3001',
    public: {
      // 客户端浏览器使用的 API 地址
      // 开发环境：http://localhost:3001
      // 生产环境：运行时由 NUXT_PUBLIC_API_BASE 覆盖（如 http://your-domain:3001）
      apiBase: 'http://localhost:3001',
    },
  },

  // 开发环境代理配置
  nitro: {
    devProxy: {
      '/api': {
        target: apiConfig.baseUrl,
        changeOrigin: true,
      },
    },
  },

  compatibilityDate: '2024-01-01',

  // 开发服务器端口
  devServer: {
    port: ports.web,
  },
})
