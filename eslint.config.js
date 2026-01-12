import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-config-prettier'

export default [
  // 忽略文件
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/.nuxt/',
      '**/.output/',
      '**/*.d.ts',
      'pnpm-lock.yaml',
    ],
  },

  // JavaScript/TypeScript 基础配置
  js.configs.recommended,

  // CommonJS 文件配置
  {
    files: ['**/*.cjs', '**/webpack.config.js', '**/vite.config.ts'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
      },
    },
  },

  // TypeScript 配置
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Node.js 全局变量
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
        // Express/Multer 类型
        Express: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off', // TypeScript 自己处理
    },
  },

  // Vue 配置
  ...vue.configs['flat/strongly-recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // 浏览器全局变量
        document: 'readonly',
        window: 'readonly',
        HTMLElement: 'readonly',
        MouseEvent: 'readonly',
        Event: 'readonly',
        console: 'readonly',
        // Vue 自动导入
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        onBeforeMount: 'readonly',
        onBeforeUnmount: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        // Nuxt 自动导入
        useHead: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        useFetch: 'readonly',
        useAsyncData: 'readonly',
        useRuntimeConfig: 'readonly',
        useState: 'readonly',
        navigateTo: 'readonly',
      },
    },
    rules: {
      // Vue 组件命名规则 - 强制使用 PascalCase
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: [],
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always',
          },
        },
      ],
      'no-undef': 'off', // Vue/Nuxt 自动导入
    },
  },

  // packages/config 中的 JS 文件
  {
    files: ['packages/config/**/*.js'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
      },
    },
  },

  // packages/ui Vue 组件
  {
    files: ['packages/ui/**/*.vue'],
    languageOptions: {
      globals: {
        MouseEvent: 'readonly',
        HTMLElement: 'readonly',
      },
    },
  },

  // packages/utils
  {
    files: ['packages/utils/**/*.ts'],
    rules: {
      'no-useless-escape': 'off',
    },
  },

  // Prettier 配置（关闭冲突规则）
  prettier,
]
