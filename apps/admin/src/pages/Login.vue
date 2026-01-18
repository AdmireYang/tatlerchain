<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="login-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- Logo 和标题 -->
      <div class="login-header">
        <div class="logo">
          <span class="logo-text">PORT</span>
        </div>
        <h1 class="title">管理后台登录</h1>
        <p class="subtitle">Port Magazine Admin</p>
      </div>

      <!-- 登录表单 -->
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <ElFormItem prop="email">
          <ElInput
            v-model="formData.email"
            placeholder="请输入账号"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </ElFormItem>

        <ElFormItem prop="password">
          <ElInput
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </ElFormItem>

        <ElFormItem class="login-button-wrapper">
          <ElButton
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </ElButton>
        </ElFormItem>
      </ElForm>

      <!-- 页脚信息 -->
      <div class="login-footer">
        <p class="copyright">© 2024 Port Magazine. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuth } from '@/composables'
import type { LoginDto } from '@/types'

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<LoginDto>({
  email: '',
  password: '',
})

// 加载状态
const loading = ref(false)

// 表单验证规则
const rules: FormRules = {
  email: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, message: '账号长度至少3位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' },
  ],
}

// 使用认证组合式函数
const { login } = useAuth()

/**
 * 处理登录
 */
async function handleLogin() {
  if (!formRef.value) return

  try {
    // 验证表单
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true

    // 调用登录
    await login(formData)

    ElMessage.success('登录成功')
  } catch (error) {
    // 错误已在拦截器中处理
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  padding: 20px;

  // 背景装饰
  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;

    .bg-shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      animation: float 20s infinite ease-in-out;

      &.shape-1 {
        width: 300px;
        height: 300px;
        top: -100px;
        left: -100px;
        animation-delay: 0s;
      }

      &.shape-2 {
        width: 400px;
        height: 400px;
        bottom: -150px;
        right: -150px;
        animation-delay: 5s;
      }

      &.shape-3 {
        width: 200px;
        height: 200px;
        top: 50%;
        right: 10%;
        animation-delay: 10s;
      }
    }
  }

  // 登录卡片
  .login-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 48px 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.6s ease-out;

    // 头部
    .login-header {
      text-align: center;
      margin-bottom: 40px;

      .logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        margin-bottom: 24px;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);

        .logo-text {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 2px;
        }
      }

      .title {
        font-size: 28px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0 0 8px 0;
        line-height: 1.2;
      }

      .subtitle {
        font-size: 14px;
        color: #666;
        margin: 0;
        font-weight: 400;
      }
    }

    // 表单
    .login-form {
      :deep(.el-form-item) {
        margin-bottom: 24px;

        .el-input__wrapper {
          padding: 12px 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;

          &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          &.is-focus {
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
          }
        }

        .el-input__inner {
          font-size: 15px;

          // 优化浏览器自动填充样式
          &:-webkit-autofill,
          &:-webkit-autofill:hover,
          &:-webkit-autofill:focus,
          &:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
            -webkit-text-fill-color: #303133 !important;
            transition: background-color 5000s ease-in-out 0s;
            caret-color: #303133;
          }

          // Firefox 自动填充样式
          &:-moz-autofill,
          &:-moz-autofill-preview {
            filter: none;
            background-color: #fff !important;
            color: #303133 !important;
          }
        }

        .el-input__prefix {
          font-size: 18px;
          color: #999;
        }

        // 清除按钮始终显示
        .el-input__suffix {
          .el-input__clear {
            opacity: 1 !important;
            visibility: visible !important;
          }
        }
      }

      .login-button-wrapper {
        margin-bottom: 0;
        margin-top: 32px;

        .login-button {
          width: 100%;
          height: 48px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
          }

          &:active {
            transform: translateY(0);
          }

          &.is-loading {
            opacity: 0.8;
          }
        }
      }
    }

    // 页脚
    .login-footer {
      margin-top: 32px;
      text-align: center;

      .copyright {
        font-size: 12px;
        color: #999;
        margin: 0;
      }
    }
  }
}

// 动画
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-page {
    padding: 16px;

    .login-card {
      padding: 32px 24px;

      .login-header {
        margin-bottom: 32px;

        .logo {
          width: 64px;
          height: 64px;
          margin-bottom: 20px;

          .logo-text {
            font-size: 24px;
          }
        }

        .title {
          font-size: 24px;
        }
      }

      .login-form {
        .login-button-wrapper {
          margin-top: 24px;
        }
      }
    }
  }
}
</style>
