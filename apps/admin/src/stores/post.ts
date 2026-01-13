/**
 * 推文状态管理 Store
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Post, PostFilters, CreatePostDto, UpdatePostDto, QueryParams } from '@/types/api'
import { getPosts, getPostById, createPost, updatePost, deletePost, publishPost } from '@/api/post'

export const usePostStore = defineStore('post', () => {
  // ==================== 状态 ====================
  const posts = ref<Post[]>([])
  const currentPost = ref<Post | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const filters = ref<PostFilters>({
    search: '',
    status: undefined,
    category: undefined,
  })
  const page = ref(1)
  const pageSize = ref(10)

  // ==================== 计算属性 ====================
  const hasMore = computed(() => posts.value.length < total.value)

  // ==================== 操作方法 ====================

  /**
   * 获取推文列表
   */
  async function fetchPosts(params?: QueryParams) {
    loading.value = true
    try {
      const queryParams: QueryParams = {
        page: params?.page ?? page.value,
        pageSize: params?.pageSize ?? pageSize.value,
        search: params?.search ?? filters.value.search,
        status: params?.status ?? filters.value.status,
        category: params?.category ?? filters.value.category,
      }

      const response = await getPosts(queryParams)
      posts.value = response.data.data.data
      total.value = response.data.data.meta.total
      page.value = response.data.data.meta.page
      pageSize.value = response.data.data.meta.pageSize
    } catch (error) {
      console.error('获取推文列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据 ID 获取推文详情
   */
  async function fetchPostById(id: string) {
    loading.value = true
    try {
      const response = await getPostById(id)
      currentPost.value = response.data.data
      return response.data.data
    } catch (error) {
      console.error('获取推文详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建推文
   */
  async function create(data: CreatePostDto) {
    loading.value = true
    try {
      const response = await createPost(data)
      // 创建成功后刷新列表
      await fetchPosts()
      return response.data.data
    } catch (error) {
      console.error('创建推文失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新推文
   */
  async function update(id: string, data: UpdatePostDto) {
    loading.value = true
    try {
      const response = await updatePost(id, data)
      // 更新成功后刷新列表
      await fetchPosts()
      return response.data.data
    } catch (error) {
      console.error('更新推文失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除推文
   */
  async function remove(id: string) {
    loading.value = true
    try {
      await deletePost(id)
      // 删除成功后刷新列表
      await fetchPosts()
    } catch (error) {
      console.error('删除推文失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 发布推文
   */
  async function publish(id: string) {
    loading.value = true
    try {
      const response = await publishPost(id)
      // 发布成功后刷新列表
      await fetchPosts()
      return response.data.data
    } catch (error) {
      console.error('发布推文失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 设置筛选条件
   */
  function setFilters(newFilters: Partial<PostFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  /**
   * 重置筛选条件
   */
  function resetFilters() {
    filters.value = {
      search: '',
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
   * 清空当前推文
   */
  function clearCurrentPost() {
    currentPost.value = null
  }

  return {
    // 状态
    posts,
    currentPost,
    total,
    loading,
    filters,
    page,
    pageSize,
    // 计算属性
    hasMore,
    // 方法
    fetchPosts,
    fetchPostById,
    create,
    update,
    remove,
    publish,
    setFilters,
    resetFilters,
    setPage,
    setPageSize,
    clearCurrentPost,
  }
})
