import React from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'

export default function Home() {
  const features = [
    {
      icon: '☯️',
      title: '周易八卦',
      description: '基于易经卦象，分析吉凶祸福，选择吉利名称'
    },
    {
      icon: '🔥',
      title: '五行平衡',
      description: '金木水火土五行相生相克，确保名称与命理和谐'
    },
    {
      icon: '✨',
      title: '命理分析',
      description: '结合八字命理，计算笔画数字能量，提升财运'
    },
    {
      icon: '🤖',
      title: 'AI智能',
      description: '先进AI技术，快速生成专业命名建议'
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="container py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            易名AI
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            智能公司起名助手
          </p>
          <p className="text-lg text-gray-500 mb-8">
            结合中国传统玄学与现代AI技术，为您的企业提供吉利、专业的命名服务
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/generate" className="btn-primary px-8 py-3 text-base">
              开始起名
            </Link>
            <Link href="/history" className="btn-secondary px-8 py-3 text-base">
              查看历史
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h2>
          <p className="text-gray-600">基于传统文化与现代科技的完美结合</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">使用流程</h2>
          <p className="text-gray-600">三步即可获得专业命名建议</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">填写信息</h3>
            <p className="text-sm text-gray-600">
              输入公司行业、法人姓名、电话等基本信息
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI分析</h3>
            <p className="text-sm text-gray-600">
              AI基于传统玄学原理进行深度分析和计算
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">获得建议</h3>
            <p className="text-sm text-gray-600">
              收到多个吉利名称及详细解释说明
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <div className="card text-center max-w-2xl mx-auto bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            立即开始为您的企业起个好名字
          </h2>
          <p className="text-gray-600 mb-6">
            专业的命名建议，助力您的事业蒸蒸日上
          </p>
          <Link href="/generate" className="btn-primary px-8 py-3">
            免费试用
          </Link>
        </div>
      </section>
    </Layout>
  )
}

