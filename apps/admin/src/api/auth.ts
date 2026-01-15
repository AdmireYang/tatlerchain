/**
 * 认证相关 API
 */

import { post, get } from '@/utils/request'
import type { LoginDto, LoginResponse, User } from '@/types'

/**
 * 用户登录
 */
export function login(data: LoginDto): Promise<LoginResponse> {
  return post<LoginResponse>('/backstage/auth/login', data)
}

/**
 * 获取当前用户信息
 */
export function getProfile(): Promise<User> {
  return get<User>('/backstage/auth/me')
}

/**
 * 用户登出
 */
export function logout(): Promise<void> {
  return post<void>('/backstage/auth/logout')
}
