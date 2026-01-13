<template>
  <div class="posts-dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard title="推文总数" :value="stats?.total || 0" :icon="Document" color="#409eff" />
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard title="已发布" :value="stats?.published || 0" :icon="Check" color="#67c23a" />
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard title="草稿" :value="stats?.draft || 0" :icon="Edit" color="#e6a23c" />
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard title="总浏览量" :value="stats?.totalViews || 0" :icon="View" color="#f56c6c" />
      </el-col>
    </el-row>

    <!-- 趋势图表 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="24">
        <el-card>
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
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 最受欢迎的推文 -->
    <el-row :gutter="16">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最受欢迎的推文（Top 10）</span>
            </div>
          </template>
          <el-table
            v-if="stats?.topPosts && stats.topPosts.length > 0"
            :data="stats.topPosts"
            stripe
          >
            <el-table-column type="index" label="排名" width="80" />
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="viewCount" label="浏览量" width="120" align="right">
              <template #default="{ row }">
                <el-tag type="danger">{{ row.viewCount.toLocaleString() }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="publishedAt" label="发布时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.publishedAt) }}
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Document, Check, Edit, View } from '@element-plus/icons-vue'
import StatCard from './StatCard.vue'
import TrendChart from './TrendChart.vue'
import type { PostStats } from '@/api/dashboard'

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
