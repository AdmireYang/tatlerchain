<template>
  <div class="min-h-screen">
    <!-- 有数据时显示文章列表 -->
    <template v-if="posts.length > 0">
      <!-- 首页文章展示 -->
      <section class="py-8 md:py-16">
        <div class="max-w-7xl mx-auto px-4 md:px-6 space-y-12 md:space-y-16">
          <PostShowcase v-for="post in posts" :key="post.id" :post="post" />
        </div>
      </section>

      <!-- 加载更多 -->
      <section v-if="hasMore" class="load-more-section">
        <button class="load-more-btn" :disabled="loading" @click="loadMore">
          <LoadingSpinner v-if="loading" size="small" />
          <span v-else>查看更多</span>
        </button>
      </section>
    </template>

    <!-- 无数据时显示空状态 -->
    <EmptyState v-else title="暂无文章" description="目前还没有发布任何文章，请稍后再来查看。" />
  </div>
</template>

<script setup lang="ts">
import type { PostListItem } from '~/types/api'

useHead({
  title: '首页',
})

const postApi = usePostsApi()
const PAGE_SIZE = 6

// 状态
const posts = ref<PostListItem[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(false)

// 是否还有更多
const hasMore = computed(() => currentPage.value < totalPages.value)
// 加载数据
async function fetchPosts(page: number) {
  const res = await postApi.getList({ page, pageSize: PAGE_SIZE })
  return {
    data: res.data || [],
    totalPages: res.meta.totalPages || 1,
  }
}

// 初始加载
const { data: initialData } = await useAsyncData('posts-initial', () => fetchPosts(1))

if (initialData.value) {
  posts.value = initialData.value.data
  totalPages.value = initialData.value.totalPages
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
</script>

<style lang="scss" scoped>
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
</style>
