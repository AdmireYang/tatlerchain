/**
 * 文件上传相关 API
 */

import request from '@/utils/request'
import type { ApiResponse, UploadResponse } from '@/types/api'

/**
 * 上传图片
 */
export function uploadImage(file: File, onProgress?: (progress: number) => void) {
  const formData = new FormData()
  formData.append('file', file)

  return request.post<ApiResponse<UploadResponse>>('/backstage/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    },
  })
}
