<template>
  <ElContainer class="layout-container">
    <!-- 侧边栏 -->
    <ElAside :width="isCollapsed ? '64px' : '200px'" class="layout-aside">
      <div class="logo-container">
        <h2 v-if="!isCollapsed" class="logo-text">Port Magazine</h2>
        <span v-else class="logo-icon">PM</span>
      </div>
      <ElMenu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        router
        class="layout-menu"
      >
        <ElMenuItem index="/dashboard">
          <ElIcon><DataLine /></ElIcon>
          <template #title>数据看板</template>
        </ElMenuItem>
        <ElMenuItem index="/posts">
          <ElIcon><Document /></ElIcon>
          <template #title>推文管理</template>
        </ElMenuItem>
        <ElMenuItem index="/ads">
          <ElIcon><Picture /></ElIcon>
          <template #title>广告管理</template>
        </ElMenuItem>
        <ElMenuItem v-if="isAdmin" index="/users">
          <ElIcon><User /></ElIcon>
          <template #title>账号管理</template>
        </ElMenuItem>
      </ElMenu>
    </ElAside>

    <!-- 主容器 -->
    <ElContainer class="layout-main">
      <!-- 顶部栏 -->
      <ElHeader class="layout-header">
        <div class="header-left">
          <ElButton
            :icon="isCollapsed ? Expand : Fold"
            circle
            @click="toggleSidebar"
            class="collapse-btn"
          />
        </div>
        <div class="header-right">
          <ElDropdown @command="handleCommand">
            <div class="user-info">
              <ElAvatar :size="32" class="user-avatar">
                {{ userInitial }}
              </ElAvatar>
              <span v-if="!isMobile" class="user-name">{{ userName }}</span>
              <ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
            </div>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem disabled>
                  <div class="user-detail">
                    <div class="user-detail-name">{{ userName }}</div>
                    <div class="user-detail-email">{{ userEmail }}</div>
                  </div>
                </ElDropdownItem>
                <ElDropdownItem divided command="logout">
                  <ElIcon><SwitchButton /></ElIcon>
                  <span>退出登录</span>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
      </ElHeader>

      <!-- 内容区 -->
      <ElMain class="layout-content">
        <RouterView />
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataLine,
  Document,
  Picture,
  User,
  Fold,
  Expand,
  ArrowDown,
  SwitchButton,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 侧边栏折叠状态
const isCollapsed = ref(false)

// 响应式状态
const isMobile = ref(false)

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 用户信息
const userName = computed(() => authStore.user?.name || '未知用户')
const userEmail = computed(() => authStore.user?.email || '')
const userInitial = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.charAt(0).toUpperCase()
})

// 是否为管理员
const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

/**
 * 切换侧边栏折叠状态
 */
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

/**
 * 处理下拉菜单命令
 */
async function handleCommand(command: string) {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      // 执行登出
      authStore.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    } catch {
      // 用户取消
    }
  }
}

/**
 * 检查屏幕尺寸
 */
function checkScreenSize() {
  const width = window.innerWidth
  isMobile.value = width < 768

  // 移动设备默认折叠侧边栏
  if (isMobile.value) {
    isCollapsed.value = true
  }
}

// 监听窗口大小变化
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  overflow: hidden;
}

.layout-aside {
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  transition: width 0.3s;
  overflow-x: hidden;

  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 16px;

    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0;
      white-space: nowrap;
    }

    .logo-icon {
      font-size: 20px;
      font-weight: 700;
      color: #409eff;
    }
  }

  .layout-menu {
    border-right: none;
    height: calc(100vh - 61px);
    overflow-y: auto;
    overflow-x: hidden;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }

    // Firefox 滚动条样式
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
  }
}

.layout-main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.layout-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;

  .header-left {
    display: flex;
    align-items: center;

    .collapse-btn {
      margin-right: 16px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }

      .user-avatar {
        background-color: #409eff;
        color: #fff;
        font-weight: 600;
      }

      .user-name {
        margin: 0 8px;
        font-size: 14px;
        color: #303133;
      }
    }
  }
}

.layout-content {
  background-color: #f5f7fa;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;

  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.25);
    }
  }

  // Firefox 滚动条样式
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) #f5f7fa;
}

.user-detail {
  padding: 4px 0;

  .user-detail-name {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;
  }

  .user-detail-email {
    font-size: 12px;
    color: #909399;
  }
}

// 响应式样式
@media (max-width: 768px) {
  .layout-header {
    padding: 0 12px;
  }

  .layout-content {
    padding: 12px;
  }
}
</style>
