<template>
  <div class="ads-dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard
          title="广告总数"
          :value="stats?.total || 0"
          :icon="PictureFilled"
          color="#409eff"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard title="活跃广告" :value="stats?.active || 0" :icon="Check" color="#67c23a" />
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard
          title="总点击次数"
          :value="stats?.totalClicks || 0"
          :icon="Mouse"
          color="#e6a23c"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <StatCard
          title="总展示次数"
          :value="stats?.totalImpressions || 0"
          :icon="View"
          color="#f56c6c"
        />
      </el-col>
    </el-row>

    <!-- 点击率卡片 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="24">
        <el-card>
          <div class="ctr-display">
            <div class="ctr-label">平均点击率 (CTR)</div>
            <div class="ctr-value">{{ stats?.ctr || '0' }}%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图表 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>广告点击率趋势（最近 7 天）</span>
            </div>
          </template>
          <TrendChart
            v-if="trendData"
            :data="trendData"
            type="bar"
            color="#67c23a"
            height="300px"
          />
          <el-empty v-else description="暂无数据" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 表现最好的广告 -->
    <el-row :gutter="16">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>表现最好的广告（Top 10）</span>
            </div>
          </template>
          <el-table v-if="stats?.topAds && stats.topAds.length > 0" :data="stats.topAds" stripe>
            <el-table-column type="index" label="排名" width="80" />
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="clickCount" label="点击次数" width="120" align="right">
              <template #default="{ row }">
                {{ row.clickCount.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="impressionCount" label="展示次数" width="120" align="right">
              <template #default="{ row }">
                {{ row.impressionCount.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="ctr" label="点击率" width="100" align="right">
              <template #default="{ row }">
                <el-tag type="success">{{ row.ctr }}%</el-tag>
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
import { PictureFilled, Check, Mouse, View } from '@element-plus/icons-vue'
import StatCard from './StatCard.vue'
import TrendChart from './TrendChart.vue'
import type { AdStats } from '@/api/dashboard'

interface Props {
  stats: AdStats | null
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
    values: props.stats.trend.map((item) => item.ctr),
    name: '点击率 (%)',
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
.ads-dashboard {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  .mb-4 {
    margin-bottom: 16px;
  }

  .ctr-display {
    text-align: center;
    padding: 20px 0;

    .ctr-label {
      font-size: 16px;
      color: #909399;
      margin-bottom: 12px;
    }

    .ctr-value {
      font-size: 48px;
      font-weight: 700;
      color: #67c23a;
    }
  }
}
</style>
