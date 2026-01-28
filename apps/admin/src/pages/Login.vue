<template>
  <div class="login-page">
    <!-- 左侧：品牌展示区 -->
    <div class="brand-section">
      <div class="brand-content">
        <!-- Logo -->
        <div class="brand-logo">
          <img src="@/assets/images/logo.webp" alt="Port Magazine" class="logo-img" />
        </div>

        <!-- 标语 -->
        <div class="brand-text">
          <h1 class="brand-title">Port Magazine</h1>
          <p class="brand-subtitle">内容管理系统</p>
        </div>
      </div>

      <!-- 装饰线条 -->
      <div class="brand-decoration">
        <div class="decoration-line"></div>
      </div>
    </div>

    <!-- 右侧：登录表单区 -->
    <div class="form-section">
      <div class="form-container">
        <!-- 表单标题 -->
        <div class="form-header">
          <h2 class="form-title">登录</h2>
          <p class="form-subtitle">欢迎回来，请登录您的账号</p>
        </div>

        <!-- 登录表单 -->
        <ElForm
          ref="formRef"
          :model="formData"
          :rules="rules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <ElFormItem prop="email" class="form-item">
            <label class="form-label">账号</label>
            <ElInput
              v-model="formData.email"
              placeholder="请输入账号"
              size="large"
              clearable
            />
          </ElFormItem>

          <ElFormItem prop="password" class="form-item">
            <label class="form-label">密码</label>
            <ElInput
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            />
          </ElFormItem>

          <ElFormItem class="form-item-button">
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

        <!-- 页脚 -->
        <div class="form-footer">
          <p class="copyright">© {{ new Date().getFullYear() }} Port Magazine. 保留所有权利。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
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
  display: flex;
  min-height: 100vh;
  background: #fff;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
}

// ========== 左侧品牌区 ==========
.brand-section {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8f8f8;
  padding: 48px;
  overflow: hidden;

  @media (max-width: 1024px) {
    padding: 40px 24px;
    min-height: 280px;
  }

  @media (max-width: 640px) {
    padding: 32px 20px;
    min-height: 240px;
  }
}

.brand-content {
  position: relative;
  z-index: 2;
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
}

.brand-logo {
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    margin-bottom: 24px;
  }
}

.logo-img {
  height: 120px;
  width: auto;

  @media (max-width: 1024px) {
    height: 80px;
  }

  @media (max-width: 640px) {
    height: 60px;
  }
}

.brand-text {
  .brand-title {
    font-size: 32px;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 12px 0;
    letter-spacing: 1px;

    @media (max-width: 1024px) {
      font-size: 24px;
      margin-bottom: 8px;
    }

    @media (max-width: 640px) {
      font-size: 20px;
    }
  }

  .brand-subtitle {
    font-size: 14px;
    color: #666;
    margin: 0;
    letter-spacing: 2px;

    @media (max-width: 640px) {
      font-size: 12px;
    }
  }
}

// 装饰线条
.brand-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e5e5;

  .decoration-line {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 60px;
    height: 2px;
    background: #c45c4a;
    transform: translateX(-50%);
  }
}

// ========== 右侧表单区 ==========
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: #fff;

  @media (max-width: 1024px) {
    padding: 40px 24px;
  }

  @media (max-width: 640px) {
    padding: 32px 20px;
  }
}

.form-container {
  width: 100%;
  max-width: 420px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.form-header {
  margin-bottom: 40px;

  @media (max-width: 640px) {
    margin-bottom: 32px;
  }

  .form-title {
    font-size: 28px;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 8px 0;
    letter-spacing: 0.5px;

    @media (max-width: 640px) {
      font-size: 24px;
    }
  }

  .form-subtitle {
    font-size: 14px;
    color: #666;
    margin: 0;
    line-height: 1.6;

    @media (max-width: 640px) {
      font-size: 13px;
    }
  }
}

// 表单样式
.login-form {
  .form-item {
    margin-bottom: 28px;

    @media (max-width: 640px) {
      margin-bottom: 24px;
    }
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }

  :deep(.el-form-item__content) {
    line-height: normal;
  }

  :deep(.el-input__wrapper) {
    padding: 14px 16px;
    border-radius: 0;
    border: 1px solid #e5e5e5;
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: #c45c4a;
    }

    &.is-focus {
      border-color: #c45c4a;
      box-shadow: 0 0 0 2px rgba(196, 92, 74, 0.1);
    }
  }

  :deep(.el-input__inner) {
    font-size: 15px;
    color: #333;

    &::placeholder {
      color: #999;
    }

    // 优化浏览器自动填充样式
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
      -webkit-text-fill-color: #333 !important;
      transition: background-color 5000s ease-in-out 0s;
      caret-color: #333;
    }

    &:-moz-autofill,
    &:-moz-autofill-preview {
      filter: none;
      background-color: #fff !important;
      color: #333 !important;
    }
  }

  // 按钮
  .form-item-button {
    margin-top: 40px;
    margin-bottom: 0;

    @media (max-width: 640px) {
      margin-top: 32px;
    }
  }

  .login-button {
    width: 100%;
    height: 52px;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 1px;
    color: #fff;
    background: #1a1a1a;
    border: none;
    border-radius: 0;
    transition: all 0.3s ease;

    &:hover:not(.is-loading) {
      background: #c45c4a;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(196, 92, 74, 0.3);
    }

    &:active:not(.is-loading) {
      transform: translateY(0);
    }

    &.is-loading {
      opacity: 0.8;
      cursor: not-allowed;
    }
  }
}

// 表单页脚
.form-footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #e5e5e5;
  text-align: center;

  @media (max-width: 640px) {
    margin-top: 40px;
    padding-top: 20px;
  }

  .copyright {
    font-size: 12px;
    color: #999;
    margin: 0;
    line-height: 1.6;

    @media (max-width: 640px) {
      font-size: 11px;
    }
  }
}

// 动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
