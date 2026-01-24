<template>
  <footer class="footer">
    <div class="footer-inner">
      <!-- 移动端：Logo 居中 -->
      <div class="footer-logo-mobile">
        <NuxtLink to="/">
          <img src="~/assets/images/logo.webp" alt="Logo" class="logo-img-mobile">
        </NuxtLink>
      </div>

      <div class="footer-grid">
        <!-- 第一栏：Logo（桌面端显示） -->
        <div class="footer-col footer-col-logo">
          <NuxtLink to="/" class="footer-logo">
            <img src="~/assets/images/logo.webp" alt="Logo" class="logo-img">
          </NuxtLink>
        </div>

        <!-- 第二栏：导航链接 -->
        <div class="footer-col">
          <h4 class="footer-title">导航</h4>
          <nav class="footer-nav">
            <NuxtLink to="/submissions" class="footer-link">投稿</NuxtLink>
            <NuxtLink to="/about" class="footer-link">关于我们</NuxtLink>
            <NuxtLink to="/contact" class="footer-link">联系我们</NuxtLink>
          </nav>
        </div>

        <!-- 第三栏：社交媒体 -->
        <div class="footer-col">
          <h4 class="footer-title">关注我们</h4>
          <div class="social-links">
            <a
              href="https://xhslink.com/m/5yko2FhvO67"
              target="_blank"
              rel="noopener"
              class="social-link"
            >
              <img :src="xhsIcon" alt="小红书" class="social-icon">
              <span>小红书</span>
            </a>
            <button type="button" class="social-link" @click="showWechatQR = true">
              <img :src="wxIcon" alt="公众号" class="social-icon">
              <span>公众号</span>
            </button>
            <a
              href="https://weibo.com/u/5977025127"
              target="_blank"
              rel="noopener"
              class="social-link"
            >
              <img :src="wbIcon" alt="微博" class="social-icon">
              <span>微博</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="footer-bottom">
        <p class="copyright">© {{ new Date().getFullYear() }} Port Magazine. 保留所有权利。</p>
      </div>
    </div>

    <!-- 公众号二维码弹窗 -->
    <ClientOnly>
      <ElDialog
        v-model="showWechatQR"
        title="关注公众号"
        width="320px"
        :show-close="true"
        center
        class="qr-dialog"
      >
        <div class="text-center">
          <img src="" alt="公众号二维码" class="w-48 h-48 mx-auto border border-gray-200 rounded-lg">
          <p class="mt-4 text-sm text-gray-500">打开微信扫一扫关注公众号</p>
        </div>
      </ElDialog>
    </ClientOnly>
  </footer>
</template>

<script setup lang="ts">
import xhsIcon from '~/assets/images/xhs.svg'
import wxIcon from '~/assets/images/wx.svg'
import wbIcon from '~/assets/images/wb.svg'

const showWechatQR = ref(false)
</script>

<style lang="scss" scoped>
.footer {
  background: #f8f8f8;
  border-top: 1px solid #e5e5e5;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;

  @media (min-width: 768px) {
    padding: 64px 40px;
  }
}

// 移动端 Logo 居中显示
.footer-logo-mobile {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    display: none;
  }
}

.logo-img-mobile {
  height: 60px;
  width: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 48px;
  }
}

.footer-col {
  display: flex;
  flex-direction: column;
}

// 桌面端 Logo 列
.footer-col-logo {
  display: none;

  @media (min-width: 768px) {
    display: flex;
  }
}

.footer-logo {
  display: inline-block;
}

.logo-img {
  height: 100px;
  width: auto;
}

.footer-title {
  font-size: 10px;
  font-weight: 600;
  color: #999;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;

  @media (min-width: 768px) {
    font-size: 11px;
    margin-bottom: 16px;
  }
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 10px;
  }
}

.footer-link {
  font-size: 13px;
  color: #333;
  text-decoration: none;
  transition: color 0.2s ease;

  @media (min-width: 768px) {
    font-size: 14px;
  }

  &:hover {
    color: #c45c4a;
  }
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 12px;
  }
}

.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #333;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s ease;

  @media (min-width: 768px) {
    gap: 10px;
    font-size: 14px;
  }

  &:hover {
    color: #c45c4a;
  }
}

.social-icon {
  width: 16px;
  height: 16px;

  @media (min-width: 768px) {
    width: 18px;
    height: 18px;
  }
}

.footer-bottom {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;

  @media (min-width: 768px) {
    margin-top: 48px;
    padding-top: 24px;
  }
}

.copyright {
  font-size: 11px;
  color: #999;
  text-align: center;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 12px;
  }
}
</style>

<style>
/* 自定义 Dialog 样式 */
.qr-dialog .el-dialog__header {
  padding-bottom: 10px;
}

.qr-dialog .el-dialog__body {
  padding-top: 10px;
}
</style>
