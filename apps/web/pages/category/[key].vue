<template>
  <div class="min-h-screen">
    <!-- 分类标题 -->
    <header class="category-header">
      <h1 class="category-title">{{ categoryLabel }}</h1>
    </header>

    <!-- 有数据时显示文章列表 -->
    <template v-if="posts.length > 0">
      <!-- 文章展示 -->
      <section class="py-8 md:py-12">
        <div class="max-w-7xl mx-auto px-4 md:px-6 space-y-12 md:space-y-16">
          <PostShowcase v-for="post in posts" :key="post.id" :post="post" />
        </div>
      </section>

      <!-- 加载更多 -->
      <section v-if="hasMore" class="load-more-section">
        <button class="load-more-btn" :disabled="loading" @click="loadMore">
          <LoadingSpinner v-if="loading" size="small" />
          <span v-else>SHOW ME MORE</span>
        </button>
      </section>
    </template>

    <!-- 无数据时显示空状态 -->
    <EmptyState v-else-if="!initialLoading" title="暂无文章" :description="`${categoryLabel}分类下暂无文章`" />

    <!-- 初始加载状态 -->
    <div v-else class="loading-state">
      <LoadingSpinner />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_MAP, type CategoryKey } from '@port/types'
import type { PostListItem } from '~/types/api'

const route = useRoute()
const postApi = usePostsApi()
const PAGE_SIZE = 6

// 获取分类 key
const categoryKey = computed(() => route.params.key as CategoryKey)

// 获取分类标签
const categoryLabel = computed(() => CATEGORY_MAP[categoryKey.value] || categoryKey.value)

// 状态
const posts = ref<PostListItem[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const initialLoading = ref(true)

// 是否还有更多
const hasMore = computed(() => currentPage.value < totalPages.value)

// 加载数据
async function fetchPosts(page: number) {
  const res = await postApi.getList({
    page,
    pageSize: PAGE_SIZE,
    category: categoryKey.value,
  })
  return {
    data: res.data || [],
    totalPages: res.meta.totalPages || 1,
  }
}

// 初始加载
const { data: initialData } = await useAsyncData(
  `category-${categoryKey.value}`,
  () => fetchPosts(1),
  { watch: [categoryKey] }
)

// 监听分类变化，重置数据
watch(categoryKey, async () => {
  posts.value = []
  currentPage.value = 1
  initialLoading.value = true
  
  const result = await fetchPosts(1)
  posts.value = result.data
  totalPages.value = result.totalPages
  initialLoading.value = false
})

// 初始化数据
if (initialData.value) {
  posts.value = initialData.value.data
  totalPages.value = initialData.value.totalPages
  initialLoading.value = false
}

// 加载更多
async function loadMore() {
  if (loading.value || !hasMore.value) return

  loading.value = true
  try {
    const nextPage = currentPage.value + 1
    const result = await fetchPosts(nextPage)

    posts.value = [...posts.value, ...result.data]
    currentPage.value = nextPage
    totalPages.value = result.totalPages
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: `${categoryLabel.value} - Tatler Chain`,
  meta: [
    { name: 'description', content: `${categoryLabel.value}分类下的所有文章` },
  ],
})
</script>

<style lang="scss" scoped>
.category-header {
  text-align: center;
  padding: 48px 24px 0;

  @media (min-width: 768px) {
    padding: 64px 24px 0;
  }
}

.category-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 4px;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
}

.load-more-section {
  display: flex;
  justify-content: center;
  padding: 48px 24px 80px;
  border-top: 1px solid #e5e5e5;
  margin-top: 48px;
}

.load-more-btn {
  padding: 16px 48px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #333;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    color: #c45c4a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
</style>
