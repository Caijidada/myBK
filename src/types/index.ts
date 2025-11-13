// src/types/index.ts

// ==================== 用户相关 ====================
export interface User {
  id: number
  username: string
  email: string
  nickname: string
  avatar: string
  bio?: string
  role: 'USER' | 'ADMIN'
  status: number
  createdAt: string
  updatedAt?: string
}
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}
export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  captcha: string
  agree: boolean
}

// ==================== 文章相关 ====================
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
  isTop?: boolean
  isLiked?: boolean
  isCollected?: boolean
  readTime?: number
  createdAt: string
  updatedAt?: string
  publishedAt?: string
}

export interface ArticleListItem {
  id: number
  title: string
  summary: string
  coverImage: string
  authorName: string
  authorAvatar: string
  categoryName: string
  tags: Tag[]
  viewCount: number
  likeCount: number
  commentCount: number
  isTop?: boolean
  createdAt: string
}

export interface ArticleForm {
  title: string
  summary: string
  content: string
  coverImage: string
  categoryId: number
  tags: number[]
  isPublished: boolean
}

// ==================== 分类和标签 ====================
export interface Category {
  id: number
  name: string
  description?: string
  icon: string
  articleCount: number
  sortOrder?: number
  createdAt: string
}

export interface Tag {
  id: number
  name: string
  color?: string
  articleCount: number
  createdAt: string
}

// ==================== 评论相关 ====================
export interface Comment {
  id: number
  articleId: number
  userId: number
  username: string
  userAvatar: string
  content: string
  parentId?: number
  likeCount: number
  isDeleted: number
  createdAt: string
  children?: Comment[]
}

export interface CommentForm {
  articleId: number
  content: string
  parentId?: number
}

// ==================== 收藏相关 ====================
export interface Favorite {
  id: number
  userId: number
  article: ArticleListItem
  createdAt: string
}

// ==================== API 响应 ====================
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageResponse<T = any> {
  records: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface PageParams {
  page: number
  size: number
}

// ==================== 查询参数 ====================
export interface ArticleQueryParams extends PageParams {
  keyword?: string
  categoryId?: number
  tagId?: number
  authorId?: number
  sortBy?: 'time' | 'views' | 'likes'
}

export interface CommentQueryParams extends PageParams {
  articleId: number
}

// ==================== 统计数据 ====================
export interface UserStats {
  articles: number
  followers: number
  following: number
  likes: number
}

export interface ArticleStats {
  total: number
  published: number
  draft: number
}

export interface DashboardStats {
  articleCount: number
  viewCount: number
  userCount: number
  commentCount: number
}

// ==================== 通知相关 ====================
export interface Notification {
  id: number
  type: 'like' | 'comment' | 'follow' | 'system'
  title: string
  content: string
  isRead: boolean
  createdAt: string
  data?: any
}

// ==================== 上传相关 ====================
export interface UploadResponse {
  url: string
  filename: string
  size: number
}

// ==================== 设置相关 ====================
export interface PrivacySettings {
  publicProfile: boolean
  allowComments: boolean
  showFollowers: boolean
}

export interface NotificationSettings {
  emailNotification: boolean
  browserNotification: boolean
  commentNotification: boolean
  likeNotification: boolean
  followNotification: boolean
}

// ==================== 社交账号 ====================
export interface SocialAccount {
  name: string
  icon: string
  color: string
  bound: boolean
  account?: string
}