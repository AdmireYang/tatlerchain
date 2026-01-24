<template>
  <div class="users-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="text-2xl font-bold">账号管理</h1>
      <ElButton type="primary" @click="handleCreate">
        <ElIcon><Plus /></ElIcon>
        新建账号
      </ElButton>
    </div>

    <!-- 筛选器 -->
    <ElCard class="filter-card" shadow="never">
      <ElForm :inline="true" :model="filters">
        <ElFormItem label="角色">
          <ElSelect v-model="filters.role" placeholder="全部角色" clearable style="width: 150px">
            <ElOption label="管理员" value="ADMIN" />
            <ElOption label="编辑" value="EDITOR" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="handleSearch">查询</ElButton>
          <ElButton @click="handleReset">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <!-- 用户列表 -->
    <ElCard class="list-card" shadow="never">
      <ElTable v-loading="loading" :data="data" stripe>
        <ElTableColumn prop="email" label="邮箱" min-width="180" />
        <ElTableColumn prop="name" label="用户名" min-width="120" />
        <ElTableColumn prop="displayPassword" label="初始密码" width="150">
          <template #default="{ row }">
            <span v-if="row.displayPassword" class="password-text">{{ row.displayPassword }}</span>
            <span v-else class="password-empty">已修改</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="role" label="角色" width="100">
          <template #default="{ row }">
            <ElTag v-if="row.role === 'ADMIN'" type="danger">管理员</ElTag>
            <ElTag v-else type="info">编辑</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <ElButton size="small" type="primary" text @click="handleEdit(row)"> 编辑 </ElButton>
            <ElButton
              size="small"
              type="danger"
              text
              :disabled="row.id === currentUserId"
              @click="handleDelete(row)"
            >
              删除
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

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

    <!-- 新建/编辑对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑账号' : '新建账号'"
      width="500px"
      @close="handleDialogClose"
    >
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
        label-position="right"
      >
        <ElFormItem label="账号" prop="email">
          <ElInput v-model="formData.email" placeholder="请输入账号" />
        </ElFormItem>
        <ElFormItem label="用户名" prop="name">
          <ElInput v-model="formData.name" placeholder="请输入用户名" />
        </ElFormItem>
        <ElFormItem label="密码" prop="password">
          <ElInput
            v-model="formData.password"
            type="password"
            :placeholder="isEdit ? '不修改请保持默认值' : '请输入密码'"
            show-password
          />
          <div v-if="isEdit" style="font-size: 12px; color: #909399; margin-top: 4px">
            提示：如需修改密码请清空后重新输入，否则保持默认值不修改
          </div>
        </ElFormItem>
        <ElFormItem label="角色" prop="role">
          <ElSelect v-model="formData.role" placeholder="请选择角色" style="width: 100%">
            <ElOption label="管理员" value="ADMIN" />
            <ElOption label="编辑" value="EDITOR" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitting" @click="handleSubmit">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore, useAuthStore } from '@/stores'
import { useTable } from '@/composables'
import { getUsers } from '@/api'
import type { User } from '@/types/api'

const userStore = useUserStore()
const authStore = useAuthStore()

// 当前登录用户 ID
const currentUserId = computed(() => authStore.user?.id)

// 筛选条件
const filters = reactive({
  role: undefined as 'ADMIN' | 'EDITOR' | undefined,
})

// 使用 useTable 管理表格数据
const { data, total, loading, page, pageSize, fetchData, handlePageChange, handlePageSizeChange } =
  useTable((params) => getUsers({ ...params, ...filters }))

// 对话框相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  email: '',
  password: '',
  role: 'EDITOR' as 'ADMIN' | 'EDITOR',
})

// 表单验证规则
const rules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    {
      validator: (_rule, value, callback) => {
        if (!isEdit.value && !value) {
          callback(new Error('请输入密码'))
        } else if (value && value !== '******' && value.length < 6) {
          callback(new Error('密码长度至少6位'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 查询
const handleSearch = () => {
  page.value = 1
  fetchData()
}

// 重置
const handleReset = () => {
  filters.role = undefined
  page.value = 1
  fetchData()
}

// 新建账号
const handleCreate = () => {
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑账号
const handleEdit = (user: User) => {
  isEdit.value = true
  formData.id = user.id
  formData.name = user.name
  formData.email = user.email
  formData.password = user.displayPassword
  formData.role = user.role
  dialogVisible.value = true
}

// 删除账号
const handleDelete = async (user: User) => {
  try {
    await ElMessageBox.confirm(`确定要删除账号"${user.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await userStore.remove(user.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    submitting.value = true

    if (isEdit.value) {
      // 编辑
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }
      // 只有当密码不是占位符且不为空时才更新密码
      if (formData.password && formData.password !== '******') {
        updateData.password = formData.password
      }
      await userStore.update(formData.id, updateData)
      ElMessage.success('更新成功')
    } else {
      // 新建
      await userStore.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchData()
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error.message || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } finally {
    submitting.value = false
  }
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
  formData.id = ''
  formData.name = ''
  formData.email = ''
  formData.password = ''
  formData.role = 'EDITOR'
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.users-page {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .filter-card {
    margin-bottom: 20px;
  }

  .list-card {
    .pagination-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }

    .password-text {
      font-family: 'Courier New', monospace;
      background-color: #f5f7fa;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 13px;
    }

    .password-empty {
      color: #909399;
      font-size: 12px;
    }
  }
}
</style>
