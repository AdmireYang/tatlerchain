/**
 * 推文相关 API
 */

import request from '@/utils/request'
import type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  QueryParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'

/**
 * 获取推文列表
 */
export function getPosts(params: QueryParams) {
  return request.get<ApiResponse<PaginatedResponse<Post>>>('/backstage/posts', { params })
}

/**
 * 根据 ID 获取推文详情
 */
export function getPostById(id: string) {
  return request.get<ApiResponse<Post>>(`/backstage/posts/${id}`)
}

/**
 * 创建推文
 */
export function createPost(data: CreatePostDto) {
  return request.post<ApiResponse<Post>>('/backstage/posts', data)
}

/**
 * 更新推文
 */
export function updatePost(id: string, data: UpdatePostDto) {
  return request.put<ApiResponse<Post>>(`/backstage/posts/${id}`, data)
}

/**
 * 删除推文
 */
export function deletePost(id: string) {
  return request.delete<ApiResponse<void>>(`/backstage/posts/${id}`)
}

/**
 * 发布推文
 */
export function publishPost(id: string) {
  return request.patch<ApiResponse<Post>>(`/backstage/posts/${id}/publish`)
}
