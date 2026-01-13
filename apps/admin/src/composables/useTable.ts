/**
 * 表格数据管理组合式函数
 */

import { ref, computed } from 'vue'
import type { QueryParams, PaginatedResponse } from '@/types/api'

/**
 * 表格数据管理 Hook
 * @param fetchFn 数据获取函数
 */
export function useTable<T>(
  fetchFn: (params: QueryParams) => Promise<{ data: { data: PaginatedResponse<T> } }>
) {
  // ==================== 状态 ====================
  const data = ref<T[]>([])
  const total = ref(0)
  const loading = ref(false)
  const page = ref(1)
  const pageSize = ref(10)
  const filters = ref<Record<string, any>>({})

  // ==================== 计算属性 ====================
  const hasData = computed(() => data.value.length > 0)
  const isEmpty = computed(() => !loading.value && data.value.length === 0)
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  // ==================== 方法 ====================

  /**
   * 获取数据
   */
  async function fetchData(params?: QueryParams) {
    loading.value = true
    try {
      const queryParams: QueryParams = {
        page: params?.page ?? page.value,
        pageSize: params?.pageSize ?? pageSize.value,
        ...filters.value,
        ...params,
      }

      const response = await fetchFn(queryParams)
      const result = response.data.data

      data.value = result.data
      total.value = result.meta.total
      page.value = result.meta.page
      pageSize.value = result.meta.pageSize
    } catch (error) {
      console.error('获取数据失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理页码变化
   */
  function handlePageChange(newPage: number) {
    page.value = newPage
    fetchData()
  }

  /**
   * 处理每页大小变化
   */
  function handlePageSizeChange(newPageSize: number) {
    pageSize.value = newPageSize
    page.value = 1 // 重置到第一页
    fetchData()
  }

  /**
   * 设置筛选条件
   */
  function setFilters(newFilters: Record<string, any>) {
    filters.value = { ...filters.value, ...newFilters }
    page.value = 1 // 重置到第一页
  }

  /**
   * 重置筛选条件
   */
  function resetFilters() {
    filters.value = {}
    page.value = 1
  }

  /**
   * 刷新当前页
   */
  function refresh() {
    fetchData()
  }

  /**
   * 重置并刷新
   */
  function reset() {
    page.value = 1
    pageSize.value = 10
    filters.value = {}
    fetchData()
  }

  return {
    // 状态
    data,
    total,
    loading,
    page,
    pageSize,
    filters,
    // 计算属性
    hasData,
    isEmpty,
    totalPages,
    // 方法
    fetchData,
    handlePageChange,
    handlePageSizeChange,
    setFilters,
    resetFilters,
    refresh,
    reset,
  }
}
