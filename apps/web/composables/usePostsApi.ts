import type { Post, PostListItem, PaginatedData } from '~/types/api'

export interface GetPostsParams {
  page?: number
  pageSize?: number
  category?: string
}

export interface GetRelatedPostsParams {
  page?: number
  pageSize?: number
}

/**
 * 推文相关 API
 */
export function usePostsApi() {
  const http = useHttp()

  return {
    /**
     * 获取已发布的推文列表（返回精简字段）
     */
    getList: (params?: GetPostsParams) => {
      return http<PaginatedData<PostListItem>>('/web/posts', { params })
    },

    /**
     * 根据 slug 获取推文详情（返回完整字段）
     */
    getBySlug: (slug: string) => {
      return http<Post>(`/web/posts/${slug}`)
    },

    /**
     * 获取相关推文（返回精简字段）
     */
    getRelated: (postId: string, params?: GetRelatedPostsParams) => {
      return http<PaginatedData<PostListItem>>(`/web/posts/${postId}/related`, { params })
    },
  }
}

