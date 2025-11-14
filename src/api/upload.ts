import request from './request'
import type { ApiResponse } from '@/types'

/**
 * 上传文章封面
 */
export const uploadCover = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.upload<ApiResponse<{ url: string; filename: string }>>('/upload/cover', formData)
}

/**
 * 上传用户头像
 */
export const uploadAvatar = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.upload<ApiResponse<{ url: string; filename: string }>>('/upload/avatar', formData)
}

/**
 * 上传编辑器图片
 */
export const uploadImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.upload<ApiResponse<{ url: string; filename: string }>>('/upload/image', formData)
}
