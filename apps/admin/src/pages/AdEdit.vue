<template>
  <div class="ad-edit-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="text-2xl font-bold">{{ isEdit ? '编辑广告' : '新建广告' }}</h1>
      <div class="actions">
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="default" :loading="saving" @click="handleSave"> 保存 </ElButton>
        <ElButton type="primary" :loading="publishing" @click="handlePublish"> 发布 </ElButton>
      </div>
    </div>

    <!-- 编辑表单 -->
    <ElCard v-loading="loading" shadow="never">
      <AdForm ref="formRef" v-model="formData" />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AdForm from '@/components/ad/AdForm.vue'
import { useAdStore } from '@/stores'
import type { CreateAdDto } from '@/types/api'

const route = useRoute()
const router = useRouter()
const adStore = useAdStore()

// 表单引用
const formRef = ref<InstanceType<typeof AdForm>>()

// 状态
const loading = ref(false)
const saving = ref(false)
const publishing = ref(false)

// 表单数据
const formData = ref<Partial<CreateAdDto>>({
  title: '',
  category: '',
  imageUrl: '',
  linkUrl: '',
})

// 是否为编辑模式
const isEdit = computed(() => !!route.params.id)
const adId = computed(() => route.params.id as string)

// 加载广告数据（编辑模式）
async function loadAd() {
  if (!isEdit.value) return

  loading.value = true
  try {
    const ad = await adStore.fetchAdById(adId.value)
    formData.value = {
      title: ad.title,
      category: ad.category,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
    }
  } catch {
    ElMessage.error('加载广告失败')
    router.push('/ads')
  } finally {
    loading.value = false
  }
}

// 保存
async function handleSave() {
  // 验证表单
  const isValid = await formRef.value?.validate()
  if (!isValid) {
    ElMessage.warning('请填写必填字段')
    return
  }

  saving.value = true
  try {
    const data = formData.value as CreateAdDto

    if (isEdit.value) {
      await adStore.update(adId.value, data)
      ElMessage.success('保存成功')
    } else {
      await adStore.create(data)
      ElMessage.success('创建成功')
      router.push('/ads')
    }
  } catch {
    ElMessage.error(isEdit.value ? '保存失败' : '创建失败')
  } finally {
    saving.value = false
  }
}

// 发布
async function handlePublish() {
  // 验证表单
  const isValid = await formRef.value?.validate()
  if (!isValid) {
    ElMessage.warning('请填写必填字段')
    return
  }

  publishing.value = true
  try {
    const data = formData.value as CreateAdDto

    if (isEdit.value) {
      // 先更新，再发布
      await adStore.update(adId.value, data)
      await adStore.publish(adId.value)
      ElMessage.success('发布成功')
      router.push('/ads')
    } else {
      // 先创建，再发布
      const ad = await adStore.create(data)
      await adStore.publish(ad.id)
      ElMessage.success('发布成功')
      router.push('/ads')
    }
  } catch {
    ElMessage.error('发布失败')
  } finally {
    publishing.value = false
  }
}

// 取消
function handleCancel() {
  router.push('/ads')
}

// 初始化
onMounted(() => {
  loadAd()
})
</script>

<style scoped lang="scss">
.ad-edit-page {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .actions {
      display: flex;
      gap: 10px;
    }
  }
}
</style>
