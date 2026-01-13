/**
 * 错误处理工具函数
 * 提供统一的错误处理和错误消息格式化
 */

import { ElMessage } from 'element-plus'
import type { AxiosError } from 'axios'

/**
 * 错误类型
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * 应用错误类
 */
export class AppError extends Error {
  type: ErrorType
  code?: number
  details?: any

  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN, code?: number, details?: any) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.code = code
    this.details = details
  }
}

/**
 * 从 Axios 错误创建应用错误
 */
export function createErrorFromAxios(error: AxiosError): AppError {
  if (!error.response) {
    return new AppError('网络连接失败，请检查网络设置', ErrorType.NETWORK)
  }

  const { status, data } = error.response

  switch (status) {
    case 401:
      return new AppError('登录已过期，请重新登录', ErrorType.AUTH, status, data)
    case 403:
      return new AppError('您没有权限执行此操作', ErrorType.PERMISSION, status, data)
    case 404:
      return new AppError('请求的资源不存在', ErrorType.NOT_FOUND, status, data)
    case 422:
      return new AppError('数据验证失败', ErrorType.VALIDATION, status, data)
    case 500:
      return new AppError('服务器错误，请稍后重试', ErrorType.SERVER, status, data)
    default:
      const message = (data as any)?.message || '操作失败'
      return new AppError(message, ErrorType.UNKNOWN, status, data)
  }
}

/**
 * 处理错误并显示消息
 * @param error 错误对象
 * @param defaultMessage 默认错误消息
 */
export function handleError(error: any, defaultMessage: string = '操作失败'): void {
  console.error('错误处理:', error)

  let message = defaultMessage

  if (error instanceof AppError) {
    message = error.message
  } else if (error instanceof Error) {
    message = error.message || defaultMessage
  } else if (typeof error === 'string') {
    message = error
  }

  // 显示错误消息
  ElMessage.error(message)
}

/**
 * 处理异步操作错误
 * @param fn 异步函数
 * @param errorMessage 错误消息
 * @returns Promise<T | null> 成功返回结果，失败返回 null
 */
export async function handleAsyncError<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    handleError(error, errorMessage)
    return null
  }
}

/**
 * 格式化验证错误
 * @param errors 验证错误对象
 * @returns 格式化后的错误消息
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  const messages: string[] = []

  for (const [field, fieldErrors] of Object.entries(errors)) {
    messages.push(`${field}: ${fieldErrors.join(', ')}`)
  }

  return messages.join('\n')
}

/**
 * 显示验证错误
 * @param errors 验证错误对象
 */
export function showValidationErrors(errors: Record<string, string[]>): void {
  const message = formatValidationErrors(errors)
  ElMessage.error({
    message,
    duration: 5000,
    showClose: true,
  })
}

/**
 * 错误重试包装器
 * @param fn 要执行的函数
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟（毫秒）
 * @returns Promise<T>
 */
export async function retryOnError<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      console.warn(`尝试 ${i + 1}/${maxRetries} 失败:`, error)

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * 安全执行函数（捕获所有错误）
 * @param fn 要执行的函数
 * @param fallback 失败时的回退值
 * @returns T | fallback
 */
export function safeExecute<T>(fn: () => T, fallback: T): T {
  try {
    return fn()
  } catch (error) {
    console.error('安全执行失败:', error)
    return fallback
  }
}

/**
 * 安全执行异步函数（捕获所有错误）
 * @param fn 要执行的异步函数
 * @param fallback 失败时的回退值
 * @returns Promise<T | fallback>
 */
export async function safeExecuteAsync<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.error('安全执行异步失败:', error)
    return fallback
  }
}
