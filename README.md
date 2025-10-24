# StarBlog Admin

> 一个现代化的博客管理后台，基于 Vue + ElementUI 开发

[![Vue](https://img.shields.io/badge/Vue-2.5.2-brightgreen.svg)](https://vuejs.org/)
[![Element UI](https://img.shields.io/badge/Element_UI-2.15.6-blue.svg)](https://element.eleme.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 项目简介

StarBlog Admin 是 [StarBlog](https://github.com/Deali-Axy/StarBlog) 博客系统的管理后台，提供完整的博客内容管理功能。StarBlog 是一个基于 .NET 6 和 ASP.NET Core 开发的现代博客系统，支持 Markdown 文章导入，遵循 RESTful 接口规范。

本项目基于 Vue 2 和 Element UI 开发，可作为 Vue 入门学习项目，同时也是 .NET Core 全栈开发的前端部分示例。

## 功能特点

- 📝 **文章管理**：支持创建、编辑、删除博客文章，支持 Markdown 编辑器
- 🏷️ **分类管理**：灵活的文章分类系统，支持设置推荐分类
- 📊 **数据统计**：访问量统计、文章阅读数据分析
- 📷 **摄影作品**：支持摄影作品的上传和管理
- 🔗 **友链管理**：支持友情链接的添加和管理
- 🎨 **主题切换**：支持多种主题色切换
- 🔐 **用户认证**：安全的用户登录和权限管理

## 技术栈

- **前端框架**：Vue 2.5.2
- **UI 组件库**：Element UI 2.15.6
- **状态管理**：Vuex 3.6.2
- **路由管理**：Vue Router 3.0.1
- **HTTP 请求**：Axios
- **Markdown 编辑器**：v-md-editor
- **数据可视化**：@jiaminghi/data-view
- **CSS 预处理器**：Sass

## 安装和使用

### 环境要求

- Node.js >= 6.0.0
- npm >= 3.0.0 或 pnpm

### 推荐使用 pnpm

```bash
# 安装依赖
pnpm i

# 启动开发服务器，默认地址 localhost:8080
pnpm dev

# 构建生产环境版本
pnpm build
```

### 使用 npm

```bash
# 安装依赖
npm install

# 启动开发服务器，默认地址 localhost:8080
npm run dev

# 构建生产环境版本
npm run build

# 构建生产环境版本并查看分析报告
npm run build --report

# 运行单元测试
npm run unit

# 运行所有测试
npm test
```

## 项目结构

```
├── build/            # Webpack 配置文件
├── config/           # 项目配置文件
├── src/              # 源代码
│   ├── assets/       # 静态资源
│   ├── components/   # 公共组件
│   ├── http/         # API 接口和 HTTP 配置
│   ├── router/       # 路由配置
│   ├── store/        # Vuex 状态管理
│   ├── utils/        # 工具函数
│   ├── views/        # 页面视图组件
│   ├── App.vue       # 根组件
│   └── main.js       # 入口文件
├── static/           # 静态文件
└── test/             # 测试文件
```

## 相关链接

- 后端项目：[StarBlog](https://github.com/Deali-Axy/StarBlog)
- Vue.js 文档：[https://vuejs.org/](https://vuejs.org/)
- Element UI 文档：[https://element.eleme.io/](https://element.eleme.io/)

## 许可证

[MIT License](LICENSE)
