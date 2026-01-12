import type { ApiClient } from '~/plugins/api'

// 扩展 NuxtApp 类型
declare module '#app' {
  interface NuxtApp {
    $api: ApiClient
  }
}

// 扩展 Vue 类型
declare module 'vue' {
  interface ComponentCustomProperties {
    $api: ApiClient
  }
}

// API 响应基础类型
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 分页参数
export interface PaginationParams {
  page?: number
  pageSize?: number
}

// 分页响应
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 推文类型
export interface Post {
  id: string
  title: string
  slug: string
  content: string // HTML 富文本
  excerpt: string
  category: string
  coverImage: string
  detailImage?: {
    url: string
    authorName?: string
    authorLink?: string
  }
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: string
  viewCount: number
  author: {
    id: string
    name: string
  }
  advertisements?: PostAdvertisement[]
  createdAt: string
  updatedAt: string
}

// 推文广告关联
export interface PostAdvertisement {
  advertisementId: string
  sortOrder: number
  advertisement: Advertisement
}

// 广告类型
export interface Advertisement {
  id: string
  title: string
  category: string
  imageUrl: string
  linkUrl: string
  clickCount: number
  impressionCount: number
  status: 'ACTIVE' | 'INACTIVE'
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

// 埋点事件类型
export type TrackEventType = 'EXPOSURE' | 'LEAVE' | 'CLICK'

export interface TrackEventParams {
  code: string
  type: TrackEventType
  pagePath: string
  pageTitle?: string
  referrer?: string
  deviceId?: string
  deviceType?: string
  os?: string
  osVersion?: string
  browser?: string
  browserVersion?: string
  screenWidth?: number
  screenHeight?: number
  sessionId?: string
  extra?: Record<string, unknown>
  duration?: number
}
