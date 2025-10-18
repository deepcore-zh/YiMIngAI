# 易名AI (YiMing AI)

![易名AI](https://img.shields.io/badge/易名AI-智能起名-red)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748)

易名AI 是一个结合中国传统玄学（周易、五行、命理）与现代AI技术的智能公司起名助手。通过输入公司行业、法人信息等，AI将基于传统文化原理为您生成专业、吉利的公司名称建议。

## ✨ 核心功能

- 🎯 **智能命名生成**：基于周易八卦、五行相生相克、命理八字原理生成吉利名称
- 📊 **详细解释分析**：每个名称附带五行属性、卦象分析、命理匹配度等详细说明
- 📜 **历史记录管理**：保存所有生成记录，支持按手机号搜索
- ⭐ **用户评分反馈**：对生成结果进行评分，帮助优化服务
- 📱 **响应式设计**：完美支持桌面端和移动端

## 🛠️ 技术栈

### 前端
- **框架**：Next.js 14 (React 18)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **表单处理**：React Hook Form + Zod
- **状态管理**：React Hooks

### 后端
- **API**：Next.js API Routes
- **数据库**：PostgreSQL + Prisma ORM
- **AI服务**：OpenAI GPT-4o

### 部署
- **推荐平台**：Vercel
- **数据库托管**：Supabase 或 Vercel Postgres

## 📦 项目结构

```
yiming-ai/
├── components/          # React 组件
│   ├── Layout.tsx      # 页面布局
│   ├── LoadingSpinner.tsx
│   └── NameCard.tsx    # 名称卡片组件
├── lib/                # 工具函数和配置
│   ├── prisma.ts       # Prisma 客户端
│   ├── openai.ts       # OpenAI 配置
│   ├── utils.ts        # 通用工具
│   └── validations.ts  # Zod 验证模式
├── pages/              # Next.js 页面
│   ├── api/           # API 路由
│   │   ├── generate.ts
│   │   ├── history.ts
│   │   └── rating.ts
│   ├── _app.tsx
│   ├── index.tsx      # 首页
│   ├── generate.tsx   # 起名表单页
│   ├── result.tsx     # 结果展示页
│   └── history.tsx    # 历史记录页
├── prisma/
│   └── schema.prisma  # 数据库模式
├── styles/
│   └── globals.css    # 全局样式
└── public/            # 静态资源
```

## 🚀 快速开始

### 1. 环境要求

- Node.js 18+ 
- PostgreSQL 14+
- OpenAI API Key

### 2. 克隆项目

```bash
git clone <repository-url>
cd YiMIngAI
```

### 3. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 4. 配置环境变量

创建 `.env` 文件：

```bash
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/yiming_ai?schema=public"

# OpenAI API Key
OPENAI_API_KEY="sk-your-openai-api-key"

# 应用URL（可选）
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表
npx prisma db push

# （可选）查看数据库
npx prisma studio
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📖 使用指南

### 1. 填写信息
- 输入公司行业（如：科技、金融、教育）
- 提供法人姓名和电话号码（必填）
- 可选提供出生日期（用于八字分析）和所在地

### 2. AI分析生成
- 系统基于传统玄学原理进行深度分析
- 考虑周易卦象、五行平衡、命理匹配等因素
- 生成过程需要10-30秒

### 3. 查看结果
- 获得3-5个精心推荐的公司名称
- 每个名称包含：
  - 中文名称和拼音
  - 五行属性分析
  - 详细解释说明
  - 吉祥度评分（1-100分）

### 4. 评分反馈
- 对生成结果进行1-5星评分
- 帮助系统优化命名服务

## 🗄️ 数据库模型

### User 表
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String?  @unique
  phone     String?  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  companyNames CompanyName[]
}
```

### CompanyName 表
```prisma
model CompanyName {
  id          Int      @id @default(autoincrement())
  industry    String
  legalName   String
  phone       String
  birthDate   DateTime?
  location    String?
  suggestions Json
  rating      Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      Int?
  user        User?    @relation(fields: [userId], references: [id])
}
```

## 🔌 API 接口

### POST /api/generate
生成公司名称建议

**请求体：**
```json
{
  "industry": "科技",
  "legalName": "张三",
  "phone": "13800138000",
  "birthDate": "1990-01-01",  // 可选
  "location": "北京"           // 可选
}
```

**响应：**
```json
{
  "id": 1,
  "suggestions": [
    {
      "name": "科技兴旺",
      "pinyin": "Kē Jì Xīng Wàng",
      "explanation": "...",
      "wuxing": "水木相生",
      "score": 92
    }
  ],
  "message": "名称生成成功"
}
```

### GET /api/history
获取历史记录

**查询参数：**
- `limit`: 每页数量（默认10）
- `offset`: 偏移量（默认0）
- `phone`: 手机号过滤（可选）

### POST /api/rating
提交评分

**请求体：**
```json
{
  "id": 1,
  "rating": 5
}
```

## 🎨 自定义配置

### 修改主题色

编辑 `tailwind.config.ts`：

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // 自定义颜色
      },
    },
  },
},
```

### 调整AI提示词

编辑 `lib/openai.ts` 中的 `SYSTEM_PROMPT` 变量。

## 🚢 部署指南

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量（DATABASE_URL、OPENAI_API_KEY）
4. 部署完成

### 数据库部署

推荐使用 [Supabase](https://supabase.com)：

1. 创建 Supabase 项目
2. 获取 PostgreSQL 连接字符串
3. 在 Vercel 中配置 DATABASE_URL
4. 运行 `npx prisma db push` 初始化数据库

## ⚠️ 注意事项

1. **API费用**：使用OpenAI API会产生费用，建议设置使用限额
2. **法律合规**：生成的名称仅供参考，需进行商标查询和工商核名
3. **数据隐私**：妥善保管用户个人信息，遵守隐私法规
4. **文化敏感**：玄学内容仅作为文化参考，避免过度宣传

## 📝 开发计划

- [ ] 用户认证系统
- [ ] PDF报告导出
- [ ] 微信小程序版本
- [ ] 付费高级功能
- [ ] 更多传统文化元素集成

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- Email: support@yiming.ai
- Website: https://yiming.ai

---

© 2025 易名AI. 结合AI智能与传统文化的智能起名服务

