/**
 * 获取 HTTP 客户端
 * 统一使用插件注入的 $http
 */
export function useHttp() {
  const { $http } = useNuxtApp()
  return $http
}

