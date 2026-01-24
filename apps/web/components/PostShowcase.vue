<template>
  <div class="showcase-wrapper">
    <!-- 文章卡片 -->
    <article class="post-showcase">
      <!-- 左侧：封面图 -->
      <div class="showcase-image">
        <NuxtLink :to="`/post/${post.slug}`">
          <img :src="post.coverImage" :alt="post.title" />
        </NuxtLink>
      </div>

      <!-- 右侧：内容区 -->
      <div class="showcase-content">
        <div class="content-inner">
          <!-- 分类标签 -->
          <span class="category-tag">{{ getCategoryLabel(post.category) }}</span>

          <!-- 标题 -->
          <h2 class="showcase-title">
            <NuxtLink :to="`/post/${post.slug}`">
              {{ post.title }}
            </NuxtLink>
          </h2>

          <!-- 描述 -->
          <p class="showcase-excerpt">{{ post.excerpt }}</p>
        </div>
      </div>
    </article>

    <!-- 广告横幅（如果配置了广告） -->
    <AdBanner v-if="firstAd" :item="firstAd" />
  </div>
</template>

<script setup lang="ts">
import type { PostListItem } from '~/types/api'
import { CATEGORY_MAP, type CategoryKey } from '@port/types'

const props = defineProps<{
  post: PostListItem
}>()

// 获取分类标签
function getCategoryLabel(key: string): string {
  return CATEGORY_MAP[key as CategoryKey] || key || ''
}

// 获取第一个广告（如果有配置）
const firstAd = computed(() => {
  const ads = props.post.advertisements
  if (ads && ads.length > 0) {
    return ads[0].advertisement
  }
  return null
})
</script>

<style lang="scss" scoped>
.showcase-wrapper {
  display: flex;
  flex-direction: column;
  gap: 48px;

  @media (max-width: 768px) {
    gap: 32px;
  }
}

.post-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 400px;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}

// 左侧图片区域
.showcase-image {
  position: relative;
  overflow: hidden;
  max-height: 400px;

  a {
    display: block;
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  &:hover img {
    transform: scale(1.03);
  }

  @media (max-width: 768px) {
    aspect-ratio: 4 / 3;
  }
}

// 右侧内容区域
.showcase-content {
  display: flex;
  align-items: center;
  padding: 48px 56px;

  @media (max-width: 1024px) {
    padding: 36px 40px;
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
}

.content-inner {
  max-width: 420px;
}

// 分类标签
.category-tag {
  display: inline-block;
  padding: 4px 0;
  margin-bottom: 20px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #c45c4a; // 红褐色
  border-bottom: 1px solid #c45c4a;
}

// 标题
.showcase-title {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 400;
  line-height: 1.1;
  color: theme('colors.dark');
  margin-bottom: 20px;

  a {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }
  }
}

// 描述
.showcase-excerpt {
  font-size: 14px;
  line-height: 1.7;
  color: #4a4a4a;
  font-style: italic;
}
</style>
