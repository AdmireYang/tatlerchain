// 用户类型
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  createdAt: Date;
  updatedAt: Date;
}

// 推文类型
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt: string;
  coverImage: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  authorId: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 广告类型
export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: 'banner' | 'sidebar' | 'inline';
  startDate: Date;
  endDate: Date;
  clickCount: number;
  impressionCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
