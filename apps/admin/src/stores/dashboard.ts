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
      const response = await getDashboardOverview()
      postsStats.value = response.data.posts
      adsStats.value = response.data.ads
    } catch {
      throw new Error('获取统计数据失败')
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
      const response = await getPostsStats()
      postsStats.value = response.data
    } catch {
      throw new Error('获取推文统计数据失败')
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
      const response = await getAdsStats()
      adsStats.value = response.data
    } catch {
      throw new Error('获取广告统计数据失败')
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
