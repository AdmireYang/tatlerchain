<template>
  <div class="post-detail">
    <!-- 加载状态 -->
    <div v-if="pending" class="loading-state">
      <div class="max-w-4xl mx-auto px-4 py-20">
        <div class="animate-pulse space-y-6">
          <div class="h-4 bg-gray-200 rounded w-20" />
          <div class="h-12 bg-gray-200 rounded w-3/4" />
          <div class="h-4 bg-gray-200 rounded w-full" />
          <div class="aspect-[16/9] bg-gray-200 rounded" />
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error || !post" class="error-state">
      <div class="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 class="text-2xl font-display mb-4">文章不存在</h1>
        <p class="text-gray-500 mb-8">抱歉，您访问的文章不存在或已被删除</p>
        <NuxtLink to="/" class="text-primary hover:underline">返回首页</NuxtLink>
      </div>
    </div>

    <!-- 文章内容 -->
    <article v-else class="post-article">
      <!-- 文章头部 -->
      <header class="post-header">
        <div class="header-container">
          <!-- 分类标签 -->
          <span class="category-tag">{{ post.category }}</span>

          <!-- 标题 -->
          <h1 class="post-title">{{ post.title }}</h1>

          <!-- 描述 -->
          <p class="post-excerpt">{{ post.excerpt }}</p>
        </div>
      </header>

      <!-- 主内容区域（包含侧边栏的范围） -->
      <div class="post-main-wrapper">
        <!-- 左侧：元信息 + 分享 + 广告位（sticky 定位，仅在此容器内有效） -->
        <aside class="post-meta-sidebar">
          <div class="meta-inner">
            <div class="meta-item">
              <span class="meta-label">发布日期</span>
              <span class="meta-value">{{ formatDate(post.publishedAt) }}</span>
            </div>

            <!-- 分享区块 -->
            <div class="share-section">
              <span class="share-title">分享</span>
              <div class="share-links">
                <!-- 小红书 -->
                <button
                  class="share-link"
                  title="分享到小红书"
                  @click="shareToXiaohongshu"
                >
                  <img :src="xhsIcon" alt="小红书" class="share-icon-img">
                  <span>小红书</span>
                </button>
                <!-- 微博 -->
                <a
                  href="#"
                  class="share-link"
                  title="分享到微博"
                  @click.prevent="openSharePopup('weibo')"
                >
                  <img :src="wbIcon" alt="微博" class="share-icon-img">
                  <span>微博</span>
                </a>
              </div>
            </div>
          </div>

          <!-- 左侧广告位 -->
          <div v-if="sidebarAd" class="sidebar-promo">
            <a
              :href="sidebarAd.linkUrl"
              target="_blank"
              rel="noopener"
              @click="recordClick(sidebarAd.id)"
            >
              <img :src="sidebarAd.imageUrl" :alt="sidebarAd.title" />
            </a>
          </div>
        </aside>

        <!-- 主内容 -->
        <div class="post-main-content">
          <!-- 详情图片 -->
          <section class="post-detail-section">
            <!-- 图片作者信息 -->
            <div v-if="post.detailImage?.authorName" class="image-credit">
              <span>Photography </span>
              <a
                v-if="post.detailImage.authorLink"
                :href="post.detailImage.authorLink"
                target="_blank"
                rel="noopener"
              >
                {{ post.detailImage.authorName }}
              </a>
              <span v-else>{{ post.detailImage.authorName }}</span>
            </div>

            <!-- 图片 -->
            <figure v-if="post.detailImage?.url" class="detail-figure">
              <img :src="post.detailImage.url" :alt="post.title" />
            </figure>
          </section>

          <!-- 文章正文 -->
          <section class="post-content">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="prose" v-html="post.content" />
          </section>
        </div>
      </div>

      <!-- 相关文章 -->
      <section v-if="relatedPosts?.length" class="related-articles">
        <div class="related-container">
          <h2 class="related-title">RELATED ARTICLES</h2>

          <div class="related-grid">
            <article v-for="relatedPost in relatedPosts" :key="relatedPost.id" class="related-card">
              <NuxtLink :to="`/post/${relatedPost.slug}`">
                <div class="related-image">
                  <img :src="relatedPost.coverImage" :alt="relatedPost.title" />
                </div>
                <div class="related-content">
                  <span class="related-category">{{ relatedPost.category }}</span>
                  <h3 class="related-card-title">{{ relatedPost.title }}</h3>
                </div>
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { Advertisement } from '~/types/api'
import xhsIcon from '~/assets/images/xhs.svg'
import wbIcon from '~/assets/images/wb.svg'

const route = useRoute()
const postApi = usePostsApi()
const adsApi = useAdsApi()

// 获取文章详情
const slug = computed(() => route.params.slug as string)

const {
  data: post,
  pending,
  error,
} = await useAsyncData(`post-${slug.value}`, () => postApi.getBySlug(slug.value), { watch: [slug] })

// 获取相关文章
const { data: relatedData } = await useAsyncData(
  `related-${slug.value}`,
  async () => {
    if (!post.value?.id) return null
    return postApi.getRelated(post.value.id, { pageSize: 5 })
  },
  { watch: [() => post.value?.id] }
)

const relatedPosts = computed(() => relatedData.value?.data ?? [])

// 获取侧边栏广告（从文章关联广告中取第一个）
const sidebarAd = computed<Advertisement | null>(() => {
  const ads = post.value?.advertisements
  if (ads && ads.length > 0) {
    return ads[0].advertisement
  }
  return null
})

// 分享链接
const shareLinks = computed(() => {
  const title = encodeURIComponent(post.value?.title || '')
  const url = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''

  return {
    weibo: `https://service.weibo.com/share/share.php?url=${url}&title=${title}`,
  }
})

// 设置页面标题
useHead({
  title: computed(() => post.value?.title || '文章详情'),
})

// 格式化日期
function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 记录广告点击
function recordClick(id: string) {
  adsApi.recordClick(id)
}

// 打开分享小窗口
function openSharePopup(platform: 'weibo') {
  const url = shareLinks.value[platform]
  const width = 600
  const height = 400
  const left = (window.innerWidth - width) / 2 + window.screenX
  const top = (window.innerHeight - height) / 2 + window.screenY

  window.open(
    url,
    `share-${platform}`,
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  )
}

// 分享到小红书
async function shareToXiaohongshu() {
  const text = `${post.value?.title}\n${window.location.href}`
  
  // 先复制内容到剪贴板
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // 忽略复制失败
  }

  // 尝试打开小红书 App
  const schemeUrl = 'xhsdiscover://home'
  const startTime = Date.now()
  
  // 创建隐藏的 iframe 尝试唤起 App
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = schemeUrl
  document.body.appendChild(iframe)

  // 检测是否成功打开 App
  setTimeout(() => {
    document.body.removeChild(iframe)
    const elapsed = Date.now() - startTime
    
    // 如果页面还在且时间很短，说明 App 没有打开
    if (elapsed < 2000 && document.visibilityState !== 'hidden') {
      ElMessage.success('链接已复制，请打开小红书 App 粘贴分享')
    }
  }, 1500)
}
</script>

<style lang="scss" scoped>
.post-detail {
  min-height: 100vh;
}

// 文章头部
.post-header {
  padding: 60px 0 40px;
  border-bottom: 1px solid #eee;
}

.header-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;

  @media (max-width: 768px) {
    text-align: left;
  }
}

// 主内容包裹器（限制侧边栏范围）
.post-main-wrapper {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
}

// 左侧元信息（sticky 定位，仅在 wrapper 内有效）
.post-meta-sidebar {
  position: sticky;
  top: 100px;
  align-self: flex-start;
  width: 180px;
  flex-shrink: 0;
  margin-right: 60px;

  @media (max-width: 1024px) {
    position: static;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 16px 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #eee;
    margin-bottom: 24px;
    margin-right: 0;
  }
}

// 主内容区
.post-main-content {
  flex: 1;
  max-width: 800px;
}

// 详情图片区域
.post-detail-section {
  margin-bottom: 40px;
}

.meta-item {
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
}

.meta-label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin-bottom: 4px;
}

.meta-value {
  font-size: 13px;
  color: #333;
}

.meta-link {
  color: #c45c4a;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.meta-author {
  font-weight: 500;
  color: #1a1a1a;
}

// 分享区块
.share-section {
  margin: 24px 0;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;

  @media (max-width: 1024px) {
    margin: 0;
    padding-top: 0;
    border-top: none;
  }
}

.share-title {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #999;
  margin-bottom: 12px;
  font-weight: 500;
}

.share-links {
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 1024px) {
    flex-direction: row;
    gap: 16px;
  }
}

.share-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #333;
  text-decoration: none;
  transition: opacity 0.2s ease;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
}

.share-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.share-icon-img {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

// 左侧广告位
.sidebar-promo {
  margin-top: 24px;

  a {
    display: block;
  }

  img {
    width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.category-tag {
  display: inline-block;
  padding: 4px 0;
  margin-bottom: 16px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #c45c4a;
  border-bottom: 1px solid #c45c4a;
}

.post-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 400;
  line-height: 1.1;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.post-excerpt {
  font-size: 15px;
  line-height: 1.7;
  color: #555;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    margin: 0;
  }
}
.image-credit {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  font-style: italic;

  a {
    color: #c45c4a;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.detail-figure {
  margin: 0;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.content-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 24px;
}

.prose {
  font-size: 16px;
  line-height: 1.8;
  color: #333;

  :deep(h2) {
    font-size: 28px;
    font-weight: 400;
    margin: 48px 0 24px;
    color: #1a1a1a;
  }

  :deep(h3) {
    font-size: 22px;
    font-weight: 400;
    margin: 36px 0 16px;
    color: #1a1a1a;
  }

  :deep(p) {
    margin-bottom: 24px;
  }

  :deep(blockquote) {
    margin: 32px 0;
    padding-left: 24px;
    border-left: 3px solid #c45c4a;
    font-style: italic;
    color: #555;
  }

  :deep(figure) {
    margin: 32px 0;

    img {
      width: 100%;
      height: auto;
    }

    figcaption {
      font-size: 13px;
      color: #888;
      text-align: center;
      margin-top: 12px;
    }
  }

  :deep(ul),
  :deep(ol) {
    margin: 24px 0;
    padding-left: 24px;
  }

  :deep(li) {
    margin-bottom: 8px;
  }

  :deep(a) {
    color: #c45c4a;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
}

// 相关文章
.related-articles {
  padding: 60px 0;
  border-top: 1px solid #eee;
  background: #fafafa;
}

.related-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.related-title {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #999;
  text-align: center;
  margin-bottom: 40px;
}

.related-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.related-card {
  width: calc((100% - 96px) / 5); // 5列，4个间距

  @media (max-width: 1024px) {
    width: calc((100% - 48px) / 3); // 3列
  }

  @media (max-width: 768px) {
    width: calc((100% - 24px) / 2); // 2列
  }

  @media (max-width: 480px) {
    width: 100%; // 1列
    max-width: 280px;
  }

  a {
    display: block;
    text-decoration: none;
  }
}

.related-image {
  aspect-ratio: 1;
  overflow: hidden;
  margin-bottom: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.related-content {
  text-align: center;
}

.related-category {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #c45c4a;
  margin-bottom: 6px;
}

.related-card-title {
  font-size: 16px;
  font-weight: 400;
  color: #1a1a1a;
  line-height: 1.3;
}
</style>
