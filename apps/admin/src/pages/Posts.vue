<template>
  <div class="posts-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="text-2xl font-bold">推文管理</h1>
      <ElButton type="primary" @click="handleCreate">
        <ElIcon><Plus /></ElIcon>
        新建推文
      </ElButton>
    </div>

    <!-- 推文列表 -->
    <ElCard class="list-card" shadow="never">
      <!-- 骨架屏 -->
      <ListSkeleton v-if="loading" :count="pageSize" />

      <!-- 空状态 -->
      <div v-else-if="data.length === 0">
        <ElEmpty description="暂无推文数据" />
      </div>

      <!-- 推文列表 -->
      <div v-else class="post-list">
        <div v-for="post in data" :key="post.id" class="post-card">
          <!-- 封面图片 -->
          <div class="post-image-wrapper">
            <ElImage :src="post.coverImage" fit="cover" class="post-image">
              <template #error>
                <div class="image-error">
                  <ElIcon><Picture /></ElIcon>
                </div>
              </template>
            </ElImage>
          </div>

          <!-- 推文内容 -->
          <div class="post-content">
            <div class="post-header">
              <div class="post-title" :title="post.title">{{ post.title }}</div>
              <div class="post-meta">
                <ElTag v-if="post.status === 'DRAFT'" type="info" size="small">草稿</ElTag>
                <ElTag v-else-if="post.status === 'PUBLISHED'" type="success" size="small">
                  已发布
                </ElTag>
                <ElTag v-else-if="post.status === 'ARCHIVED'" type="warning" size="small">
                  已归档
                </ElTag>
                <span class="post-category">{{ post.category }}</span>
                <span class="post-views">浏览 {{ post.viewCount }}</span>
              </div>
              <div v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="post-actions">
            <ElButton size="small" @click="handleEdit(post.id)">编辑</ElButton>
            <ElButton
              v-if="post.status === 'DRAFT'"
              size="small"
              type="success"
              @click="handlePublish(post.id)"
            >
              发布
            </ElButton>
            <ElButton size="small" type="danger" @click="handleDelete(post.id)">删除</ElButton>
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
import { usePostStore } from '@/stores'
import { useTable } from '@/composables'
import { getPosts } from '@/api'
import { showDeleteConfirm, showPublishConfirm } from '@/utils'
import ListSkeleton from '@/components/common/ListSkeleton.vue'

const router = useRouter()
const postStore = usePostStore()

// 使用 useTable 管理表格数据
const { data, total, loading, page, pageSize, fetchData, handlePageChange, handlePageSizeChange } =
  useTable(getPosts)

// 新建推文
function handleCreate() {
  router.push('/posts/create')
}

// 编辑推文
function handleEdit(id: string) {
  router.push(`/posts/edit/${id}`)
}

// 发布推文
async function handlePublish(id: string) {
  const confirmed = await showPublishConfirm('这篇推文')
  if (!confirmed) return

  try {
    await postStore.publish(id)
    ElMessage.success('发布成功')
    fetchData()
  } catch (error) {
    ElMessage.error('发布失败')
  }
}

// 删除推文
async function handleDelete(id: string) {
  const confirmed = await showDeleteConfirm('这篇推文')
  if (!confirmed) return

  try {
    await postStore.remove(id)
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
.posts-page {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .list-card {
    .post-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 200px;
    }

    .post-card {
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

      .post-image-wrapper {
        flex-shrink: 0;
        width: 120px;
        height: 80px;
        background: #f5f7fa;
        border-radius: 4px;
        overflow: hidden;

        .post-image {
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

      .post-content {
        flex: 1;
        min-width: 0;

        .post-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .post-title {
          font-size: 15px;
          font-weight: 500;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #909399;

          .post-category {
            padding: 2px 8px;
            background: #f0f2f5;
            border-radius: 4px;
          }
        }

        .post-excerpt {
          font-size: 13px;
          color: #606266;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .post-actions {
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
