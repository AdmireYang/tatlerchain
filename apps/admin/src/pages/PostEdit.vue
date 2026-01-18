<template>
  <div class="post-edit-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="text-2xl font-bold">{{ isEdit ? '编辑推文' : '新建推文' }}</h1>
      <div class="actions">
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="default" :loading="saving" @click="handleSaveDraft"> 保存草稿 </ElButton>
        <ElButton type="primary" :loading="publishing" @click="handlePublish"> 发布 </ElButton>
      </div>
    </div>

    <!-- 编辑表单 -->
    <ElCard v-loading="loading" shadow="never">
      <PostEditor ref="editorRef" v-model="formData" />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PostEditor from '@/components/post/PostEditor.vue'
import { usePostStore } from '@/stores'
import type { CreatePostDto } from '@/types/api'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()

// 编辑器引用
const editorRef = ref<InstanceType<typeof PostEditor>>()

// 状态
const loading = ref(false)
const saving = ref(false)
const publishing = ref(false)

// 表单数据
const formData = ref<Partial<CreatePostDto>>({
  title: '',
  slug: '',
  category: '',
  excerpt: '',
  coverImage: '',
  content: null,
  advertisements: [],
})

// 是否为编辑模式
const isEdit = computed(() => !!route.params.id)
const postId = computed(() => route.params.id as string)

// 加载推文数据（编辑模式）
async function loadPost() {
  if (!isEdit.value) return

  loading.value = true
  try {
    const post = await postStore.fetchPostById(postId.value)
    formData.value = {
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      detailImage: post.detailImage,
      content: post.content,
      advertisements:
        post.advertisements?.map((item, index) => ({
          advertisementId: item.advertisement.id,
          sortOrder: index,
        })) || [],
    }
  } catch {
    ElMessage.error('加载推文失败')
    router.push('/posts')
  } finally {
    loading.value = false
  }
}

// 保存草稿
async function handleSaveDraft() {
  // 验证表单
  const isValid = await editorRef.value?.validate()
  if (!isValid) {
    ElMessage.warning('请填写必填字段')
    return
  }

  saving.value = true
  try {
    const data = { ...formData.value, status: 'DRAFT' } as CreatePostDto & { status: 'DRAFT' }

    if (isEdit.value) {
      await postStore.update(postId.value, data)
      ElMessage.success('保存成功')
    } else {
      await postStore.create(data)
      ElMessage.success('创建成功')
      router.push('/posts')
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
  const isValid = await editorRef.value?.validate()
  if (!isValid) {
    ElMessage.warning('请填写必填字段')
    return
  }

  publishing.value = true
  try {
    const data = formData.value as CreatePostDto

    if (isEdit.value) {
      // 先更新，再发布
      await postStore.update(postId.value, data)
      await postStore.publish(postId.value)
      ElMessage.success('发布成功')
      router.push('/posts')
    } else {
      // 先创建，再发布
      const post = await postStore.create(data)
      await postStore.publish(post.id)
      ElMessage.success('发布成功')
      router.push('/posts')
    }
  } catch {
    ElMessage.error('发布失败')
  } finally {
    publishing.value = false
  }
}

// 取消
function handleCancel() {
  router.push('/posts')
}

// 初始化
onMounted(() => {
  loadPost()
})
</script>

<style scoped lang="scss">
.post-edit-page {
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
