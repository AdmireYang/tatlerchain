import type { TrackEventParams } from '~/types/api'

/**
 * 埋点相关 API
 */
export function useTrackApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase as string
  const http = useHttp()

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

  return {
    /**
     * 发送埋点事件
     */
    send: async (params: Omit<TrackEventParams, 'deviceId' | 'sessionId'>) => {
      try {
        const body: TrackEventParams = {
          ...getDeviceInfo(),
          ...params,
          deviceId: getDeviceId(),
          sessionId: getSessionId(),
        }

        // 使用 sendBeacon 确保页面关闭时也能发送
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          navigator.sendBeacon(`${baseURL}/api/track`, JSON.stringify(body))
        } else {
          await http('/track', { method: 'POST', body })
        }
      } catch {
        // 埋点失败不影响业务
      }
    },

    /**
     * 曝光事件
     */
    exposure: (code: string, extra?: Record<string, unknown>) => {
      return useTrackApi().send({
        code,
        type: 'EXPOSURE',
        pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
        pageTitle: typeof document !== 'undefined' ? document.title : '',
        extra,
      })
    },

    /**
     * 点击事件
     */
    click: (code: string, extra?: Record<string, unknown>) => {
      return useTrackApi().send({
        code,
        type: 'CLICK',
        pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
        pageTitle: typeof document !== 'undefined' ? document.title : '',
        extra,
      })
    },

    /**
     * 离开事件
     */
    leave: (code: string, duration?: number, extra?: Record<string, unknown>) => {
      return useTrackApi().send({
        code,
        type: 'LEAVE',
        pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
        pageTitle: typeof document !== 'undefined' ? document.title : '',
        duration,
        extra,
      })
    },
  }
}
