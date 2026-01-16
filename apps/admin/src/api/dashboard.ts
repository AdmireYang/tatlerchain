/**
 * Dashboard API
 */
import { get } from '@/utils/request'

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
export const getDashboardOverview = (): Promise<DashboardOverview> => {
  return get<DashboardOverview>('/backstage/dashboard')
}

/**
 * 获取推文统计数据
 */
export const getPostsStats = (): Promise<PostStats> => {
  return get<PostStats>('/backstage/dashboard/posts')
}

/**
 * 获取广告统计数据
 */
export const getAdsStats = (): Promise<AdStats> => {
  return get<AdStats>('/backstage/dashboard/ads')
}
