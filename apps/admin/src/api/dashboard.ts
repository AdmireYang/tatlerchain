/**
 * Dashboard API
 */
import request from '@/utils/request'

/**
 * 推文统计数据
 */
export interface PostStats {
  total: number
  published: number
  draft: number
  totalViews: number
  trend?: Array<{
    date: string
    count: number
  }>
  topPosts?: Array<{
    id: string
    title: string
    viewCount: number
    publishedAt: string | null
  }>
}

/**
 * 广告统计数据
 */
export interface AdStats {
  total: number
  active: number
  totalClicks: number
  totalImpressions: number
  ctr: string
  trend?: Array<{
    date: string
    ctr: number
  }>
  topAds?: Array<{
    id: string
    title: string
    clickCount: number
    impressionCount: number
    ctr: string
    publishedAt: string | null
  }>
}

/**
 * 综合统计数据
 */
export interface DashboardOverview {
  posts: PostStats
  ads: AdStats
}

/**
 * 获取综合统计数据
 */
export const getDashboardOverview = () => {
  return request.get<DashboardOverview>('/backstage/dashboard')
}

/**
 * 获取推文统计数据
 */
export const getPostsStats = () => {
  return request.get<PostStats>('/backstage/dashboard/posts')
}

/**
 * 获取广告统计数据
 */
export const getAdsStats = () => {
  return request.get<AdStats>('/backstage/dashboard/ads')
}
