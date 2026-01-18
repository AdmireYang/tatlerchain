/**
 * 用户管理 Store
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  type CreateUserDto,
  type UpdateUserDto,
  type QueryUserParams,
} from '@/api/user'
import type { User } from '@/types/api'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)

  /**
   * 获取用户列表
   */
  async function fetchUsers(params?: QueryUserParams) {
    loading.value = true
    try {
      const response = await getUsers(params)
      users.value = response.data.data
      return response.data
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取用户详情
   */
  async function fetchUserById(id: string) {
    loading.value = true
    try {
      const response = await getUserById(id)
      currentUser.value = response.data.data
      return response.data.data
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建用户
   */
  async function create(data: CreateUserDto) {
    const response = await createUser(data)
    return response.data.data
  }

  /**
   * 更新用户
   */
  async function update(id: string, data: UpdateUserDto) {
    const response = await updateUser(id, data)
    return response.data.data
  }

  /**
   * 删除用户
   */
  async function remove(id: string) {
    await deleteUser(id)
  }

  return {
    users,
    currentUser,
    loading,
    fetchUsers,
    fetchUserById,
    create,
    update,
    remove,
  }
})
