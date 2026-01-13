<template>
  <ElForm ref="formRef" :model="formData" :rules="rules" label-width="120px">
    <!-- 标题 -->
    <ElFormItem label="标题" prop="title">
      <ElInput
        v-model="formData.title"
        placeholder="请输入广告标题"
        maxlength="50"
        show-word-limit
      />
    </ElFormItem>

    <!-- 分类 -->
    <ElFormItem label="分类" prop="category">
      <ElInput v-model="formData.category" placeholder="请输入广告分类" />
    </ElFormItem>

    <!-- 广告图片 -->
    <ElFormItem label="广告图片" prop="imageUrl">
      <ImageUpload v-model="formData.imageUrl" />
    </ElFormItem>

    <!-- 链接地址 -->
    <ElFormItem label="链接地址" prop="linkUrl">
      <ElInput v-model="formData.linkUrl" placeholder="请输入链接地址" type="url" />
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import ImageUpload from '@/components/common/ImageUpload.vue'
import type { CreateAdDto } from '@/types/api'

// Props
interface Props {
  modelValue?: Partial<CreateAdDto>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Partial<CreateAdDto>]
}>()

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<Partial<CreateAdDto>>({
  title: '',
  category: '',
  imageUrl: '',
  linkUrl: '',
  ...props.modelValue,
})

// 监听 props.modelValue 变化，更新表单数据（用于编辑模式）
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      Object.assign(formData, {
        title: newValue.title || '',
        category: newValue.category || '',
        imageUrl: newValue.imageUrl || '',
        linkUrl: newValue.linkUrl || '',
      })
    }
  },
  { immediate: true }
)

// 表单验证规则
const rules: FormRules = {
  title: [
    { required: true, message: '请输入广告标题', trigger: 'blur' },
    { max: 50, message: '标题不能超过50个字符', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请输入广告分类', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请上传广告图片', trigger: 'change' }],
  linkUrl: [
    { required: true, message: '请输入链接地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' },
  ],
}

// 监听表单数据变化
watch(
  () => formData,
  () => {
    emit('update:modelValue', { ...formData })
  },
  { deep: true }
)

// 验证表单
async function validate(): Promise<boolean> {
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
:deep(.el-form-item) {
  margin-bottom: 24px;
}
</style>
