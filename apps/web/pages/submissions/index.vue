<template>
  <div class="submissions-page">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">投稿</h1>
    </header>

    <!-- 页面内容 -->
    <div class="page-content">

      <!-- 投稿类别 -->
      <div class="categories-grid">
        <section class="category-section">
          <h2 class="category-title">投稿须知</h2>
          <p class="category-desc">
          PORT 欢迎自由投稿 – <em>详情请参阅以下内容。如果您想了解您的风格是否契合，
          或希望更好地熟悉我们的杂志，不妨考虑<span class="category-contact inline">
            <a href="https://port-magazine.newsstand.co.uk/">订阅</a>
          </span>一份。</em>
          </p>
        </section>
        <!-- 非虚构 -->
        <section class="category-section">
          <h2 class="category-title">非虚构</h2>
          <p class="category-desc">
            PORT 热衷于非虚构作品，这也是为什么我们每期都有大量专题报道。
            我们期待散文、思想随笔、杂感，尤其是长篇叙事作品。
            我们有足够的版面，并渴望发表严肃的深度报道。
          </p>
          <p class="category-contact">
            <em>请将简短的选题提案发送至：<a href="mailto:ayla@port-magazine.com">ayla@port-magazine.com</a></em>
          </p>
        </section>

        <!-- 小说与诗歌 -->
        <section class="category-section">
          <h2 class="category-title">小说与诗歌</h2>
          <p class="category-desc">
            我们曾发表过来自世界各地知名作家的诗歌与小说。
            觉得自己能写得更好？我们非常乐意考虑来自世界各地作家的作品，
            从三言两语到介于中篇小说与成长小说之间的任意篇幅。
            我们喜欢发表故事，也喜欢诗歌。
            我们只要求作品以英文撰写且此前未曾发表。
            （欢迎翻译作品，前提是未曾以英文在其他地方发表过。）
          </p>
          <p class="category-contact">
            <em>请将故事发送至：<a href="mailto:ayla@port-magazine.com">ayla@port-magazine.com</a></em>
          </p>
        </section>

        <!-- 摄影 -->
        <section class="category-section">
          <h2 class="category-title">摄影</h2>
          <p class="category-desc">
            从时尚造型拍摄、人像摄影到纪实/纪录片摄影和建筑摄影，
            PORT 致力于在每一期呈现高品质的摄影作品。
            我们对自发性摄影项目尤为感兴趣，
            无论作品仍在进行中还是已经完成，我们都很乐意查阅。
          </p>
          <p class="category-contact">
            <em>请将您的作品链接或 PDF 作品集发送至：<a href="mailto:info@port-magazine.com">info@port-magazine.com</a></em>
          </p>
        </section>

        <!-- 时尚 -->
        <section class="category-section">
          <h2 class="category-title">时尚</h2>
          <p class="category-desc">
            我们一直在寻找新人才。我们不喜欢戏剧化，
            只想与那些和我们一样热爱时尚的友善之人合作。
            如果您是专注于男装或女装、布景设计或静物摄影的造型师，
            并对男士服装和配饰有浓厚兴趣，我们期待您的来信。
          </p>
          <p class="category-contact">
            <em>请将您的作品链接或 PDF 作品集发送至：<a href="mailto:mitchell@port-magazine.com">mitchell@port-magazine.com</a></em>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '投稿 - Tatler Chain',
  meta: [
    { name: 'description', content: '向 Tatler Chain 投稿。我们欢迎非虚构、小说、诗歌、摄影和时尚类稿件。' },
  ],
})
</script>

<style lang="scss" scoped>
.submissions-page {
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

.intro-section {
  margin-bottom: 64px;
  padding-bottom: 48px;
  border-bottom: 1px solid #e5e5e5;
}

.intro-text {
  font-size: 16px;
  line-height: 1.8;
  color: #333;

  em {
    color: #666;
  }
}

.categories-grid {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.category-section {
  padding-bottom: 48px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.category-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.category-desc {
  font-size: 15px;
  line-height: 1.8;
  color: #4a4a4a;
  margin-bottom: 16px;
}

.category-contact {
  font-size: 14px;
  line-height: 1.6;
  color: #666;

  em {
    font-style: italic;
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

