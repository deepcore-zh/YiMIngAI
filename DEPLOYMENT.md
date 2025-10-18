# 易名AI - 部署指南

本指南将帮助你将易名AI部署到生产环境。

## 📋 部署前检查清单

- [ ] 代码已推送到Git仓库（GitHub/GitLab）
- [ ] 准备好生产环境数据库（PostgreSQL）
- [ ] 获得OpenAI API Key
- [ ] 选择部署平台（Vercel推荐）

## 🌐 Vercel 部署（推荐）

### 优势
- ✅ Next.js原生支持，零配置
- ✅ 自动HTTPS和CDN
- ✅ 免费套餐足够个人项目
- ✅ CI/CD自动部署

### 步骤

#### 1. 准备数据库

推荐使用 **Supabase** 或 **Vercel Postgres**：

**Supabase（免费）：**
```bash
1. 访问 https://supabase.com
2. 创建新项目
3. 等待项目初始化（约2分钟）
4. 进入 Settings > Database
5. 找到 "Connection string" > "URI"
6. 复制连接字符串
```

**Vercel Postgres：**
```bash
1. 在Vercel项目中点击 Storage
2. 创建 Postgres 数据库
3. 自动获得 DATABASE_URL
```

#### 2. 部署到Vercel

**方式一：通过Vercel网站**
```bash
1. 访问 https://vercel.com
2. 点击 "Add New..." > "Project"
3. 导入你的 Git 仓库
4. 配置项目：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: 自动检测
5. 添加环境变量：
   DATABASE_URL=你的数据库连接字符串
   OPENAI_API_KEY=你的OpenAI密钥
6. 点击 "Deploy"
```

**方式二：通过Vercel CLI**
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 设置环境变量
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY

# 生产部署
vercel --prod
```

#### 3. 初始化生产数据库

部署完成后，在Vercel项目设置中：

```bash
# 方法1：在Vercel仪表板中使用命令
npx prisma db push

# 方法2：本地连接生产数据库
DATABASE_URL="生产环境URL" npx prisma db push
```

#### 4. 验证部署

1. 访问 Vercel 提供的域名（如：yiming-ai.vercel.app）
2. 测试起名功能
3. 检查历史记录是否保存
4. 验证API调用正常

### 自定义域名

在Vercel项目设置中：
```
Settings > Domains > Add Domain
输入你的域名：yiming.ai
按照提示配置DNS记录
```

## 🐳 Docker 部署

### 创建 Dockerfile

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db

  db:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: yiming
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: yiming_ai
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 部署

```bash
# 构建并启动
docker-compose up -d

# 初始化数据库
docker-compose exec app npx prisma db push

# 查看日志
docker-compose logs -f app
```

## ☁️ 其他云平台

### Railway

```bash
1. 访问 https://railway.app
2. 连接GitHub仓库
3. 自动检测Next.js项目
4. 添加PostgreSQL数据库
5. 配置环境变量
6. 部署
```

### DigitalOcean App Platform

```bash
1. 创建新App
2. 连接GitHub
3. 选择 Next.js 环境
4. 添加PostgreSQL数据库组件
5. 配置环境变量
6. 部署
```

### AWS Amplify

```bash
1. 创建新应用
2. 连接仓库
3. 构建设置：
   - Build command: npm run build
   - Output directory: .next
4. 环境变量配置
5. 部署
```

## 🔒 生产环境安全配置

### 1. 环境变量安全

```bash
# 永远不要提交 .env 文件
# 在生产环境使用环境变量管理服务
```

### 2. API 限流

在 `pages/api/generate.ts` 添加：

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 10 // 限制10次请求
})
```

### 3. CORS 配置

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'your-domain.com' }
        ]
      }
    ]
  }
}
```

### 4. 数据库连接池

```typescript
// lib/prisma.ts
new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // 生产环境配置
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 60000
  }
})
```

## 📊 监控和日志

### Sentry 错误追踪

```bash
npm install @sentry/nextjs

# 配置 sentry.client.config.js
Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
})
```

### Vercel Analytics

在 Vercel 项目设置中启用：
- Analytics（流量分析）
- Speed Insights（性能监控）

## 🔄 CI/CD 配置

### GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 性能优化

### 1. 图片优化
```typescript
// 使用 Next.js Image 组件
import Image from 'next/image'
```

### 2. 缓存策略
```typescript
// 在 API 路由中添加缓存头
res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
```

### 3. 数据库索引
```prisma
// prisma/schema.prisma
@@index([userId])
@@index([createdAt])
```

## 📈 扩展建议

- 使用 Redis 缓存热门结果
- 配置 CDN 加速静态资源
- 数据库读写分离
- 负载均衡（多实例）

## 🆘 故障排查

### 常见问题

**Q: 部署后页面空白**
```bash
检查构建日志
确认环境变量已设置
查看浏览器控制台错误
```

**Q: 数据库连接超时**
```bash
检查数据库服务状态
确认连接字符串正确
检查防火墙规则
```

**Q: API 调用失败**
```bash
检查 OPENAI_API_KEY
确认账户有余额
查看 Vercel 函数日志
```

## 📞 技术支持

- 文档：https://docs.yiming.ai
- Issues：https://github.com/your-repo/issues
- Email：support@yiming.ai

---

祝部署顺利！🚀

