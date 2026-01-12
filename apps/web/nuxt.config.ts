// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@element-plus/nuxt', '@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

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
        // 引入 Playfair Display 字体（用于标题）
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001',
    },
  },

  compatibilityDate: '2024-01-01',
})
