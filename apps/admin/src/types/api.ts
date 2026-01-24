/**
 * API 类型定义
 */

// 从 @port/types 导入分类类型
export type { CategoryKey, CategoryItem } from '@port/types'
export { CATEGORIES, CATEGORY_MAP, CATEGORY_LABEL_MAP } from '@port/types'

// ==================== 用户相关类型 ====================

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'EDITOR'
  displayPassword: string
  createdAt: string
  updatedAt: string
}

// ==================== 推文相关类型 ====================

export interface Post {
  id: string
  title: string
  slug: string
  content: any
  excerpt: string
  category: string
  coverImage: string
  detailImage?: {
    url: string
    authorName: string
    authorLink: string
  }
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: string
  author: User
  viewCount: number
  advertisements: {
    advertisement: Advertisement
    sortOrder: number
  }[]
  createdAt: string
  updatedAt: string
}

export interface CreatePostDto {
  title: string
  slug: string
  content: string // HTML 格式的富文本内容
  excerpt: string
  category: string
  coverImage: string
  detailImage?: {
    url: string
    authorName: string
    authorLink: string
  }
  advertisements?: {
    advertisementId: string
    sortOrder?: number
  }[]
}

export interface UpdatePostDto extends Partial<CreatePostDto> {
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export interface PostFilters {
  search?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  category?: string
}

// ==================== 广告相关类型 ====================

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

export interface CreateAdDto {
  title: string
  category: string
  imageUrl: string
  linkUrl: string
}

export interface UpdateAdDto extends Partial<CreateAdDto> {
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface AdFilters {
  status?: 'ACTIVE' | 'INACTIVE'
  category?: string
}

// ==================== 认证相关类型 ====================

export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: User
}

// ==================== API 响应类型 ====================

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// ==================== 查询参数类型 ====================

export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  category?: string
}

// ==================== 数据看板类型 ====================

export interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
}

export interface AdStats {
  totalAds: number
  activeAds: number
  totalClicks: number
  totalImpressions: number
}

export interface ChartData {
  labels: string[]
  values: number[]
}

export interface TopItem {
  id: string
  title: string
  value: number
}

// ==================== 上传相关类型 ====================

export interface UploadResponse {
  url: string
}
