# 🎨 博客系统 - 前端

> 基于 Vue 3 + TypeScript 构建的现代化博客前端应用

[![Vue](https://img.shields.io/badge/Vue-3.4-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-latest-409EFF.svg)](https://element-plus.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 技术栈

| 类别 | 技术 |
|------|------|
| 核心框架 | Vue 3.4 + TypeScript 5.0 |
| 构建工具 | Vite 5.0 |
| UI 组件 | Element Plus |
| 路由管理 | Vue Router 4 |
| 状态管理 | Pinia |
| HTTP 客户端 | Axios |
| 样式方案 | TailwindCSS |

## ✨ 核心功能

### 👤 用户系统
- 邮箱验证码注册/登录
- OAuth2 第三方登录（Google、GitHub）
- JWT Token 认证（双Token机制）
- 个人资料管理

### 📄 内容展示
- 文章列表（分页、筛选、搜索）
- 文章详情（Markdown渲染）
- 分类/标签导航
- 响应式布局

### 💡 交互功能
- 文章点赞/收藏
- 评论系统
- 用户关注

### 🔧 管理功能（管理员）
- 文章审核
- 分类/标签管理
- 用户管理

## 📁 项目结构
```
src/
├── api/           # API 接口定义
├── assets/        # 静态资源
├── components/    # 公共组件
├── router/        # 路由配置
├── stores/        # Pinia 状态管理
├── utils/         # 工具函数
├── views/         # 页面组件
│   ├── admin/     # 管理员页面
│   └── ...        # 其他页面
└── App.vue        # 根组件
```

## 🛠️ 快速开始

### 1️⃣ 安装依赖
```bash
npm install
```

### 2️⃣ 环境配置

创建 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3️⃣ 开发环境
```bash
npm run dev
```

访问 **http://localhost:3000**

### 4️⃣ 生产构建
```bash
npm run build
```

## 🎯 技术亮点

### 1. TypeScript 全面支持
- ✅ 类型安全，提升开发体验
- ✅ 更好的代码提示和重构能力

### 2. 组合式 API
- ⚡ 使用 Vue 3 Composition API
- ⚡ 代码更简洁、逻辑更清晰

### 3. 响应式设计
- 📱 支持移动端、平板、桌面端
- 📱 自适应布局，完美兼容各种设备

### 4. 性能优化
- 🚀 路由懒加载
- 🚀 组件按需引入
- 🚀 Vite 极速构建

### 5. 安全认证
- 🛡️ JWT 双Token机制
- 🛡️ Token 自动刷新
- 🛡️ 路由权限守卫

## 🌐 浏览器支持

现代浏览器（Chrome、Firefox、Safari、Edge）

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| --------- | --------- | --------- | --------- |
| last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 📦 构建优化

- Tree-shaking 自动移除未使用代码
- 代码分割和懒加载
- 生产环境代码压缩
- CSS 模块化

## 🔗 相关链接

- [后端仓库](链接地址)
- [在线演示](演示地址)
- [API 文档](文档地址)

## 📄 License

[MIT](LICENSE)

## 👨‍💻 作者

**CaiJi**

---

⭐ 如果这个项目对你有帮助，请给个 Star！
