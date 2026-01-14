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
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// 推文列表项广告（精简字段）
export interface PostListItemAd {
  sortOrder: number
  advertisement: {
    id: string
    title: string
    category: string
    imageUrl: string
    linkUrl: string
  }
}

// 推文列表项（精简字段，用于列表展示）
export interface PostListItem {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  coverImage: string
  advertisements?: PostListItemAd[]
}

// 推文详情（完整字段）
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

// 游客信息
export interface VisitorInfo {
  visitorId: string
  userId?: string
  user?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  lastActiveAt: string
}
