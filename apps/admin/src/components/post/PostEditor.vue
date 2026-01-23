<template>
  <div class="post-editor">
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      label-position="right"
    >
      <!-- 标题 -->
      <ElFormItem label="标题" prop="title">
        <ElInput
          v-model="formData.title"
          placeholder="请输入推文标题"
          maxlength="50"
          show-word-limit
        />
      </ElFormItem>

      <!-- Slug -->
      <ElFormItem label="URL Slug" prop="slug">
        <ElInput v-model="formData.slug" placeholder="请输入 URL slug" />
      </ElFormItem>

      <!-- 分类 -->
      <ElFormItem label="分类" prop="category">
        <ElSelect
          v-model="formData.category"
          placeholder="请选择分类"
          style="width: 100%"
          clearable
        >
          <ElOption label="博物" value="博物" />
          <ElOption label="人物" value="人物" />
          <ElOption label="评弹" value="评弹" />
          <ElOption label="影集" value="影集" />
          <ElOption label="刊中刊" value="刊中刊" />
        </ElSelect>
      </ElFormItem>

      <!-- 摘要 -->
      <ElFormItem label="摘要" prop="excerpt">
        <ElInput
          v-model="formData.excerpt"
          type="textarea"
          :rows="3"
          placeholder="请输入推文摘要"
          maxlength="200"
          show-word-limit
        />
      </ElFormItem>

      <!-- 封面图 -->
      <ElFormItem label="封面图" prop="coverImage">
        <ImageUpload
          v-model="formData.coverImage"
          tip="建议尺寸: 1200x630，支持 JPG、PNG 格式，大小不超过 5MB"
        />
      </ElFormItem>

      <!-- 详情首图 -->
      <ElFormItem label="详情首图">
        <ImageUpload
          v-model="detailImageUrl"
          tip="建议尺寸: 1200x800，支持 JPG、PNG 格式，大小不超过 5MB"
        />
      </ElFormItem>

      <!-- 图片作者信息 -->
      <ElFormItem v-if="detailImageUrl" label="图片作者">
        <ElInput v-model="detailImageAuthor" placeholder="请输入图片作者名称" />
      </ElFormItem>

      <ElFormItem v-if="detailImageUrl" label="作者链接">
        <ElInput v-model="detailImageLink" placeholder="请输入图片作者链接" />
      </ElFormItem>

      <!-- 推文内容 -->
      <ElFormItem label="推文内容" prop="content">
        <RichTextEditor v-model="formData.content" placeholder="请输入推文内容" />
      </ElFormItem>

      <!-- 关联广告 -->
      <ElFormItem label="关联广告">
        <div class="ad-management">
          <div class="ad-header">
            <ElButton type="primary" size="small" @click="showAdSelector">
              <ElIcon><Plus /></ElIcon>
              {{ selectedAd ? '更换广告' : '选择广告' }}
            </ElButton>
          </div>

          <!-- 广告展示 -->
          <div v-if="selectedAd" class="ad-display">
            <div class="ad-item">
              <ElImage :src="selectedAd.imageUrl" fit="cover" class="ad-image">
                <template #error>
                  <div class="image-error">
                    <ElIcon><Picture /></ElIcon>
                  </div>
                </template>
              </ElImage>
              <div class="ad-info">
                <div class="ad-title">{{ selectedAd.title }}</div>
                <div class="ad-meta">
                  <ElTag size="small" type="info">{{ selectedAd.category }}</ElTag>
                </div>
              </div>
              <ElButton type="danger" size="small" text @click="removeAd">
                <ElIcon><Delete /></ElIcon>
                移除
              </ElButton>
            </div>
          </div>
        </div>
      </ElFormItem>
    </ElForm>

    <!-- 广告选择对话框 -->
    <AdSelector
      v-model:visible="adSelectorVisible"
      :selected-ids="selectedAd ? [selectedAd.id] : []"
      :single-select="true"
      @confirm="handleAdSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus, Picture, Delete } from '@element-plus/icons-vue'
import type { CreatePostDto, Advertisement } from '@/types/api'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import ImageUpload from '@/components/common/ImageUpload.vue'
import AdSelector from './AdSelector.vue'
import { getAdById } from '@/api/ad'

// Props
interface Props {
  modelValue?: Partial<CreatePostDto>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Partial<CreatePostDto>]
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<Partial<CreatePostDto>>({
  title: '',
  slug: '',
  category: '',
  excerpt: '',
  coverImage: '',
  detailImage: undefined,
  content: '',
  advertisements: [],
  ...props.modelValue,
})

// 详情首图相关
const detailImageUrl = ref(props.modelValue.detailImage?.url || '')
const detailImageAuthor = ref(props.modelValue.detailImage?.authorName || '')
const detailImageLink = ref(props.modelValue.detailImage?.authorLink || '')

// 广告相关
const adSelectorVisible = ref(false)
const selectedAd = ref<Advertisement | null>(null)

// 防止递归更新的标志
const isUpdatingFromProps = ref(false)
const isLoadingAds = ref(false)

// 监听 props.modelValue 的变化，更新表单数据
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && !isUpdatingFromProps.value) {
      isUpdatingFromProps.value = true

      Object.assign(formData, newValue)

      // 更新详情首图相关字段
      detailImageUrl.value = newValue.detailImage?.url || ''
      detailImageAuthor.value = newValue.detailImage?.authorName || ''
      detailImageLink.value = newValue.detailImage?.authorLink || ''

      // 使用 nextTick 确保所有更新完成后再重置标志
      setTimeout(() => {
        isUpdatingFromProps.value = false
      }, 0)
    }
  },
  { deep: true }
)

// 监听 props.modelValue.advertisements 的变化，初始化广告
watch(
  () => props.modelValue.advertisements,
  (newAds, oldAds) => {
    // 如果正在加载广告，跳过
    if (isLoadingAds.value) return

    // 比较新旧 ID，如果相同则跳过
    const newId = newAds?.[0]?.advertisementId
    const oldId = oldAds?.[0]?.advertisementId
    if (newId === oldId) return

    // 加载广告详情
    if (newId && newId !== 'undefined') {
      loadAdvertisement(newId)
    } else {
      selectedAd.value = null
    }
  },
  { immediate: true }
)

// 表单验证规则
const rules: FormRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 50, message: '标题不能超过50个字符', trigger: 'blur' },
  ],
  slug: [{ required: true, message: '请输入 URL slug', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  excerpt: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
  coverImage: [{ required: true, message: '请上传封面图', trigger: 'change' }],
}

// 监听表单数据变化
watch(
  () => formData,
  () => {
    // 如果正在从 props 更新，不要 emit
    if (isUpdatingFromProps.value) return

    const data = { ...formData }

    // 处理详情首图
    if (detailImageUrl.value) {
      data.detailImage = {
        url: detailImageUrl.value,
        authorName: detailImageAuthor.value,
        authorLink: detailImageLink.value,
      }
    } else {
      data.detailImage = undefined
    }

    emit('update:modelValue', data)
  },
  { deep: true }
)

// 监听详情首图相关字段变化
watch([detailImageUrl, detailImageAuthor, detailImageLink], () => {
  // 如果正在从 props 更新，不要修改 formData
  if (isUpdatingFromProps.value) return

  if (detailImageUrl.value) {
    formData.detailImage = {
      url: detailImageUrl.value,
      authorName: detailImageAuthor.value,
      authorLink: detailImageLink.value,
    }
  } else {
    formData.detailImage = undefined
  }
})

// 监听广告变化，更新 advertisements
watch(
  selectedAd,
  (newAd) => {
    // 如果正在加载广告，不要更新 formData
    if (isLoadingAds.value) return

    formData.advertisements = newAd ? [{ advertisementId: newAd.id, sortOrder: 0 }] : []
  },
  { deep: true }
)

/**
 * 加载广告详情
 */
async function loadAdvertisement(adId: string) {
  // 设置加载标志，防止循环更新
  isLoadingAds.value = true

  try {
    const response = await getAdById(adId)
    selectedAd.value = response.data.data

    // 加载完成后立即更新 formData
    formData.advertisements = [{ advertisementId: response.data.data.id, sortOrder: 0 }]
  } catch (error) {
    console.error('加载广告详情失败:', error)
    ElMessage.error('加载广告详情失败')
  } finally {
    // 延迟重置标志，确保所有 watch 都已执行完毕
    setTimeout(() => {
      isLoadingAds.value = false
    }, 100)
  }
}

/**
 * 显示广告选择对话框
 */
function showAdSelector() {
  adSelectorVisible.value = true
}

/**
 * 处理广告选择
 */
async function handleAdSelect(adIds: string[]) {
  try {
    // 只取第一个广告 ID
    const adId = adIds[0]
    if (adId) {
      await loadAdvertisement(adId)
      ElMessage.success('广告选择成功')
    }
  } catch (error) {
    console.error('加载广告失败:', error)
    ElMessage.error('加载广告失败')
  }
}

/**
 * 移除广告
 */
function removeAd() {
  selectedAd.value = null
  formData.advertisements = []
  ElMessage.success('广告已移除')
}

// 验证表单
async function validate() {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

// 重置表单
function resetForm() {
  formRef.value?.resetFields()
}

// 暴露方法
defineExpose({
  validate,
  resetForm,
})
</script>

<style scoped lang="scss">
.ad-management {
  width: 100%;
}

.ad-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.ad-count {
  font-size: 14px;
  color: #606266;
}

.ad-display {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px;
  background-color: #fafafa;
}

.ad-list {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px;
  background-color: #fafafa;
}

.ad-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.ad-image {
  width: 60px;
  height: 60px;
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
  font-size: 20px;
}

.ad-info {
  flex: 1;
  min-width: 0;
}

.ad-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ad-meta {
  display: flex;
  gap: 8px;
}
</style>
