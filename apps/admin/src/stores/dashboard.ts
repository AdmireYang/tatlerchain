/**
 * Dashboard Store
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PostStats, AdStats } from '@/api/dashboard'
import { getDashboardOverview, getPostsStats, getAdsStats } from '@/api/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  // 状态
  const postsStats = ref<PostStats | null>(null)
  const adsStats = ref<AdStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取综合统计数据
   */
  const fetchOverview = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await getDashboardOverview()
      postsStats.value = data.posts
      adsStats.value = data.ads
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取统计数据失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取推文统计数据
   */
  const fetchPostsStats = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await getPostsStats()
      postsStats.value = data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取推文统计数据失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取广告统计数据
   */
  const fetchAdsStats = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await getAdsStats()
      adsStats.value = data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取广告统计数据失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置状态
   */
  const reset = () => {
    postsStats.value = null
    adsStats.value = null
    loading.value = false
    error.value = null
  }

  return {
    // 状态
    postsStats,
    adsStats,
    loading,
    error,

    // 操作
    fetchOverview,
    fetchPostsStats,
    fetchAdsStats,
    reset,
  }
})
