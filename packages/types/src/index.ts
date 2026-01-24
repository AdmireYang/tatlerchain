// ============ 分类配置 ============

// 分类键值（用于 URL 路由）
export type CategoryKey = 'museum' | 'profile' | 'opera' | 'gallery' | 'special'

// 分类配置项
export interface CategoryItem {
  key: CategoryKey
  label: string
}

// 分类配置列表
export const CATEGORIES: CategoryItem[] = [
  { key: 'museum', label: '博物' },
  { key: 'profile', label: '人物' },
  { key: 'opera', label: '评弹' },
  { key: 'gallery', label: '影集' },
  { key: 'special', label: '刊中刊' },
] as const

// 分类映射（key -> label）
export const CATEGORY_MAP: Record<CategoryKey, string> = {
  museum: '博物',
  profile: '人物',
  opera: '评弹',
  gallery: '影集',
  special: '刊中刊',
}

// 分类反向映射（label -> key）
export const CATEGORY_LABEL_MAP: Record<string, CategoryKey> = {
  '博物': 'museum',
  '人物': 'profile',
  '评弹': 'opera',
  '影集': 'gallery',
  '刊中刊': 'special',
}

// ============ 用户类型 ============

// 用户类型
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor'
  createdAt: Date
  updatedAt: Date
}

// 推文类型
export interface Post {
  id: string
  title: string
  slug: string
  category?: CategoryKey  // 分类
  content: any
  excerpt: string
  coverImage: string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: Date
  authorId: string
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

// 广告类型
export interface Advertisement {
  id: string
  title: string
  imageUrl: string
  linkUrl: string
  position: 'banner' | 'sidebar' | 'inline'
  startDate: Date
  endDate: Date
  clickCount: number
  impressionCount: number
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

// 标签类型
export interface Tag {
  id: string
  name: string
  slug: string
  createdAt: Date
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
