/**
 * 认证相关的组合式函数
 * 封装认证业务逻辑
 */

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import type { LoginDto } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // 计算属性
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  /**
   * 用户登录
   * @param credentials 登录凭证
   */
  async function login(credentials: LoginDto): Promise<void> {
    await authStore.login(credentials)
    // 登录成功后跳转到数据看板
    await router.push('/dashboard')
  }

  /**
   * 用户登出
   */
  function logout(): void {
    authStore.logout()
    // 跳转到登录页
    router.push('/login')
  }

  /**
   * 获取用户信息
   */
  async function getProfile(): Promise<void> {
    try {
      await authStore.getProfile()
    } catch (error) {
      // 如果获取用户信息失败，可能是 token 过期，执行登出
      logout()
      throw error
    }
  }

  /**
   * 检查是否已认证
   */
  function checkAuth(): boolean {
    return authStore.checkAuth()
  }

  return {
    // 状态
    user,
    isAuthenticated,

    // 方法
    login,
    logout,
    getProfile,
    checkAuth,
  }
}
