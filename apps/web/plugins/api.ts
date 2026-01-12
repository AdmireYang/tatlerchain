import type { Post, PaginatedData, Advertisement, TrackEventParams } from '~/types/api'

// API 请求参数类型
type QueryParams = Record<string, string | number | boolean | undefined>

// API 客户端类型
export interface ApiClient {
  // 推文
  posts: {
    getList: (params?: {
      page?: number
      pageSize?: number
      category?: string
    }) => Promise<PaginatedData<Post>>
    getBySlug: (slug: string) => Promise<Post>
    getRelated: (
      postId: string,
      params?: { page?: number; pageSize?: number }
    ) => Promise<PaginatedData<Post>>
  }
  // 广告
  ads: {
    getActive: () => Promise<Advertisement[]>
    recordClick: (id: string) => Promise<{ success: boolean }>
  }
  // 埋点
  track: {
    send: (params: TrackEventParams) => Promise<void>
    exposure: (code: string, extra?: Record<string, unknown>) => Promise<void>
    click: (code: string, extra?: Record<string, unknown>) => Promise<void>
    leave: (code: string, duration?: number, extra?: Record<string, unknown>) => Promise<void>
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const baseURL = `${config.public.apiBase}/api`

  // 创建基础请求方法
  const apiFetch = $fetch.create({
    baseURL: `${baseURL}/web`,
    onRequest({ options }) {
      // 可以在这里添加请求拦截
      options.headers = {
        ...options.headers,
      }
    },
    onResponseError({ response }) {
      // 统一错误处理
      const message = response._data?.message || '请求失败'
      console.error(`API Error: ${message}`)
    },
  })

  // GET 请求封装
  const get = <T>(url: string, params?: QueryParams) => {
    return apiFetch<T>(url, {
      method: 'GET',
      params,
    })
  }

  // POST 请求封装
  const post = <T>(url: string, body?: Record<string, unknown>) => {
    return apiFetch<T>(url, {
      method: 'POST',
      body,
    })
  }

  // ==================== 埋点工具函数 ====================

  // 获取设备信息
  const getDeviceInfo = (): Partial<TrackEventParams> => {
    if (typeof window === 'undefined') return {}

    const ua = navigator.userAgent

    // 设备类型
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
    if (/Mobile|Android|iPhone/i.test(ua)) deviceType = 'mobile'
    else if (/iPad|Tablet/i.test(ua)) deviceType = 'tablet'

    // 操作系统
    let os = 'Unknown'
    let osVersion = ''
    if (/Windows NT ([\d.]+)/.test(ua)) {
      os = 'Windows'
      osVersion = RegExp.$1
    } else if (/Mac OS X ([\d._]+)/.test(ua)) {
      os = 'macOS'
      osVersion = RegExp.$1.replace(/_/g, '.')
    } else if (/Android ([\d.]+)/.test(ua)) {
      os = 'Android'
      osVersion = RegExp.$1
    } else if (/iPhone OS ([\d_]+)/.test(ua)) {
      os = 'iOS'
      osVersion = RegExp.$1.replace(/_/g, '.')
    }

    // 浏览器
    let browser = 'Unknown'
    let browserVersion = ''
    if (/Chrome\/([\d.]+)/.test(ua) && !/Edg/.test(ua)) {
      browser = 'Chrome'
      browserVersion = RegExp.$1
    } else if (/Firefox\/([\d.]+)/.test(ua)) {
      browser = 'Firefox'
      browserVersion = RegExp.$1
    } else if (/Safari\/([\d.]+)/.test(ua) && !/Chrome/.test(ua)) {
      browser = 'Safari'
      browserVersion = RegExp.$1
    } else if (/Edg\/([\d.]+)/.test(ua)) {
      browser = 'Edge'
      browserVersion = RegExp.$1
    }

    return {
      deviceType,
      os,
      osVersion,
      browser,
      browserVersion,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      referrer: document.referrer || undefined,
    }
  }

  // 获取设备 ID
  const getDeviceId = (): string => {
    if (typeof window === 'undefined') return ''
    const key = 'port_device_id'
    let id = localStorage.getItem(key)
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      localStorage.setItem(key, id)
    }
    return id
  }

  // 获取会话 ID
  const getSessionId = (): string => {
    if (typeof window === 'undefined') return ''
    const key = 'port_session_id'
    let id = sessionStorage.getItem(key)
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      sessionStorage.setItem(key, id)
    }
    return id
  }

  // ==================== API 客户端 ====================

  const api: ApiClient = {
    // 推文相关
    posts: {
      getList: (params) => get<PaginatedData<Post>>('/posts', params),
      getBySlug: (slug) => get<Post>(`/posts/${slug}`),
      getRelated: (postId, params) => get<PaginatedData<Post>>(`/posts/${postId}/related`, params),
    },

    // 广告相关
    ads: {
      getActive: () => get<Advertisement[]>('/ads'),
      recordClick: (id) => post<{ success: boolean }>(`/ads/${id}/click`),
    },

    // 埋点相关
    track: {
      send: async (params) => {
        try {
          const body: TrackEventParams = {
            ...getDeviceInfo(),
            ...params,
            deviceId: getDeviceId(),
            sessionId: getSessionId(),
          }

          // 使用 sendBeacon 确保页面关闭时也能发送
          if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            navigator.sendBeacon(`${baseURL}/track`, JSON.stringify(body))
          } else {
            await $fetch(`${baseURL}/track`, {
              method: 'POST',
              body,
            })
          }
        } catch {
          // 埋点失败不影响业务
        }
      },

      exposure: (code, extra) => {
        return api.track.send({
          code,
          type: 'EXPOSURE',
          pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
          pageTitle: typeof document !== 'undefined' ? document.title : '',
          extra,
        })
      },

      click: (code, extra) => {
        return api.track.send({
          code,
          type: 'CLICK',
          pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
          pageTitle: typeof document !== 'undefined' ? document.title : '',
          extra,
        })
      },

      leave: (code, duration, extra) => {
        return api.track.send({
          code,
          type: 'LEAVE',
          pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
          pageTitle: typeof document !== 'undefined' ? document.title : '',
          duration,
          extra,
        })
      },
    },
  }

  return {
    provide: {
      api,
    },
  }
})
