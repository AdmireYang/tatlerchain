<template>
  <div class="promo-banner">
    <a :href="item.linkUrl" target="_blank" rel="noopener" class="promo-link">
      <!-- 背景图片 -->
      <div class="promo-background">
        <img :src="item.imageUrl" :alt="item.title" />
      </div>

      <!-- 内容覆盖层 -->
      <div class="promo-overlay">
        <div class="promo-content">
          <span v-if="item.category" class="promo-category">{{ item.category }}</span>
          <h3 class="promo-title">{{ item.title }}</h3>
          <button class="promo-button">SEE MORE</button>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
interface PromoInfo {
  id: string
  title: string
  category?: string
  imageUrl: string
  linkUrl: string
}

defineProps<{
  item: PromoInfo
}>()
</script>

<style lang="scss" scoped>
.promo-banner {
  width: 100%;
  position: relative;
}

.promo-link {
  display: block;
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  text-decoration: none;

  @media (max-width: 768px) {
    height: 200px;
  }
}

.promo-background {
  position: absolute;
  inset: 0;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  .promo-link:hover & img {
    transform: scale(1.03);
  }
}

.promo-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

.promo-content {
  text-align: center;
  color: #fff;
  padding: 20px;
}

.promo-category {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #c45c4a;
  margin-bottom: 16px;
  padding: 6px 14px 4px;
  background: rgba(255, 255, 255, 0.35);
  border-bottom: 2px solid #c45c4a;
  backdrop-filter: blur(2px);
}

.promo-title {
  font-size: clamp(18px, 3vw, 28px);
  font-weight: 400;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 24px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
}

.promo-button {
  display: inline-block;
  padding: 12px 32px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fff;
  background: transparent;
  border: 1px solid #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #fff;
    color: #1a1a1a;
  }
}
</style>
