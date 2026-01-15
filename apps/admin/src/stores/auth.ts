/**
 * 认证状态管理 Store
 * 负责用户登录、登出和身份验证
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getProfile as getProfileApi } from '@/api/auth'
import type { LoginDto, User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  /**
   * 初始化 - 从本地存储恢复状态
   */
  function init() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken) {
      token.value = savedToken
    }

    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        localStorage.removeItem('user')
      }
    }
  }

  /**
   * 用户登录
   * @param credentials 登录凭证
   */
  async function login(credentials: LoginDto): Promise<void> {
    try {
      const response = await loginApi(credentials)

      // 保存 token 和用户信息
      token.value = response.accessToken
      user.value = response.user

      // 持久化到本地存储
      localStorage.setItem('token', response.accessToken)
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (error) {
      // 清除状态
      token.value = null
      user.value = null
      throw error
    }
  }

  /**
   * 用户登出
   */
  function logout(): void {
    // 清除状态
    token.value = null
    user.value = null

    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // 可选：调用后端登出 API
    // 不等待结果，避免阻塞
    // logoutApi().catch((error) => {
    //   console.error('登出 API 调用失败:', error)
    // })
  }

  /**
   * 获取用户信息
   */
  async function getProfile(): Promise<void> {
    try {
      const profile = await getProfileApi()
      user.value = profile

      // 更新本地存储
      localStorage.setItem('user', JSON.stringify(profile))
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  /**
   * 检查是否已认证
   */
  function checkAuth(): boolean {
    return isAuthenticated.value
  }

  // 初始化
  init()

  return {
    // 状态
    token,
    user,
    isAuthenticated,

    // 方法
    login,
    logout,
    getProfile,
    checkAuth,
  }
})
