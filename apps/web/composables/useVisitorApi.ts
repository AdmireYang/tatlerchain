import type { VisitorInfo } from '~/types/api'
import { useVisitorStore } from '~/stores/visitor'

/**
 * 游客相关 API
 */
export function useVisitorApi() {
  const http = useHttp()
  const visitorStore = useVisitorStore()

  return {
    /**
     * 获取当前游客 ID（从 store）
     */
    getId: (): string => {
      return visitorStore.getId()
    },

    /**
     * 获取游客信息
     */
    getInfo: (visitorId?: string) => {
      const id = visitorId || visitorStore.getId()
      if (!id) throw new Error('Visitor ID not found')
      return http<VisitorInfo>(`/visitor/${id}`)
    },

    /**
     * 绑定用户（登录后调用）
     */
    bindUser: (userId: string) => {
      const visitorId = visitorStore.getId()
      if (!visitorId) throw new Error('Visitor ID not found')
      return http<{ visitorId: string; userId: string; bindAt: string }>(
        `/visitor/${visitorId}/bind`,
        { method: 'POST', body: { userId } },
      )
    },
  }
}

