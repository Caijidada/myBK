现代化博客系统 - 后端

基于 Spring Boot 3 构建的高性能 RESTful API 服务，提供完整的博客内容管理、用户系统和社交互动功能。

技术栈
	•	框架: Spring Boot 3.1.5
	•	数据库: MySQL 8.0
	•	缓存: Redis 7.0
	•	ORM: MyBatis Plus 3.5.7
	•	安全: Spring Security + JWT
	•	文档: SpringDoc OpenAPI 3
	•	构建: Maven 3.8+
	•	JDK: Java 17

核心功能

认证授权
	•	JWT 双Token机制（Access Token + Refresh Token）
	•	邮箱验证码注册/登录
	•	OAuth2 社交登录（Google、GitHub）
	•	基于角色的权限控制（RBAC）

内容管理
	•	文章 CRUD（Markdown 支持）
	•	分类/标签管理
	•	文章审核流程（管理员）
	•	点赞/收藏功能

用户系统
	•	用户注册/登录
	•	个人资料管理
	•	关注/粉丝系统
	•	邮件通知

评论系统
	•	多级评论（嵌套回复）
	•	评论点赞
	•	评论管理

项目结构

src/main/java/com/blog/
├── config/          # 配置类（安全、Redis、CORS等）
├── controller/      # REST 控制器
├── dto/             # 数据传输对象
│   ├── request/     # 请求 DTO
│   └── response/    # 响应 DTO
├── entity/          # 实体类
├── mapper/          # MyBatis Mapper
├── security/        # 安全相关（JWT、OAuth2）
├── service/         # 业务逻辑层
└── common/          # 公共类（响应、异常等）

数据库设计

核心表：
	•	tb_user - 用户表
	•	tb_article - 文章表
	•	tb_category - 分类表
	•	tb_tag - 标签表
	•	tb_comment - 评论表
	•	tb_article_like - 文章点赞表
	•	tb_article_favorite - 文章收藏表
	•	tb_follow - 用户关注表

快速开始

环境要求
	•	JDK 17+
	•	MySQL 8.0+
	•	Redis 7.0+
	•	Maven 3.8+

数据库初始化

mysql -u root -p < docker/mysql/init.sql

配置文件

修改 application-dev.yml:

spring:
  datasource:
    url: jdbc:mysql://localhost:3307/blog
    username: root
    password: your-password

  redis:
    host: localhost
    port: 6379

  mail:
    username: your-email@gmail.com
    password: your-app-password

启动项目

# Maven 启动
./mvnw spring-boot:run

# 或打包后运行
./mvnw clean package
java -jar target/blog-backend-1.0.0.jar

访问 http://localhost:8080/swagger-ui.html￼ 查看 API 文档

技术亮点

安全设计
	•	JWT 双Token防护，自动刷新机制
	•	OAuth2 标准社交登录集成
	•	邮箱验证码（Redis存储，5分钟过期）

性能优化
	•	Redis 缓存热点数据
	•	MyBatis Plus 分页插件
	•	数据库索引优化

代码质量
	•	统一响应封装
	•	全局异常处理
	•	参数校验（Bean Validation）
	•	RESTful API 设计规范

文档完善
	•	OpenAPI 3.0 自动生成 API 文档
	•	Swagger UI 在线调试

部署友好
	•	Docker 容器化支持
	•	多环境配置（dev/prod）
	•	健康检查接口

API 文档

启动后访问: http://localhost:8080/swagger-ui.html￼

主要接口：
	•	/api/auth/* - 认证相关
	•	/api/articles/* - 文章管理
	•	/api/users/* - 用户管理
	•	/api/comments/* - 评论管理
	•	/api/admin/* - 管理员功能

部署

详见 DEPLOY.md
