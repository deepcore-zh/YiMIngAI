# 🚀 从这里开始 - 易名AI

欢迎使用易名AI！这是一个简单的入门指南，帮助您快速启动项目。

---

## ⚡ 60秒快速启动

```bash
# 1️⃣ 安装依赖（需要1-2分钟）
npm install

# 2️⃣ 配置环境变量（手动操作）
# 创建 .env 文件，复制以下内容并填写：
cat > .env << 'EOF'
DATABASE_URL="postgresql://username:password@localhost:5432/yiming_ai"
OPENAI_API_KEY="sk-your-key-here"
EOF

# 3️⃣ 初始化数据库
npx prisma generate
npx prisma db push

# 4️⃣ 启动开发服务器
npm run dev
```

**完成！** 访问 http://localhost:3000

---

## 🎯 你需要准备什么？

### 必需项（2个）

#### 1. PostgreSQL 数据库 
**获取方式（选一个）：**

**🌟 推荐：Supabase（免费、简单）**
```
1. 访问 https://supabase.com
2. 注册并创建新项目（约2分钟）
3. 进入 Settings > Database
4. 复制 "Connection string" > "URI"
5. 粘贴到 .env 的 DATABASE_URL
```

**或者：本地PostgreSQL**
```bash
# macOS
brew install postgresql
brew services start postgresql
createdb yiming_ai

# Linux
sudo apt-get install postgresql
sudo service postgresql start
sudo -u postgres createdb yiming_ai

# Windows
下载安装：https://www.postgresql.org/download/windows/
```

#### 2. OpenAI API Key
**获取方式：**
```
1. 访问 https://platform.openai.com/api-keys
2. 注册/登录 OpenAI 账户
3. 点击 "Create new secret key"
4. 复制密钥（sk-...）
5. 粘贴到 .env 的 OPENAI_API_KEY

⚠️ 注意：
- 需要绑定支付方式（约5美元起）
- 中国大陆需要VPN访问
- 保管好密钥，不要泄露
```

---

## 📋 详细步骤

### 步骤 1：克隆/下载项目

如果还没有项目代码：
```bash
cd /Users/ljw/workpace/YiMIngAI
```

### 步骤 2：安装 Node.js 依赖

```bash
npm install
```

**预期输出：**
```
added 234 packages in 45s
```

### 步骤 3：配置环境变量

创建 `.env` 文件：

```bash
touch .env
```

编辑 `.env` 文件（用任何文本编辑器）：

```env
# PostgreSQL 数据库连接字符串
# 格式：postgresql://用户名:密码@主机:端口/数据库名
DATABASE_URL="postgresql://postgres:password@localhost:5432/yiming_ai?schema=public"

# OpenAI API 密钥
# 从 https://platform.openai.com/api-keys 获取
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxx"

# 应用URL（可选，开发环境不需要修改）
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 步骤 4：初始化数据库

```bash
# 生成 Prisma 客户端
npx prisma generate

# 创建数据库表
npx prisma db push
```

**成功输出：**
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
```

**可选：查看数据库**
```bash
npx prisma studio
```
浏览器会打开数据库管理界面（http://localhost:5555）

### 步骤 5：启动开发服务器

```bash
npm run dev
```

**成功输出：**
```
ready - started server on 0.0.0.0:3000
```

### 步骤 6：访问应用

打开浏览器访问：
```
http://localhost:3000
```

---

## ✅ 验证安装

### 测试清单

- [ ] 首页正常显示
- [ ] 点击"开始起名"进入表单页
- [ ] 填写表单并提交
- [ ] 等待10-30秒看到生成结果
- [ ] 点击"历史记录"查看保存的记录
- [ ] 对结果进行评分

### 示例测试数据

```
行业：科技
法人姓名：张三
电话号码：13800138000
出生日期：1990-01-01
所在地：北京
```

---

## 🔧 常见问题快速解决

### ❌ 问题1：npm install 失败

**解决方案：**
```bash
# 清除缓存
rm -rf node_modules package-lock.json
npm cache clean --force

# 重新安装
npm install
```

### ❌ 问题2：数据库连接失败

**错误信息：**
```
Error: Can't reach database server
```

**解决方案：**
```bash
# 检查PostgreSQL是否运行
# macOS
brew services list | grep postgresql

# 启动PostgreSQL
brew services start postgresql

# 检查连接字符串是否正确
echo $DATABASE_URL
```

### ❌ 问题3：OpenAI API 调用失败

**错误信息：**
```
Error: Invalid API key
```

**解决方案：**
1. 检查 `.env` 文件中的 `OPENAI_API_KEY` 是否正确
2. 确认密钥以 `sk-` 开头
3. 确保 OpenAI 账户有余额
4. 如在中国大陆，检查VPN连接

### ❌ 问题4：端口3000被占用

**错误信息：**
```
Port 3000 is already in use
```

**解决方案：**
```bash
# 使用其他端口
PORT=3001 npm run dev

# 或者杀掉占用的进程
lsof -ti:3000 | xargs kill
```

### ❌ 问题5：Prisma 生成失败

**解决方案：**
```bash
# 重新生成
npx prisma generate --force

# 如果还是失败，删除并重新生成
rm -rf node_modules/.prisma
npx prisma generate
```

---

## 📚 下一步阅读

完成快速启动后，建议阅读：

1. **[QUICKSTART.md](./QUICKSTART.md)** - 更详细的快速入门
2. **[README_YIMING.md](./README_YIMING.md)** - 完整项目文档
3. **[USAGE.md](./USAGE.md)** - 用户使用指南
4. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 部署到生产环境
5. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - 项目总结

---

## 🎯 功能概览

### 主要功能
1. **智能起名**：基于AI的公司名称生成
2. **传统分析**：周易、五行、命理深度解析
3. **历史管理**：保存和查询历史记录
4. **评分系统**：对生成结果进行反馈

### 技术栈
- 🔷 Next.js 14（React）
- 🔷 TypeScript
- 🔷 Tailwind CSS
- 🔷 PostgreSQL + Prisma
- 🔷 OpenAI GPT-4o

---

## 💡 使用技巧

1. **提供详细信息**：填写出生日期和所在地可获得更精准的建议
2. **多次尝试**：AI每次生成略有不同，可多次生成对比
3. **商标查询**：选定名称后务必进行商标和工商核名
4. **保存记录**：系统自动保存所有生成记录，可随时查看

---

## 🆘 获取帮助

### 文档
- 📖 查看项目文档（上面列出的5个文件）
- 💬 查看代码注释

### 社区
- 🐛 提交Issue：[GitHub Issues]
- 📧 发送邮件：support@yiming.ai
- 🌐 访问网站：https://yiming.ai

### 调试
```bash
# 查看详细日志
npm run dev

# 查看数据库
npx prisma studio

# 检查环境变量
cat .env

# 检查数据库连接
npx prisma db pull
```

---

## 🎉 准备好了吗？

现在你已经了解了所有基础知识，让我们开始吧！

```bash
npm run dev
```

**访问：** http://localhost:3000

祝你使用愉快！🚀

---

## ⭐ 喜欢这个项目？

- ⭐ 给项目点个 Star
- 🔗 分享给朋友
- 💡 提供改进建议
- 🤝 参与贡献代码

---

*易名AI - 结合AI智能与传统文化的智能起名服务*

*© 2025 YiMing AI. All rights reserved.*

