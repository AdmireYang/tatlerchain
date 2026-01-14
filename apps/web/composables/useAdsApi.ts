import type { Advertisement } from '~/types/api'

/**
 * 广告相关 API
 */
export function useAdsApi() {
  const http = useHttp()

  return {
    /**
     * 获取有效广告列表
     */
    getActive: () => {
      return http<Advertisement[]>('/web/ads')
    },

    /**
     * 记录广告点击
     */
    recordClick: (id: string) => {
      return http<{ success: boolean }>(`/web/ads/${id}/click`, { method: 'POST' })
    },
  }
}
