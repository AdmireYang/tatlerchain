/**
 * API 类型定义
 */

// ==================== 用户相关类型 ====================

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'EDITOR'
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
  advertisements: Advertisement[]
  createdAt: string
  updatedAt: string
}

export interface CreatePostDto {
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
  advertisementIds?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdatePostDto extends Partial<CreatePostDto> {}

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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateAdDto extends Partial<CreateAdDto> {}

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
