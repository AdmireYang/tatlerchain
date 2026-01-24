<template>
  <div class="about-page">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">关于我们</h1>
    </header>

    <!-- 页面内容 -->
    <div class="page-content">
      <div class="about-text">
        <p>
          <em>Port</em> 是一个创意平台，其线上网站和半年刊风格杂志在过去十年间持续产出精美且富有深度的内容。
        </p>

        <p>
          创立于2011年，<em>Port</em> 发表来自世界顶尖人物的文章与专访，涵盖艺术、设计、建筑、美食、电影和文学等领域，
          同时呈现经久不衰的时尚典范。从丹尼尔·戴-刘易斯到奇玛曼达·恩戈齐·阿迪契，从塞缪尔·L·杰克逊到保罗·托马斯·安德森——
          这些杰出人物都曾登上我们的封面，他们是塑造这个世界的卓越之士。
        </p>

        <p>
          线上网站每日更新，通过独家专访、影片、节选文章和图片故事，为国际化的受众群体引领当代文化风潮。
        </p>

        <p>
          优雅而富有内涵，<em>Port</em> 是一本屡获殊荣的独立刊物，在这里，对风格、工艺与知识的热爱相得益彰。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '关于我们 - Tatler Chain',
  meta: [
    { name: 'description', content: 'Port 是一个创意平台，其线上网站和半年刊风格杂志在过去十年间持续产出精美且富有深度的内容。' },
  ],
})
</script>

<style lang="scss" scoped>
.about-page {
  min-height: fit-content;
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

.about-text {
  p {
    font-size: 16px;
    line-height: 1.9;
    color: #333;
    margin-bottom: 28px;

    &:last-child {
      margin-bottom: 0;
    }

    em {
      font-style: italic;
    }
  }
}
</style>

