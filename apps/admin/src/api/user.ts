/**
 * 用户管理 API
 */

import request from '@/utils/request'
import type { User, ApiResponse, PaginatedResponse } from '@/types/api'

export interface CreateUserDto {
  email: string // 账号
  password: string
  name: string
  role?: 'ADMIN' | 'EDITOR'
}

export interface UpdateUserDto {
  email?: string // 账号
  password?: string
  name?: string
  role?: 'ADMIN' | 'EDITOR'
}

export interface QueryUserParams {
  page?: number
  pageSize?: number
  role?: 'ADMIN' | 'EDITOR'
}

/**
 * 获取用户列表
 */
export function getUsers(params?: QueryUserParams) {
  return request.get<ApiResponse<PaginatedResponse<User>>>('/backstage/users', { params })
}

/**
 * 获取用户详情
 */
export function getUserById(id: string) {
  return request.get<ApiResponse<User>>(`/backstage/users/${id}`)
}

/**
 * 创建用户
 */
export function createUser(data: CreateUserDto) {
  return request.post<ApiResponse<User>>('/backstage/users', data)
}

/**
 * 更新用户
 */
export function updateUser(id: string, data: UpdateUserDto) {
  return request.put<ApiResponse<User>>(`/backstage/users/${id}`, data)
}

/**
 * 删除用户
 */
export function deleteUser(id: string) {
  return request.delete<ApiResponse<void>>(`/backstage/users/${id}`)
}
