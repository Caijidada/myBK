import request from './request'
import type { Article, ArticleListItem, ArticleForm, ArticleQueryParams, PageResponse, ApiResponse } from '@/types'

// 获取文章列表
export const getArticleList = (params: ArticleQueryParams) => {
  return request.get<ApiResponse<PageResponse<ArticleListItem>>>('/articles', { params })
}

// 获取文章详情
export const getArticleDetail = (id: number) => {
  return request.get<ApiResponse<Article>>(`/articles/${id}`)
}

// 创建文章
export const createArticle = (data: ArticleForm) => {
  return request.post<ApiResponse<{ id: number }>>('/articles', data)
}

// 更新文章
export const updateArticle = (id: number, data: ArticleForm) => {
  return request.put<ApiResponse>(`/articles/${id}`, data)
}

// 删除文章
export const deleteArticle = (id: number) => {
  return request.delete<ApiResponse>(`/articles/${id}`)
}

// 发布文章
export const publishArticle = (id: number) => {
  return request.put<ApiResponse>(`/articles/${id}/publish`)
}

// 下架文章
export const unpublishArticle = (id: number) => {
  return request.put<ApiResponse>(`/articles/${id}/unpublish`)
}

// 点赞文章
export const likeArticle = (id: number) => {
  return request.post<ApiResponse>(`/articles/${id}/like`)
}

// 取消点赞
export const unlikeArticle = (id: number) => {
  return request.delete<ApiResponse>(`/articles/${id}/like`)
}

// 收藏文章
export const favoriteArticle = (id: number) => {
  return request.post<ApiResponse>(`/articles/${id}/favorite`)
}

// 取消收藏
export const unfavoriteArticle = (id: number) => {
  return request.delete<ApiResponse>(`/articles/${id}/favorite`)
}

// 获取我的文章
export const getMyArticles = (params: { page: number; size: number; status?: string }) => {
  return request.get<ApiResponse<PageResponse<ArticleListItem>>>('/user/articles', { params })
}

// 获取我的收藏
export const getMyFavorites = (params: { page: number; size: number }) => {
  return request.get<ApiResponse<PageResponse<ArticleListItem>>>('/user/favorites', { params })
}
