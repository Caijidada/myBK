// src/types/index.ts

// 文章类型
export interface Article {
  id: number
  title: string
  summary: string
  content: string
  coverImage: string
  authorId: number
  authorName: string
  authorAvatar: string
  categoryId: number
  categoryName: string
  tags: Tag[]
  viewCount: number
  likeCount: number
  commentCount: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

// 用户类型
export interface User {
  id: number
  username: string
  email: string
  nickname: string
  avatar: string
  bio: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

// 分类类型
export interface Category {
  id: number
  name: string
  description: string
  icon: string
  articleCount: number
}

// 标签类型
export interface Tag {
  id: number
  name: string
  color: string
  articleCount: number
}

// 评论类型
export interface Comment {
  id: number
  articleId: number
  userId: number
  username: string
  userAvatar: string
  content: string
  parentId?: number
  likeCount: number
  createdAt: string
  children?: Comment[]
}