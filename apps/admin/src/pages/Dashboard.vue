<template>
  <div class="dashboard-page">
    <h1 class="text-2xl font-bold mb-4">数据看板</h1>

    <ElTabs v-model="activeTab" @tab-change="handleTabChange">
      <ElTabPane label="推文看板" name="posts">
        <PostsDashboard v-if="activeTab === 'posts'" :stats="dashboardStore.postsStats" />
      </ElTabPane>
      <ElTabPane label="广告看板" name="ads">
        <AdsDashboard v-if="activeTab === 'ads'" :stats="dashboardStore.adsStats" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import PostsDashboard from '@/components/dashboard/PostsDashboard.vue'
import AdsDashboard from '@/components/dashboard/AdsDashboard.vue'
import { ElMessage } from 'element-plus'

const dashboardStore = useDashboardStore()
const activeTab = ref('posts')

// 加载数据
const loadData = async () => {
  try {
    await dashboardStore.fetchOverview()
  } catch (error: any) {
    ElMessage.error(error.message || '加载数据失败')
  }
}

// 标签页切换
const handleTabChange = (tabName: string | number) => {
  console.log('切换到标签页:', tabName)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.dashboard-page {
  padding: 20px;

  :deep(.el-tabs__content) {
    padding-top: 20px;
  }
}
</style>
