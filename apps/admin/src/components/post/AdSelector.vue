<template>
  <ElDialog
    v-model="dialogVisible"
    title="选择广告"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 搜索栏 -->
    <div class="search-bar">
      <ElInput v-model="searchKeyword" placeholder="搜索广告标题" clearable @input="handleSearch">
        <template #prefix>
          <ElIcon><Search /></ElIcon>
        </template>
      </ElInput>
    </div>

    <!-- 广告列表 -->
    <div v-loading="loading" class="ad-list">
      <ElCheckboxGroup v-model="selectedAdIds">
        <div v-for="ad in ads" :key="ad.id" class="ad-item">
          <ElCheckbox :value="ad.id" :label="ad.id">
            <div class="ad-content">
              <ElImage :src="ad.imageUrl" fit="cover" class="ad-image">
                <template #error>
                  <div class="image-error">
                    <ElIcon><Picture /></ElIcon>
                  </div>
                </template>
              </ElImage>
              <div class="ad-info">
                <div class="ad-title">{{ ad.title }}</div>
                <div class="ad-meta">
                  <ElTag size="small" type="info">{{ ad.category }}</ElTag>
                  <ElTag size="small" :type="ad.status === 'ACTIVE' ? 'success' : 'info'">
                    {{ ad.status === 'ACTIVE' ? '已发布' : '未发布' }}
                  </ElTag>
                </div>
              </div>
            </div>
          </ElCheckbox>
        </div>
      </ElCheckboxGroup>

      <!-- 空状态 -->
      <ElEmpty v-if="!loading && ads.length === 0" description="暂无广告" />
    </div>

    <!-- 分页 -->
    <div v-if="total > pageSize" class="pagination">
      <ElPagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="handleClose">取消</ElButton>
        <ElButton type="primary" @click="handleConfirm">
          确定 (已选 {{ selectedAdIds.length }} 个)
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Picture } from '@element-plus/icons-vue'
import { getAds } from '@/api/ad'
import type { Advertisement } from '@/types/api'

// ==================== Props & Emits ====================

interface Props {
  visible: boolean
  selectedIds?: string[]
}

interface Emits {
  'update:visible': [value: boolean]
  confirm: [selectedIds: string[]]
}

const props = withDefaults(defineProps<Props>(), {
  selectedIds: () => [],
})

const emit = defineEmits<Emits>()

// ==================== 状态 ====================

const dialogVisible = ref(false)
const ads = ref<Advertisement[]>([])
const selectedAdIds = ref<string[]>([])
const searchKeyword = ref('')
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 防抖定时器
let searchTimer: ReturnType<typeof setTimeout> | null = null

// ==================== 方法 ====================

/**
 * 获取广告列表
 */
async function fetchAds() {
  loading.value = true
  try {
    const response = await getAds({
      page: page.value,
      pageSize: pageSize.value,
      search: searchKeyword.value || undefined,
      status: 'ACTIVE', // 只显示已发布的广告
    })
    ads.value = response.data.data.data
    total.value = response.data.data.meta.total
  } catch (error) {
    console.error('获取广告列表失败:', error)
    ElMessage.error('获取广告列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 处理搜索
 */
function handleSearch() {
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  // 设置新的定时器，300ms 后执行搜索
  searchTimer = setTimeout(() => {
    page.value = 1 // 重置到第一页
    fetchAds()
  }, 300)
}

/**
 * 处理关闭
 */
function handleClose() {
  emit('update:visible', false)
}

/**
 * 处理确认
 */
function handleConfirm() {
  emit('confirm', selectedAdIds.value)
  handleClose()
}

// ==================== 监听 ====================

watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
    if (newVal) {
      // 对话框打开时，初始化选中的广告 ID
      selectedAdIds.value = [...props.selectedIds]
      // 重置搜索和分页
      searchKeyword.value = ''
      page.value = 1
      // 获取广告列表
      fetchAds()
    }
  }
)

// 监听分页变化
watch([page, pageSize], () => {
  if (dialogVisible.value) {
    fetchAds()
  }
})

// ==================== 生命周期 ====================

onMounted(() => {
  dialogVisible.value = props.visible
})
</script>

<style scoped lang="scss">
.search-bar {
  margin-bottom: 16px;
}

.ad-list {
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
}

.ad-item {
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 12px;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
    background-color: #f5f7fa;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.ad-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.ad-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  flex-shrink: 0;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

.ad-info {
  flex: 1;
  min-width: 0;
}

.ad-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ad-meta {
  display: flex;
  gap: 8px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-checkbox) {
  width: 100%;
  height: auto;
  margin-right: 0;
}

:deep(.el-checkbox__label) {
  width: 100%;
  padding-left: 12px;
}
</style>
