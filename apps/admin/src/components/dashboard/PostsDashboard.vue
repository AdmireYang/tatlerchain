<template>
  <div class="posts-dashboard">
    <!-- 统计卡片 -->
    <ElRow :gutter="16" class="mb-4">
      <ElCol :xs="24" :sm="12" :md="6">
        <StatCard title="推文总数" :value="stats?.total || 0" :icon="Document" color="#409eff" />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <StatCard title="已发布" :value="stats?.published || 0" :icon="Check" color="#67c23a" />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <StatCard title="草稿" :value="stats?.draft || 0" :icon="Edit" color="#e6a23c" />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="6">
        <StatCard title="总浏览量" :value="stats?.totalViews || 0" :icon="View" color="#f56c6c" />
      </ElCol>
    </ElRow>

    <!-- 趋势图表 -->
    <ElRow :gutter="16" class="mb-4">
      <ElCol :span="24">
        <ElCard>
          <template #header>
            <div class="card-header">
              <span>推文发布趋势（最近 7 天）</span>
            </div>
          </template>
          <TrendChart
            v-if="trendData"
            :data="trendData"
            type="line"
            color="#409eff"
            height="300px"
          />
          <ElEmpty v-else description="暂无数据" />
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 最受欢迎的推文 -->
    <ElRow :gutter="16">
      <ElCol :span="24">
        <ElCard>
          <template #header>
            <div class="card-header">
              <span>最受欢迎的推文（Top 10）</span>
            </div>
          </template>
          <ElTable
            v-if="stats?.topPosts && stats.topPosts.length > 0"
            :data="stats.topPosts"
            stripe
          >
            <ElTableColumn type="index" label="排名" width="80" />
            <ElTableColumn prop="title" label="标题" min-width="200" />
            <ElTableColumn prop="viewCount" label="浏览量" width="120" align="right">
              <template #default="{ row }">
                <ElTag type="danger">{{ row.viewCount.toLocaleString() }}</ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="publishedAt" label="发布时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.publishedAt) }}
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <ElButton type="primary" size="small" text @click="handlePreview(row.id, row.slug)">
                  预览
                </ElButton>
                <ElButton type="primary" size="small" text @click="handleEdit(row.id)">
                  编辑
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
          <ElEmpty v-else description="暂无数据" />
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Check, Edit, View } from '@element-plus/icons-vue'
import StatCard from './StatCard.vue'
import TrendChart from './TrendChart.vue'
import type { PostStats } from '@/api/dashboard'

const router = useRouter()
const WEB_URL = import.meta.env.VITE_WEB_URL || 'http://localhost:3004'

interface Props {
  stats: PostStats | null
}

const props = defineProps<Props>()

// 格式化趋势数据
const trendData = computed(() => {
  if (!props.stats?.trend || props.stats.trend.length === 0) {
    return null
  }

  return {
    labels: props.stats.trend.map((item) => {
      const date = new Date(item.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }),
    values: props.stats.trend.map((item) => item.count),
    name: '发布数量',
  }
})

// 格式化日期
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 预览推文
const handlePreview = (id: string, slug: string) => {
  const url = `${WEB_URL}/post/${slug || id}`
  window.open(url, '_blank')
}

// 编辑推文
const handleEdit = (id: string) => {
  router.push(`/posts/edit/${id}`)
}
</script>

<style scoped lang="scss">
.posts-dashboard {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  .mb-4 {
    margin-bottom: 16px;
  }
}
</style>
