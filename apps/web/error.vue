<template>
  <div class="error-page">
    <!-- 装饰背景 -->
    <div class="background-decoration">
      <div class="line line-1"></div>
      <div class="line line-2"></div>
      <div class="line line-3"></div>
    </div>

    <div class="error-content">
      <!-- 错误码 -->
      <div class="error-code">
        <span v-if="error?.statusCode === 404" class="code-digit">4</span>
        <span v-else class="code-digit">{{ String(error?.statusCode || 5).charAt(0) }}</span>
        <span class="code-digit code-middle">
          <span class="circle"></span>
        </span>
        <span v-if="error?.statusCode === 404" class="code-digit">4</span>
        <span v-else class="code-digit">{{
          String(error?.statusCode || 500).charAt(2) || '0'
        }}</span>
      </div>

      <!-- 错误信息 -->
      <div class="error-info">
        <h1 class="error-title">
          {{ error?.statusCode === 404 ? 'Page Not Found' : 'Something Went Wrong' }}
        </h1>
        <p class="error-description">
          {{
            error?.statusCode === 404
              ? '抱歉，您访问的页面不存在或已被移除。'
              : '发生了一些错误，请稍后再试。'
          }}
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="error-actions">
        <button class="btn-primary" @click="handleBack">
          <svg
            class="btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回上页
        </button>
        <button class="btn-secondary" @click="handleHome">
          <svg
            class="btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
          返回首页
        </button>
      </div>

      <!-- 装饰文字 -->
      <div class="decorative-text">
        <span>OOPS</span>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="error-footer">
      <p>如果问题持续存在，请联系我们</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const handleBack = () => {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
  } else {
    clearError({ redirect: '/' })
  }
}

const handleHome = () => {
  clearError({ redirect: '/' })
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  position: relative;
  overflow: hidden;
}

// 背景装饰线条
.background-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  .line {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(196, 92, 74, 0.1), transparent);
    height: 1px;
  }

  .line-1 {
    top: 20%;
    left: -10%;
    right: -10%;
    transform: rotate(-5deg);
  }

  .line-2 {
    top: 50%;
    left: -10%;
    right: -10%;
    transform: rotate(3deg);
  }

  .line-3 {
    top: 80%;
    left: -10%;
    right: -10%;
    transform: rotate(-2deg);
  }
}

.error-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

// 错误码样式
.error-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;

  @media (min-width: 768px) {
    gap: 16px;
    margin-bottom: 56px;
  }
}

.code-digit {
  font-size: 120px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: 180px;
  }

  &.code-middle {
    position: relative;
    width: 100px;
    height: 100px;

    @media (min-width: 768px) {
      width: 150px;
      height: 150px;
    }

    .circle {
      position: absolute;
      inset: 0;
      border: 6px solid #c45c4a;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;

      @media (min-width: 768px) {
        border-width: 8px;
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

// 错误信息
.error-info {
  margin-bottom: 48px;
}

.error-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  letter-spacing: 2px;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 36px;
    letter-spacing: 4px;
  }
}

.error-description {
  font-size: 16px;
  color: #666;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;

  @media (min-width: 768px) {
    font-size: 18px;
  }
}

// 操作按钮
.error-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;

  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: center;
  }
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 32px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;

  .btn-icon {
    width: 18px;
    height: 18px;
  }
}

.btn-primary {
  background: #1a1a1a;
  color: #fff;
  border: 2px solid #1a1a1a;

  &:hover {
    background: #c45c4a;
    border-color: #c45c4a;
  }
}

.btn-secondary {
  background: transparent;
  color: #1a1a1a;
  border: 2px solid #e0e0e0;

  &:hover {
    border-color: #c45c4a;
    color: #c45c4a;
  }
}

// 装饰文字
.decorative-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 200px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.02);
  letter-spacing: 20px;
  pointer-events: none;
  white-space: nowrap;
  z-index: -1;

  @media (min-width: 768px) {
    font-size: 300px;
    letter-spacing: 40px;
  }
}

// 底部信息
.error-footer {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  text-align: center;

  p {
    font-size: 13px;
    color: #999;
    letter-spacing: 1px;
  }
}
</style>
