/**
 * 广告状态管理 Store
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Advertisement, AdFilters, CreateAdDto, UpdateAdDto, QueryParams } from '@/types/api'
import { getAds, getAdById, createAd, updateAd, deleteAd, publishAd } from '@/api/ad'

export const useAdStore = defineStore('ad', () => {
  // ==================== 状态 ====================
  const ads = ref<Advertisement[]>([])
  const currentAd = ref<Advertisement | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const filters = ref<AdFilters>({
    status: undefined,
    category: undefined,
  })
  const page = ref(1)
  const pageSize = ref(10)

  // ==================== 计算属性 ====================
  const hasMore = computed(() => ads.value.length < total.value)

  // ==================== 操作方法 ====================

  /**
   * 获取广告列表
   */
  async function fetchAds(params?: QueryParams) {
    loading.value = true
    try {
      const queryParams: QueryParams = {
        page: params?.page ?? page.value,
        pageSize: params?.pageSize ?? pageSize.value,
        status: params?.status ?? filters.value.status,
        category: params?.category ?? filters.value.category,
      }

      const response = await getAds(queryParams)
      ads.value = response.data.data.data
      total.value = response.data.data.meta.total
      page.value = response.data.data.meta.page
      pageSize.value = response.data.data.meta.pageSize
    } catch (error) {
      console.error('获取广告列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据 ID 获取广告详情
   */
  async function fetchAdById(id: string) {
    loading.value = true
    try {
      const response = await getAdById(id)
      currentAd.value = response.data.data
      return response.data.data
    } catch (error) {
      console.error('获取广告详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建广告
   */
  async function create(data: CreateAdDto) {
    loading.value = true
    try {
      const response = await createAd(data)
      // 创建成功后刷新列表
      await fetchAds()
      return response.data.data
    } catch (error) {
      console.error('创建广告失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新广告
   */
  async function update(id: string, data: UpdateAdDto) {
    loading.value = true
    try {
      const response = await updateAd(id, data)
      // 更新成功后刷新列表
      await fetchAds()
      return response.data.data
    } catch (error) {
      console.error('更新广告失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除广告
   */
  async function remove(id: string) {
    loading.value = true
    try {
      await deleteAd(id)
      // 删除成功后刷新列表
      await fetchAds()
    } catch (error) {
      console.error('删除广告失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 发布广告
   */
  async function publish(id: string) {
    loading.value = true
    try {
      const response = await publishAd(id)
      // 发布成功后刷新列表
      await fetchAds()
      return response.data.data
    } catch (error) {
      console.error('发布广告失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 设置筛选条件
   */
  function setFilters(newFilters: Partial<AdFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  /**
   * 重置筛选条件
   */
  function resetFilters() {
    filters.value = {
      status: undefined,
      category: undefined,
    }
    page.value = 1
  }

  /**
   * 设置当前页码
   */
  function setPage(newPage: number) {
    page.value = newPage
  }

  /**
   * 设置每页大小
   */
  function setPageSize(newPageSize: number) {
    pageSize.value = newPageSize
    page.value = 1 // 重置到第一页
  }

  /**
   * 清空当前广告
   */
  function clearCurrentAd() {
    currentAd.value = null
  }

  return {
    // 状态
    ads,
    currentAd,
    total,
    loading,
    filters,
    page,
    pageSize,
    // 计算属性
    hasMore,
    // 方法
    fetchAds,
    fetchAdById,
    create,
    update,
    remove,
    publish,
    setFilters,
    resetFilters,
    setPage,
    setPageSize,
    clearCurrentAd,
  }
})
