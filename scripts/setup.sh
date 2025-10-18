#!/bin/bash

echo "🚀 易名AI 项目初始化脚本"
echo "============================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未检测到 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm -v)"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
npm install

# 检查环境变量文件
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  未找到 .env 文件"
    echo "请创建 .env 文件并配置以下环境变量："
    echo "  - DATABASE_URL"
    echo "  - OPENAI_API_KEY"
    echo ""
    
    if [ -f .env.example ]; then
        echo "可以复制 .env.example 作为模板："
        echo "  cp .env.example .env"
    fi
    
    exit 1
fi

echo "✅ 找到 .env 文件"

# 生成 Prisma Client
echo ""
echo "🔧 生成 Prisma Client..."
npx prisma generate

# 初始化数据库
echo ""
echo "🗄️  初始化数据库..."
read -p "是否要立即初始化数据库？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db push
    echo "✅ 数据库初始化完成"
else
    echo "⏭️  跳过数据库初始化"
    echo "   稍后可运行: npx prisma db push"
fi

echo ""
echo "🎉 项目初始化完成！"
echo ""
echo "下一步："
echo "  1. 配置 .env 文件中的环境变量"
echo "  2. 运行 npm run dev 启动开发服务器"
echo "  3. 访问 http://localhost:3000"
echo ""

