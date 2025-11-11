// import request from './request'
// import type { User, LoginForm, RegisterForm, ApiResponse } from '@/types'

// // 登录
// export const login = (data: LoginForm) => {
//   return request.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data)
// }

// // 注册
// export const register = (data: RegisterForm) => {
//   return request.post<ApiResponse>('/auth/register', data)
// }

// // 发送邮箱验证码
// export const sendEmailCaptcha = (email: string) => {
//   return request.post<ApiResponse>('/auth/captcha', { email })
// }

// // 获取当前用户信息
// export const getUserInfo = () => {
//   return request.get<ApiResponse<User>>('/user/info')
// }

// // 更新用户信息
// export const updateUserInfo = (data: Partial<User>) => {
//   return request.put<ApiResponse>('/user/info', data)
// }

// // 修改密码
// export const changePassword = (data: { oldPassword: string; newPassword: string }) => {
//   return request.put<ApiResponse>('/user/password', data)
// }

// // 上传头像
// export const uploadAvatar = (formData: FormData) => {
//   return request.upload<ApiResponse<{ url: string }>>('/upload/avatar', formData)
// }
import request from './request'
import type { User, LoginForm, RegisterForm, ApiResponse } from '@/types'

// 开发模式判断
const isDev = import.meta.env.MODE === 'development'

// 登录
export const login = (data: LoginForm) => {
  if (isDev) {
    // 模拟登录
    return new Promise<{ data: { token: string; user: User } }>((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'dev-token',
            user: {
              id: 1,
              username: 'Admin',
              nickname: '管理员',
              email: 'admin@example.com',
              role: 'ADMIN',
              avatar: 'https://i.pravatar.cc/150?img=1'
            } as User
          }
        })
      }, 300) // 模拟接口延迟
    })
  } else {
    // 生产环境调用真实接口
    return request.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data)
  }
}

// 获取当前用户信息
export const getUserInfo = () => {
  if (isDev) {
    // 模拟返回已登录用户
    return new Promise<{ data: User }>((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: 1,
            username: 'Admin',
            nickname: '管理员',
            email: 'admin@example.com',
            role: 'ADMIN',
            avatar: 'https://i.pravatar.cc/150?img=1'
          } as User
        })
      }, 300)
    })
  } else {
    return request.get<ApiResponse<User>>('/user/info')
  }
}