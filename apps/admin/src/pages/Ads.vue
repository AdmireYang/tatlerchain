<template>
  <div class="ads-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="text-2xl font-bold">广告管理</h1>
      <ElButton type="primary" @click="handleCreate">
        <ElIcon><Plus /></ElIcon>
        新建广告
      </ElButton>
    </div>

    <!-- 广告列表 -->
    <ElCard class="list-card" shadow="never">
      <!-- 骨架屏 -->
      <ListSkeleton v-if="loading" :count="pageSize" />

      <!-- 空状态 -->
      <div v-else-if="data.length === 0">
        <ElEmpty description="暂无广告数据" />
      </div>

      <!-- 广告列表 -->
      <div v-else class="ad-list">
        <div v-for="ad in data" :key="ad.id" class="ad-card">
          <!-- 广告图片 -->
          <div class="ad-image-wrapper">
            <ElImage :src="ad.imageUrl" fit="cover" class="ad-image">
              <template #error>
                <div class="image-error">
                  <ElIcon><Picture /></ElIcon>
                </div>
              </template>
            </ElImage>
          </div>

          <!-- 广告内容 -->
          <div class="ad-content">
            <div class="ad-header">
              <div class="ad-title" :title="ad.title">{{ ad.title }}</div>
              <div class="ad-meta">
                <ElCheckbox
                  :model-value="ad.status === 'ACTIVE'"
                  @change="handleToggleStatus(ad.id, ad.status)"
                  label="在前台展示"
                />
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="ad-actions">
            <ElButton size="small" @click="handleEdit(ad.id)">编辑</ElButton>
            <ElButton size="small" @click="handlePreview(ad.linkUrl)">预览</ElButton>
            <ElButton size="small" type="danger" @click="handleDelete(ad.id)">删除</ElButton>
            <ElButton size="small" @click="handleCopyLink(ad.linkUrl)">复制链接</ElButton>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="data.length > 0" class="pagination-wrapper">
        <ElPagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Picture } from '@element-plus/icons-vue'
import { useAdStore } from '@/stores'
import { useTable } from '@/composables'
import { getAds } from '@/api'
import { showDeleteConfirm } from '@/utils'
import ListSkeleton from '@/components/common/ListSkeleton.vue'

const router = useRouter()
const adStore = useAdStore()

// 使用 useTable 管理表格数据
const { data, total, loading, page, pageSize, fetchData, handlePageChange, handlePageSizeChange } =
  useTable(getAds)

// 新建广告
function handleCreate() {
  router.push('/ads/create')
}

// 编辑广告
function handleEdit(id: string) {
  router.push(`/ads/edit/${id}`)
}

// 预览广告
function handlePreview(url: string) {
  window.open(url, '_blank')
}

// 复制链接
async function handleCopyLink(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('链接已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 切换展示状态
async function handleToggleStatus(id: string, currentStatus: string) {
  try {
    if (currentStatus === 'ACTIVE') {
      // 当前是活跃状态，需要取消发布（暂时没有这个接口，可以先提示）
      ElMessage.warning('取消发布功能待实现')
    } else {
      // 当前是未激活状态，发布
      await adStore.publish(id)
      ElMessage.success('已发布到前台')
      fetchData()
    }
  } catch {
    ElMessage.error('操作失败')
  }
}

// 删除广告
async function handleDelete(id: string) {
  const confirmed = await showDeleteConfirm('这个广告')
  if (!confirmed) return

  try {
    await adStore.remove(id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.ads-page {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .list-card {
    .ad-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 200px;
    }

    .ad-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border: 1px solid #ebeef5;
      border-radius: 8px;
      background: #fff;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .ad-image-wrapper {
        flex-shrink: 0;
        width: 120px;
        height: 80px;
        background: #f5f7fa;
        border-radius: 4px;
        overflow: hidden;

        .ad-image {
          width: 100%;
          height: 100%;
        }

        .image-error {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 32px;
          color: #c0c4cc;
        }
      }

      .ad-content {
        flex: 1;
        min-width: 0;

        .ad-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ad-title {
          font-size: 15px;
          font-weight: 500;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ad-meta {
          display: flex;
          align-items: center;
        }
      }

      .ad-actions {
        flex-shrink: 0;
        display: flex;
        gap: 8px;
      }
    }

    .pagination-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
