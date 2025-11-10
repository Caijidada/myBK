import request from './request'
import type { Category, ApiResponse } from '@/types'

// 获取所有分类
export const getCategoryList = () => {
  return request.get<ApiResponse<Category[]>>('/categories')
}

// 获取分类详情
export const getCategoryDetail = (id: number) => {
  return request.get<ApiResponse<Category>>(`/categories/${id}`)
}

// 创建分类（管理员）
export const createCategory = (data: { name: string; description?: string; icon: string }) => {
  return request.post<ApiResponse>('/admin/categories', data)
}

// 更新分类（管理员）
export const updateCategory = (id: number, data: Partial<Category>) => {
  return request.put<ApiResponse>(`/admin/categories/${id}`, data)
}

// 删除分类（管理员）
export const deleteCategory = (id: number) => {
  return request.delete<ApiResponse>(`/admin/categories/${id}`)
}
