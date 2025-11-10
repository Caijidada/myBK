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

