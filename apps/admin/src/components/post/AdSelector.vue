<template>
  <ElDialog
    v-model="dialogVisible"
    title="选择广告"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 搜索栏 -->
    <div class="search-bar">
      <ElInput
        v-model="searchKeyword"
        placeholder="搜索广告标题"
        clearable
        size="large"
        @input="handleSearch"
      >
        <template #prefix>
          <ElIcon><Search /></ElIcon>
        </template>
      </ElInput>
    </div>

    <!-- 广告列表 -->
    <div v-loading="loading" class="ad-list">
      <ElRadioGroup v-if="singleSelect" v-model="selectedAdId" class="ad-group">
        <div v-for="ad in ads" :key="ad.id" class="ad-item">
          <ElRadio :value="ad.id" class="ad-radio">
            <div class="ad-content">
              <div class="ad-image-wrapper">
                <ElImage :src="ad.imageUrl" fit="cover" class="ad-image">
                  <template #error>
                    <div class="image-error">
                      <ElIcon><Picture /></ElIcon>
                    </div>
                  </template>
                </ElImage>
              </div>
              <div class="ad-info">
                <div class="ad-title">{{ ad.title }}</div>
                <div class="ad-meta">
                  <ElTag size="small" type="info">{{ ad.category }}</ElTag>
                  <ElTag size="small" :type="ad.status === 'ACTIVE' ? 'success' : 'info'">
                    {{ ad.status === 'ACTIVE' ? '已发布' : '未发布' }}
                  </ElTag>
                </div>
                <div class="ad-stats">
                  <span>点击: {{ ad.clickCount }}</span>
                  <span>展示: {{ ad.impressionCount }}</span>
                </div>
              </div>
            </div>
          </ElRadio>
        </div>
      </ElRadioGroup>

      <ElCheckboxGroup v-else v-model="selectedAdIds" class="ad-group">
        <div v-for="ad in ads" :key="ad.id" class="ad-item">
          <ElCheckbox :value="ad.id" class="ad-checkbox">
            <div class="ad-content">
              <div class="ad-image-wrapper">
                <ElImage :src="ad.imageUrl" fit="cover" class="ad-image">
                  <template #error>
                    <div class="image-error">
                      <ElIcon><Picture /></ElIcon>
                    </div>
                  </template>
                </ElImage>
              </div>
              <div class="ad-info">
                <div class="ad-title">{{ ad.title }}</div>
                <div class="ad-meta">
                  <ElTag size="small" type="info">{{ ad.category }}</ElTag>
                  <ElTag size="small" :type="ad.status === 'ACTIVE' ? 'success' : 'info'">
                    {{ ad.status === 'ACTIVE' ? '已发布' : '未发布' }}
                  </ElTag>
                </div>
                <div class="ad-stats">
                  <span>点击: {{ ad.clickCount }}</span>
                  <span>展示: {{ ad.impressionCount }}</span>
                </div>
              </div>
            </div>
          </ElCheckbox>
        </div>
      </ElCheckboxGroup>

      <!-- 空状态 -->
      <ElEmpty v-if="!loading && ads.length === 0" description="暂无广告数据" :image-size="100" />
    </div>

    <!-- 分页 -->
    <div v-if="total > pageSize" class="pagination">
      <ElPagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        background
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <ElButton size="large" @click="handleClose">取消</ElButton>
        <ElButton type="primary" size="large" @click="handleConfirm">
          <ElIcon><Check /></ElIcon>
          确定
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Picture, Check } from '@element-plus/icons-vue'
import { getAds } from '@/api/ad'
import type { Advertisement } from '@/types/api'

// ==================== Props & Emits ====================

interface Props {
  visible: boolean
  selectedIds?: string[]
  singleSelect?: boolean
}

interface Emits {
  'update:visible': [value: boolean]
  confirm: [selectedIds: string[]]
}

const props = withDefaults(defineProps<Props>(), {
  selectedIds: () => [],
  singleSelect: false,
})

const emit = defineEmits<Emits>()

// ==================== 状态 ====================

const dialogVisible = ref(false)
const ads = ref<Advertisement[]>([])
const selectedAdIds = ref<string[]>([])
const selectedAdId = ref<string>('')
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
  if (props.singleSelect) {
    emit('confirm', selectedAdId.value ? [selectedAdId.value] : [])
  } else {
    emit('confirm', selectedAdIds.value)
  }
  handleClose()
}

// ==================== 监听 ====================

watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
    if (newVal) {
      // 对话框打开时，初始化选中的广告 ID
      if (props.singleSelect) {
        selectedAdId.value = props.selectedIds[0] || ''
      } else {
        selectedAdIds.value = [...props.selectedIds]
      }
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
  margin-bottom: 20px;
}

.ad-list {
  min-height: 450px;
  max-height: 550px;
  overflow-y: auto;
  padding: 4px;

  /* 美化滚动条 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.ad-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.ad-item {
  width: 100%;
  position: relative;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.ad-radio,
.ad-checkbox {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
  transition: all 0.3s ease;

  &:hover {
    border-color: #409eff;
    background: #f5f9ff;
  }

  :deep(.el-radio__input),
  :deep(.el-checkbox__input) {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 1;
  }

  :deep(.el-radio__label),
  :deep(.el-checkbox__label) {
    box-sizing: border-box;
    width: 100%;
    padding: 16px 16px 16px 48px;
    display: block;
  }

  :deep(.el-radio__input.is-checked + .el-radio__label),
  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: inherit;
  }

  :deep(.el-radio__input.is-checked),
  :deep(.el-checkbox__input.is-checked) {
    .el-radio__inner,
    .el-checkbox__inner {
      background-color: #409eff;
      border-color: #409eff;
    }
  }
}

.ad-radio.is-checked,
.ad-checkbox.is-checked {
  border-color: #409eff;
  background: #f0f7ff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.ad-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.ad-image-wrapper {
  flex-shrink: 0;
  width: 120px;
  height: 90px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  color: #909399;
  font-size: 32px;
}

.ad-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ad-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.ad-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ad-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #909399;

  span {
    display: flex;
    align-items: center;
    gap: 4px;

    &::before {
      content: '';
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
    }
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  padding: 12px 0;
  border-top: 1px solid #e4e7ed;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-radio__label),
:deep(.el-checkbox__label) {
  width: 100%;
  padding: 0;
}

:deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #e4e7ed;
  margin: 0;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid #e4e7ed;
}

:deep(.el-radio),
:deep(.el-checkbox) {
  width: 100%;
  height: 100%;
  margin: 0;
  display: block;
}
</style>
