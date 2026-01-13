/**
 * 对话框工具函数
 * 提供统一的确认对话框和提示对话框
 */

import { ElMessageBox } from 'element-plus'
import type { ElMessageBoxOptions } from 'element-plus'

/**
 * 确认对话框配置
 */
interface ConfirmOptions {
  title?: string
  message: string
  confirmButtonText?: string
  cancelButtonText?: string
  type?: 'success' | 'warning' | 'info' | 'error'
}

/**
 * 显示确认对话框
 * @param options 配置选项
 * @returns Promise<boolean> 用户是否确认
 */
export async function showConfirm(options: ConfirmOptions): Promise<boolean> {
  const {
    title = '提示',
    message,
    confirmButtonText = '确定',
    cancelButtonText = '取消',
    type = 'warning',
  } = options

  try {
    await ElMessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      type,
      center: true,
    })
    return true
  } catch {
    return false
  }
}

/**
 * 显示删除确认对话框
 * @param itemName 要删除的项目名称
 * @returns Promise<boolean> 用户是否确认
 */
export async function showDeleteConfirm(itemName: string = '此项'): Promise<boolean> {
  return showConfirm({
    title: '删除确认',
    message: `确定要删除${itemName}吗？此操作不可恢复。`,
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'error',
  })
}

/**
 * 显示发布确认对话框
 * @param itemName 要发布的项目名称
 * @returns Promise<boolean> 用户是否确认
 */
export async function showPublishConfirm(itemName: string = '此项'): Promise<boolean> {
  return showConfirm({
    title: '发布确认',
    message: `确定要发布${itemName}吗？`,
    confirmButtonText: '发布',
    cancelButtonText: '取消',
    type: 'warning',
  })
}

/**
 * 显示警告对话框
 * @param message 警告消息
 * @param title 标题
 */
export async function showAlert(message: string, title: string = '提示'): Promise<void> {
  await ElMessageBox.alert(message, title, {
    confirmButtonText: '确定',
    center: true,
  })
}

/**
 * 显示错误对话框
 * @param message 错误消息
 * @param title 标题
 */
export async function showErrorAlert(message: string, title: string = '错误'): Promise<void> {
  await ElMessageBox.alert(message, title, {
    confirmButtonText: '确定',
    type: 'error',
    center: true,
  })
}

/**
 * 显示成功对话框
 * @param message 成功消息
 * @param title 标题
 */
export async function showSuccessAlert(message: string, title: string = '成功'): Promise<void> {
  await ElMessageBox.alert(message, title, {
    confirmButtonText: '确定',
    type: 'success',
    center: true,
  })
}

/**
 * 显示输入对话框
 * @param options 配置选项
 * @returns Promise<string | null> 用户输入的值，取消则返回 null
 */
export async function showPrompt(options: {
  title?: string
  message: string
  inputPlaceholder?: string
  inputValue?: string
  inputPattern?: RegExp
  inputErrorMessage?: string
}): Promise<string | null> {
  const {
    title = '输入',
    message,
    inputPlaceholder = '请输入',
    inputValue = '',
    inputPattern,
    inputErrorMessage = '输入格式不正确',
  } = options

  try {
    const { value } = await ElMessageBox.prompt(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder,
      inputValue,
      inputPattern,
      inputErrorMessage,
      center: true,
    })
    return value
  } catch {
    return null
  }
}
