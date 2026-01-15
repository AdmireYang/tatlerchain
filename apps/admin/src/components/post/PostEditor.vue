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
        <ElSelect v-model="formData.category" placeholder="请选择分类" style="width: 100%">
          <ElOption label="科技" value="Technology" />
          <ElOption label="设计" value="Design" />
          <ElOption label="商业" value="Business" />
          <ElOption label="生活" value="Lifestyle" />
          <ElOption label="文化" value="Culture" />
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
              添加广告
            </ElButton>
            <span class="ad-count">已选择 {{ selectedAds.length }} 个广告</span>
          </div>

          <!-- 广告列表 -->
          <div v-if="selectedAds.length > 0" class="ad-list">
            <Draggable
              v-model="selectedAds"
              item-key="id"
              handle=".drag-handle"
              @end="handleDragEnd"
            >
              <template #item="{ element: ad }">
                <div class="ad-item">
                  <div class="drag-handle">
                    <ElIcon><Rank /></ElIcon>
                  </div>
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
                    </div>
                  </div>
                  <ElButton type="danger" size="small" text @click="removeAd(ad.id)">
                    <ElIcon><Delete /></ElIcon>
                    移除
                  </ElButton>
                </div>
              </template>
            </Draggable>
          </div>

          <!-- 空状态 -->
          <ElEmpty v-else description="暂未关联广告" :image-size="80" />
        </div>
      </ElFormItem>
    </ElForm>

    <!-- 广告选择对话框 -->
    <AdSelector
      v-model:visible="adSelectorVisible"
      :selected-ids="selectedAds.map((ad) => ad.id)"
      @confirm="handleAdSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus, Rank, Picture, Delete } from '@element-plus/icons-vue'
import type { CreatePostDto, Advertisement } from '@/types/api'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import ImageUpload from '@/components/common/ImageUpload.vue'
import AdSelector from './AdSelector.vue'
import Draggable from 'vuedraggable'
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
  content: null,
  ...props.modelValue,
})

// 详情首图相关
const detailImageUrl = ref(props.modelValue.detailImage?.url || '')
const detailImageAuthor = ref(props.modelValue.detailImage?.authorName || '')
const detailImageLink = ref(props.modelValue.detailImage?.authorLink || '')

// 广告相关
const adSelectorVisible = ref(false)
const selectedAds = ref<Advertisement[]>([])

// 监听 props.modelValue 的变化，初始化广告列表
watch(
  () => props.modelValue.advertisementIds,
  (newIds) => {
    if (newIds && newIds.length > 0) {
      loadAdvertisements(newIds)
    } else {
      selectedAds.value = []
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

// 监听广告列表变化，更新 advertisementIds
watch(
  selectedAds,
  (newAds) => {
    formData.advertisementIds = newAds.map((ad) => ad.id)
  },
  { deep: true }
)

/**
 * 加载广告详情
 */
async function loadAdvertisements(adIds: string[]) {
  try {
    const promises = adIds.map((id) => getAdById(id))
    const responses = await Promise.all(promises)
    selectedAds.value = responses.map((res) => res.data.data)
  } catch (error) {
    console.error('加载广告详情失败:', error)
    ElMessage.error('加载广告详情失败')
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
    // 加载新选择的广告详情
    await loadAdvertisements(adIds)
    ElMessage.success('广告选择成功')
  } catch (error) {
    console.error('加载广告失败:', error)
    ElMessage.error('加载广告失败')
  }
}

/**
 * 移除广告
 */
function removeAd(adId: string) {
  const index = selectedAds.value.findIndex((ad) => ad.id === adId)
  if (index > -1) {
    selectedAds.value.splice(index, 1)
    ElMessage.success('广告已移除')
  }
}

/**
 * 处理拖拽结束
 */
function handleDragEnd() {
  // 拖拽结束后，selectedAds 的顺序已经更新
  // watch 会自动更新 formData.advertisementIds
  ElMessage.success('广告排序已更新')
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
  margin-bottom: 12px;
  transition: all 0.3s;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.drag-handle {
  cursor: move;
  color: #909399;
  font-size: 18px;
  display: flex;
  align-items: center;

  &:hover {
    color: #409eff;
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
