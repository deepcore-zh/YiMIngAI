# 易名AI - 快速开始指南

## 🎯 5分钟快速启动

### 第一步：安装依赖

```bash
npm install
```

### 第二步：配置环境变量

创建 `.env` 文件：

```bash
# 数据库连接 - 使用你的PostgreSQL数据库
DATABASE_URL="postgresql://username:password@localhost:5432/yiming_ai?schema=public"

# OpenAI API Key - 从 https://platform.openai.com/api-keys 获取
OPENAI_API_KEY="sk-your-api-key-here"
```

**没有数据库？** 推荐使用 [Supabase](https://supabase.com) 免费获取PostgreSQL数据库：
1. 访问 https://supabase.com
2. 创建新项目
3. 在 Settings > Database 获取连接字符串
4. 将连接字符串粘贴到 `DATABASE_URL`

**没有OpenAI API Key？** 访问 https://platform.openai.com/api-keys 创建

### 第三步：初始化数据库

```bash
# 生成Prisma客户端
npx prisma generate

# 创建数据库表
npx prisma db push
```

### 第四步：启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 🎉

## 📱 功能测试

### 1. 测试起名功能
1. 访问 http://localhost:3000
2. 点击"开始起名"
3. 填写表单：
   - 行业：科技
   - 法人姓名：张三
   - 电话：13800138000
4. 点击"生成名称"
5. 等待10-30秒，查看生成的名称建议

### 2. 查看历史记录
1. 点击导航栏"历史记录"
2. 查看所有生成记录
3. 点击"查看详情"查看完整信息

### 3. 评分功能
1. 在结果页面底部
2. 点击星星进行评分
3. 刷新页面，评分已保存

## 🔧 常见问题

### Q: 数据库连接失败？
**A:** 检查 DATABASE_URL 是否正确，PostgreSQL服务是否运行

### Q: OpenAI API 调用失败？
**A:** 
1. 检查 OPENAI_API_KEY 是否正确
2. 确保账户有余额
3. 检查网络连接（中国大陆需要VPN）

### Q: 生成速度慢？
**A:** 正常现象，OpenAI API 通常需要10-30秒响应

### Q: 页面样式不正常？
**A:** 
```bash
# 清除缓存重新构建
rm -rf .next
npm run dev
```

## 🚀 部署到生产环境

### Vercel 一键部署

1. 将代码推送到GitHub
2. 访问 https://vercel.com
3. 点击 "Import Project"
4. 选择你的GitHub仓库
5. 配置环境变量：
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
6. 点击 Deploy

🎊 5分钟后你的应用就上线了！

## 📚 下一步

- 阅读完整 [README_YIMING.md](./README_YIMING.md)
- 查看 [PRD.md](./PRD.md) 了解产品设计
- 自定义样式和主题
- 添加用户认证功能
- 集成支付系统

## 💡 开发技巧

### 查看数据库
```bash
npx prisma studio
```
在浏览器中可视化管理数据库

### 重置数据库
```bash
npx prisma db push --force-reset
```

### 查看API日志
打开浏览器开发者工具 > Network 标签页

## 🆘 需要帮助？

- 查看项目文档
- 提交 GitHub Issue
- 发送邮件至：support@yiming.ai

---

祝你使用愉快！ 🎉



---
<!-- LAST_UPDATE: 2025-10-20 22:34:39 -->
**最后更新时间**: 2025-10-20 22:34:39