<template>
  <div class="contact-page">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">联系我们</h1>
    </header>

    <!-- 页面内容 -->
    <div class="page-content">
      <!-- 主要联系信息 -->
      <section class="contact-section contact-main">
        <p class="contact-email">
          <a href="mailto:info@port-magazine.com">info@port-magazine.com</a>
        </p>
        <address class="contact-address">
          Port Publishing Limited<br />
          Somerset house<br />
          Strand, London<br />
          WC2R 1LA<br />
          <a href="https://port-magazine.com" target="_blank" rel="noopener">port-magazine.com</a>
        </address>
      </section>

      <!-- 订阅相关 -->
      <section class="contact-section">
        <h2 class="section-title">订阅服务</h2>
        <p class="section-text">
          如有关于<strong>现有订阅</strong>的问题（包括地址变更、物流追踪等），请联系我们的订阅服务：
          <a href="mailto:subenquiries@newsstand.co.uk">subenquiries@newsstand.co.uk</a>
        </p>
        <p class="section-text">
          <strong>新订阅</strong>请通过我们的商店下单。
          <em>注：新订阅将从当期开始。</em>
        </p>
      </section>

      <!-- 广告合作 -->
      <section class="contact-section">
        <h2 class="section-title">广告与创意合作</h2>
        <p class="section-text">
          <a href="mailto:andrew@port-magazine.com">andrew@port-magazine.com</a>
        </p>
      </section>

      <!-- 全球发行 -->
      <section class="contact-section">
        <h2 class="section-title">全球发行</h2>
        <p class="section-text">
          Logical Connections<br />
          <a href="mailto:adam@logicalconnections.co.uk">adam@logicalconnections.co.uk</a><br />
          +44 (0)1344 507407
        </p>
      </section>

      <!-- 内容授权 -->
      <section class="contact-section">
        <h2 class="section-title">内容授权</h2>
        <p class="section-text">
          <a href="mailto:syndication@port-magazine.com">syndication@port-magazine.com</a>
        </p>
      </section>

      <!-- 投稿 -->
      <section class="contact-section">
        <h2 class="section-title">投稿</h2>
        <p class="section-text">
          更多信息请查看<NuxtLink to="/submissions">投稿页面</NuxtLink>
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '联系我们 - Tatler Chain',
  meta: [
    { name: 'description', content: '联系 Port Magazine，了解订阅、广告合作、发行、内容授权和投稿相关信息。' },
  ],
})
</script>

<style lang="scss" scoped>
.contact-page {
  min-height: 100vh;
}

.page-header {
  text-align: center;
  padding: 64px 24px 48px;
  border-bottom: 1px solid #e5e5e5;

  @media (min-width: 768px) {
    padding: 80px 24px 64px;
  }
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #1a1a1a;
}

.page-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px 80px;

  @media (min-width: 768px) {
    padding: 64px 24px 120px;
  }
}

.contact-section {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  &.contact-main {
    margin-bottom: 48px;
    padding-bottom: 40px;
  }
}

.contact-email {
  font-size: 16px;
  margin-bottom: 20px;

  a {
    color: #c45c4a;
    text-decoration: none;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }
  }
}

.contact-address {
  font-style: normal;
  font-size: 15px;
  line-height: 1.8;
  color: #333;

  a {
    color: #c45c4a;
    text-decoration: none;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }
  }
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.section-text {
  font-size: 15px;
  line-height: 1.8;
  color: #4a4a4a;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    font-weight: 600;
    color: #333;
  }

  em {
    font-style: italic;
    color: #666;
  }

  a {
    color: #c45c4a;
    text-decoration: none;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>

