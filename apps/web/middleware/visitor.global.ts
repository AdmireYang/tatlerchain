const VISITOR_ID_KEY = 'port_visitor_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2 // 2 年

/**
 * 全局路由中间件
 * 确保每次路由导航时都有游客 ID（只使用 cookie，不使用 Pinia）
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // 跳过错误页面
  if (to.path.includes('__nuxt_error') || to.name === undefined) {
    return
  }

  const visitorIdCookie = useCookie(VISITOR_ID_KEY, {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  })

  // 已有 visitor ID，直接返回
  if (visitorIdCookie.value) {
    return
  }

  // 生成新的游客 ID
  try {
    const { $http } = useNuxtApp()
    const response = await $http<{ visitorId: string }>('/visitor/generate', {
      method: 'POST',
    })

    if (response && response.visitorId) {
      visitorIdCookie.value = response.visitorId
    }
  } catch (error) {
    console.error('Failed to generate visitor ID:', error)
  }
})
