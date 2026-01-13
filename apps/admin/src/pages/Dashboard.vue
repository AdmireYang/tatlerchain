<template>
  <div class="dashboard-page">
    <h1 class="text-2xl font-bold mb-4">数据看板</h1>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="推文看板" name="posts">
        <PostsDashboard :stats="dashboardStore.postsStats" />
      </el-tab-pane>
      <el-tab-pane label="广告看板" name="ads">
        <AdsDashboard :stats="dashboardStore.adsStats" />
      </el-tab-pane>
    </el-tabs>
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
