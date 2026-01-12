import { ref, computed } from 'vue'
import type { User } from '@port/types'

export function useAuth() {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    // TODO: 实现登录逻辑
    console.log('Login:', email, password)
  }

  const logout = async () => {
    user.value = null
    token.value = null
    // TODO: 清除本地存储
  }

  const fetchUser = async () => {
    // TODO: 获取当前用户信息
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  }
}
