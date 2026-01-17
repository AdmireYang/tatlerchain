/**
 * 广告相关 API
 */

import request from '@/utils/request'
import type {
  Advertisement,
  CreateAdDto,
  UpdateAdDto,
  QueryParams,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api'

/**
 * 获取广告列表
 */
export function getAds(params?: QueryParams) {
  return request.get<ApiResponse<PaginatedResponse<Advertisement>>>('/backstage/ads', {
    params,
  })
}

/**
 * 根据 ID 获取广告详情
 */
export function getAdById(id: string) {
  return request.get<ApiResponse<Advertisement>>(`/backstage/ads/${id}`)
}

/**
 * 创建广告
 */
export function createAd(data: CreateAdDto) {
  return request.post<ApiResponse<Advertisement>>('/backstage/ads', data)
}

/**
 * 更新广告
 */
export function updateAd(id: string, data: UpdateAdDto) {
  return request.put<ApiResponse<Advertisement>>(`/backstage/ads/${id}`, data)
}

/**
 * 删除广告
 */
export function deleteAd(id: string) {
  return request.delete<ApiResponse<void>>(`/backstage/ads/${id}`)
}

/**
 * 发布广告
 */
export function publishAd(id: string) {
  return request.put<ApiResponse<Advertisement>>(`/backstage/ads/${id}/publish`)
}
