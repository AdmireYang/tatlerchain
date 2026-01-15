import type { $Fetch } from 'ofetch'

// 扩展类型
declare module '#app' {
  interface NuxtApp {
    $http: $Fetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: $Fetch
  }
}

// API 响应结构
interface ApiResponse<T = unknown> {
  code: number
  data: T
  message?: string
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  // SSR 时使用内部地址，客户端使用公网地址
  const apiBase = import.meta.server
    ? (config.apiBaseServer || config.public.apiBase)
    : config.public.apiBase
  const baseURL = `${apiBase}/api`

  const http = $fetch.create({
    baseURL,

    onRequest({ options }) {
      // 统一请求拦截 - 添加通用请求头
      const headers = new Headers(options.headers)

      // 添加游客 ID
      const visitorId = useCookie('port_visitor_id').value
      if (visitorId) {
        headers.set('X-Visitor-Id', visitorId)
      }

      options.headers = headers
    },

    onResponse({ response }) {
      // 统一响应处理
      const result = response._data as ApiResponse

      if (result?.code === 200) {
        // 成功：直接返回 data
        response._data = result.data
      } else {
        // 失败：返回 false
        console.error(`API Error: ${result?.message || '请求失败'}`)
        response._data = false
      }
    },

    onResponseError({ response }) {
      // HTTP 错误处理
      const status = response.status
      const message = (response._data as ApiResponse)?.message || '请求失败'

      if (status === 401) {
        console.error('未授权，请登录')
      } else if (status === 403) {
        console.error('没有权限')
      } else if (status === 404) {
        console.error('资源不存在')
      } else if (status >= 500) {
        console.error('服务器错误')
      } else {
        console.error(`API Error: ${message}`)
      }

      response._data = false
    },
  })

  return {
    provide: {
      http,
    },
  }
})
