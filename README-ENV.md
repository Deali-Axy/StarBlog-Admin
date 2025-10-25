# 环境变量配置说明

## 概述

为了提高安全性，避免将敏感配置信息（如API密钥、服务器地址等）硬编码到代码中，本项目已改为使用环境变量的方式进行配置。

## 配置步骤

1. 复制 `.env.example` 文件并重命名为 `.env`
2. 在 `.env` 文件中填入实际的配置值

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `BASE_URL` | 后端API基础URL | 开发环境: `http://localhost:5038`<br>生产环境: 空 |
| `EXCEPTION_LESS_API_KEY` | Exceptionless API密钥 | 空 |
| `EXCEPTION_LESS_SERVER_URL` | Exceptionless服务器URL | 开发环境: `http://localhost:5000`<br>生产环境: 空 |

## 使用方式

### 开发环境

在项目根目录创建 `.env` 文件：

```bash
BASE_URL=http://localhost:5038
EXCEPTION_LESS_API_KEY=your_development_api_key
EXCEPTION_LESS_SERVER_URL=http://localhost:5000
```

### 生产环境

在部署时设置环境变量，或创建 `.env` 文件：

```bash
BASE_URL=https://your-api-domain.com
EXCEPTION_LESS_API_KEY=your_production_api_key
EXCEPTION_LESS_SERVER_URL=https://your-exceptionless-server.com
```

## 注意事项

1. `.env` 文件已添加到 `.gitignore` 中，不会被提交到版本控制系统
2. 请勿在代码中硬编码敏感信息
3. 在团队协作时，请通过安全渠道分享环境变量的实际值
4. 生产环境建议使用更安全的密钥管理方案