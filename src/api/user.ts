import request from './request'
import type { User, LoginForm, RegisterForm, ApiResponse } from '@/types'

// 登录
export const login = (data: LoginForm) => {
  return request.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data)
}

// 注册
export const register = (data: RegisterForm) => {
  return request.post<ApiResponse>('/auth/register', data)
}

// 发送邮箱验证码
export const sendEmailCaptcha = (email: string) => {
  return request.post<ApiResponse>('/auth/captcha', { email })
}

// 获取当前用户信息
export const getUserInfo = () => {
  return request.get<ApiResponse<User>>('/user/info')
}

// 更新用户信息
export const updateUserInfo = (data: Partial<User>) => {
  return request.put<ApiResponse>('/user/info', data)
}

// 修改密码
export const changePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request.put<ApiResponse>('/user/password', data)
}
