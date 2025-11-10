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


// ==================== src/api/comment.ts ====================
import request from './request'
import type { Comment, CommentForm, CommentQueryParams, PageResponse, ApiResponse } from '@/types'

// 获取评论列表
export const getCommentList = (params: CommentQueryParams) => {
  return request.get<ApiResponse<PageResponse<Comment>>>('/comments', { params })
}

// 发表评论
export const createComment = (data: CommentForm) => {
  return request.post<ApiResponse>('/comments', data)
}

// 删除评论
export const deleteComment = (id: number) => {
  return request.delete<ApiResponse>(`/comments/${id}`)
}

// 点赞评论
export const likeComment = (id: number) => {
  return request.post<ApiResponse>(`/comments/${id}/like`)
}

// 取消点赞评论
export const unlikeComment = (id: number) => {
  return request.delete<ApiResponse>(`/comments/${id}/like`)
}