/**
 * Axios 请求封装
 * 包含请求拦截器、响应拦截器和错误处理
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import type { ApiResponse } from '@/types'
import { createErrorFromAxios, ErrorType } from './error'

// 全局加载实例
let loadingInstance: ReturnType<typeof ElLoading.service> | null = null
let requestCount = 0

// 显示全局加载
function showLoading() {
  if (requestCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
  requestCount++
}

// 隐藏全局加载
function hideLoading() {
  requestCount--
  if (requestCount === 0 && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

// 创建 axios 实例（在运行时通过代理访问 /api）
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 显示全局加载（除非配置中明确禁用）
    if (config.headers && !config.headers['X-Skip-Loading']) {
      showLoading()
    }

    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    hideLoading()
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 隐藏全局加载
    hideLoading()

    const res = response.data

    // 如果返回的状态码不是 200，则判断为错误
    if (res.code !== 200 && res.code !== 0) {
      ElMessage.error(res.message || '操作失败')
      return Promise.reject(new Error(res.message || '操作失败'))
    }

    return response
  },
  (error: AxiosError<ApiResponse>) => {
    // 隐藏全局加载
    hideLoading()

    console.error('响应错误:', error)

    // 创建应用错误
    const appError = createErrorFromAxios(error)

    // 显示错误消息
    ElMessage.error(appError.message)

    // 处理认证错误
    if (appError.type === ErrorType.AUTH) {
      // 清除认证信息
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 延迟跳转，避免在路由守卫中重复跳转
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
    }

    return Promise.reject(appError)
  }
)

// 导出封装的请求方法
export default service

/**
 * GET 请求
 */
export function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return service.get<ApiResponse<T>>(url, config).then((res) => res.data.data)
}

/**
 * POST 请求
 */
export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.post<ApiResponse<T>>(url, data, config).then((res) => res.data.data)
}

/**
 * PUT 请求
 */
export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.put<ApiResponse<T>>(url, data, config).then((res) => res.data.data)
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return service.delete<ApiResponse<T>>(url, config).then((res) => res.data.data)
}

/**
 * PATCH 请求
 */
export function patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.patch<ApiResponse<T>>(url, data, config).then((res) => res.data.data)
}
