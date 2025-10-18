import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function Layout({ 
  children, 
  title = '易名AI - 智能公司起名助手',
  description = '结合AI智能与中国传统玄学，为您的企业提供吉利、专业的命名服务'
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <nav className="container py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-red-600">
                易名AI
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-700 hover:text-red-600 transition-colors">
                  首页
                </Link>
                <Link href="/generate" className="text-gray-700 hover:text-red-600 transition-colors">
                  开始起名
                </Link>
                <Link href="/history" className="text-gray-700 hover:text-red-600 transition-colors">
                  历史记录
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-white py-8 mt-16">
          <div className="container">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">© 2025 易名AI. 结合AI智能与传统文化的智能起名服务</p>
              <p className="text-xs text-gray-500">
                免责声明：本系统基于传统玄学理论生成建议，仅供参考。请咨询专业人士进行商标查询和法律审核。
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

