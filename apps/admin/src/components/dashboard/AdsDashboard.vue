<template>
  <div class="ads-dashboard">
    <!-- 统计卡片 -->
    <ElRow :gutter="16" class="mb-4">
      <ElCol :xs="24" :sm="12" :md="8">
        <StatCard
          title="广告总数"
          :value="stats?.total || 0"
          :icon="PictureFilled"
          color="#409eff"
        />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="8">
        <StatCard title="活跃广告" :value="stats?.active || 0" :icon="Check" color="#67c23a" />
      </ElCol>
      <ElCol :xs="24" :sm="12" :md="8">
        <StatCard
          title="总点击次数"
          :value="stats?.totalClicks || 0"
          :icon="Mouse"
          color="#e6a23c"
        />
      </ElCol>
    </ElRow>

    <!-- 表现最好的广告 -->
    <ElRow :gutter="16">
      <ElCol :span="24">
        <ElCard>
          <template #header>
            <div class="card-header">
              <span>表现最好的广告（Top 10）</span>
            </div>
          </template>
          <ElTable v-if="stats?.topAds && stats.topAds.length > 0" :data="stats.topAds" stripe>
            <ElTableColumn type="index" label="排名" width="80" />
            <ElTableColumn prop="title" label="标题" min-width="200" />
            <ElTableColumn prop="clickCount" label="点击次数" width="120" align="right">
              <template #default="{ row }">
                {{ row.clickCount.toLocaleString() }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="publishedAt" label="发布时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.publishedAt) }}
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <ElButton type="primary" size="small" text @click="handlePreview(row.linkUrl)">
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
import { useRouter } from 'vue-router'
import { PictureFilled, Check, Mouse, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import StatCard from './StatCard.vue'
import type { AdStats } from '@/api/dashboard'

const router = useRouter()

interface Props {
  stats: AdStats | null
}

const props = defineProps<Props>()

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

// 预览广告
const handlePreview = (linkUrl: string) => {
  if (!linkUrl) {
    ElMessage.warning('该广告没有设置链接')
    return
  }
  window.open(linkUrl, '_blank')
}

// 编辑广告
const handleEdit = (id: string) => {
  router.push(`/ads/edit/${id}`)
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
}
</style>
