import request from './request'
import type { Tag, ApiResponse } from '@/types'

// 获取所有标签
export const getTagList = () => {
  return request.get<ApiResponse<Tag[]>>('/tags')
}

// 搜索标签
export const searchTags = (keyword: string) => {
  return request.get<ApiResponse<Tag[]>>('/tags/search', { params: { keyword } })
}

// 创建标签
export const createTag = (data: { name: string; color?: string }) => {
  return request.post<ApiResponse>('/tags', data)
}

// 更新标签（管理员）
export const updateTag = (id: number, data: Partial<Tag>) => {
  return request.put<ApiResponse>(`/admin/tags/${id}`, data)
}

// 删除标签（管理员）
export const deleteTag = (id: number) => {
  return request.delete<ApiResponse>(`/admin/tags/${id}`)
}
