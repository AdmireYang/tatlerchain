<template>
  <div class="image-upload">
    <!-- 上传区域 -->
    <div class="upload-area">
      <ElInput
        v-model="imageUrl"
        :placeholder="placeholder"
        :disabled="uploading"
        @input="handleUrlChange"
      />
      <ElUpload
        ref="uploadRef"
        :action="uploadAction"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="handleUpload"
        :disabled="uploading"
      >
        <ElButton type="primary" :loading="uploading">
          {{ uploading ? `上传中 ${uploadProgress}%` : '上传图片' }}
        </ElButton>
      </ElUpload>
    </div>

    <!-- 图片预览 -->
    <div v-if="imageUrl" class="image-preview">
      <ElImage :src="imageUrl" fit="cover" :style="{ width: previewWidth, height: previewHeight }">
        <template #error>
          <div class="image-error">
            <ElIcon><Picture /></ElIcon>
            <span>加载失败</span>
          </div>
        </template>
      </ElImage>
      <ElButton
        v-if="clearable"
        class="clear-btn"
        type="danger"
        size="small"
        circle
        :icon="Close"
        @click="handleClear"
      />
    </div>

    <!-- 上传提示 -->
    <div v-if="tip" class="upload-tip">
      {{ tip }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture, Close } from '@element-plus/icons-vue'
import { uploadImage } from '@/api'
import type { UploadRequestOptions } from 'element-plus'

// Props
interface Props {
  modelValue?: string
  placeholder?: string
  accept?: string
  maxSize?: number // MB
  previewWidth?: string
  previewHeight?: string
  clearable?: boolean
  tip?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入图片 URL 或上传图片',
  accept: 'image/*',
  maxSize: 5,
  previewWidth: '200px',
  previewHeight: '120px',
  clearable: true,
  tip: '',
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'upload-success': [url: string]
  'upload-error': [error: any]
}>()

// 状态
const uploadRef = ref()
const imageUrl = ref(props.modelValue)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadAction = ref('') // Element Plus 需要，但我们使用自定义上传

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (value) => {
    imageUrl.value = value
  }
)

// URL 输入变化
function handleUrlChange(value: string) {
  emit('update:modelValue', value)
}

// 上传前验证
function beforeUpload(file: File) {
  // 验证文件类型
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }

  // 验证文件大小
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize
  if (!isLtMaxSize) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB`)
    return false
  }

  return true
}

// 自定义上传
async function handleUpload(options: UploadRequestOptions) {
  const file = options.file as File

  uploading.value = true
  uploadProgress.value = 0

  try {
    const response = await uploadImage(file, (progress) => {
      uploadProgress.value = progress
    })

    const url = response.data.data.url
    imageUrl.value = url
    emit('update:modelValue', url)
    emit('upload-success', url)
    ElMessage.success('上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    emit('upload-error', error)
    ElMessage.error('上传失败')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// 清除图片
function handleClear() {
  imageUrl.value = ''
  emit('update:modelValue', '')
}
</script>

<style scoped lang="scss">
.image-upload {
  .upload-area {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .image-preview {
    position: relative;
    margin-top: 10px;
    display: inline-block;

    .clear-btn {
      position: absolute;
      top: -8px;
      right: -8px;
    }

    .image-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #909399;
      font-size: 14px;

      .el-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }
    }
  }

  .upload-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
  }
}
</style>
