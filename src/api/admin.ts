import request from './request'
import type { DashboardStats, ApiResponse, PageResponse } from '@/types'

// 获取仪表板统计数据
export const getDashboardStats = () => {
  return request.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats')
}

// 获取待审核文章列表
export const getPendingArticles = (params: { page: number; size: number }) => {
  return request.get<ApiResponse<PageResponse>>('/admin/articles/pending', { params })
}

// 审核文章通过
export const approveArticle = (id: number) => {
  return request.put<ApiResponse>(`/admin/articles/${id}/approve`)
}

// 审核文章拒绝
export const rejectArticle = (id: number, reason: string) => {
  return request.put<ApiResponse>(`/admin/articles/${id}/reject`, { reason })
}

// 获取所有用户列表
export const getUserList = (params: { page: number; size: number; keyword?: string }) => {
  return request.get<ApiResponse<PageResponse>>('/admin/users', { params })
}

// 封禁用户
export const banUser = (id: number) => {
  return request.put<ApiResponse>(`/admin/users/${id}/ban`)
}

// 解封用户
export const unbanUser = (id: number) => {
  return request.put<ApiResponse>(`/admin/users/${id}/unban`)
}

// 修改用户角色
export const changeUserRole = (id: number, role: string) => {
  return request.put<ApiResponse>(`/admin/users/${id}/role`, { role })
}