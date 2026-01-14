/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      // 颜色配置
      colors: {
        primary: '#E63946',
        accent: '#C45C4A',
        dark: '#1D1D1D',
        light: '#F8F8F8',
      },
      // 字体配置 - 全站统一使用 Playfair Display
      fontFamily: {
        sans: ['Playfair Display', 'Georgia', 'serif'],
      },
      // 字体大小
      fontSize: {
        xs: ['11px', { lineHeight: '1.5' }],
        sm: ['13px', { lineHeight: '1.5' }],
        base: ['15px', { lineHeight: '1.6' }],
        lg: ['18px', { lineHeight: '1.5' }],
        xl: ['24px', { lineHeight: '1.3' }],
        '2xl': ['32px', { lineHeight: '1.2' }],
        '3xl': ['42px', { lineHeight: '1.1' }],
        '4xl': ['56px', { lineHeight: '1.1' }],
      },
      // 字间距
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.05em',
        wider: '0.1em',
        widest: '0.2em',
      },
    },
  },
  plugins: [],
}
