import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import NameCard from '@/components/NameCard'
import { CompanyNameSuggestion } from '@/lib/openai'

interface ResultData {
  id: number
  industry: string
  legalName: string
  phone: string
  birthDate: string | null
  location: string | null
  suggestions: CompanyNameSuggestion[]
  createdAt: string
}

export default function Result() {
  const router = useRouter()
  const { id } = router.query
  
  const [data, setData] = useState<ResultData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rating, setRating] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/history?limit=1&offset=0`)
        const result = await response.json()

        if (!response.ok || !result.records || result.records.length === 0) {
          throw new Error('未找到生成记录')
        }

        // 找到对应ID的记录
        const record = result.records.find((r: any) => r.id === parseInt(id as string))
        
        if (!record) {
          throw new Error('未找到对应的生成记录')
        }

        setData(record)
        setRating(record.rating)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResult()
  }, [id])

  const handleRating = async (score: number) => {
    if (!data) return

    try {
      const response = await fetch('/api/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: data.id, rating: score }),
      })

      if (response.ok) {
        setRating(score)
      }
    } catch (err) {
      console.error('评分失败:', err)
    }
  }

  if (isLoading) {
    return (
      <Layout title="生成结果 - 易名AI">
        <section className="container py-12">
          <LoadingSpinner message="正在加载结果..." />
        </section>
      </Layout>
    )
  }

  if (error || !data) {
    return (
      <Layout title="生成结果 - 易名AI">
        <section className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card bg-red-50 border-red-200">
              <p className="text-red-800 mb-4">{error || '未找到结果'}</p>
              <Link href="/generate" className="btn-primary">
                重新生成
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout title="生成结果 - 易名AI">
      <section className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              为您生成的吉利名称
            </h1>
            <p className="text-gray-600">
              基于周易五行与命理分析，为{data.industry}行业精心定制
            </p>
          </div>

          {/* 输入信息摘要 */}
          <div className="card mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">输入信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">行业：</span>
                <span className="font-medium text-gray-900">{data.industry}</span>
              </div>
              <div>
                <span className="text-gray-600">法人姓名：</span>
                <span className="font-medium text-gray-900">{data.legalName}</span>
              </div>
              <div>
                <span className="text-gray-600">电话号码：</span>
                <span className="font-medium text-gray-900">{data.phone}</span>
              </div>
              {data.birthDate && (
                <div>
                  <span className="text-gray-600">出生日期：</span>
                  <span className="font-medium text-gray-900">
                    {new Date(data.birthDate).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              )}
              {data.location && (
                <div>
                  <span className="text-gray-600">所在地：</span>
                  <span className="font-medium text-gray-900">{data.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* 名称建议列表 */}
          <div className="space-y-6 mb-8">
            {data.suggestions.map((suggestion, index) => (
              <NameCard key={index} suggestion={suggestion} index={index} />
            ))}
          </div>

          {/* 评分 */}
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              对这次命名建议满意吗？
            </h3>
            <p className="text-sm text-gray-600 mb-4">您的反馈将帮助我们改进服务</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`text-3xl transition-all ${
                    rating && star <= rating
                      ? 'text-yellow-400 hover:text-yellow-500'
                      : 'text-gray-300 hover:text-yellow-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating && (
              <p className="mt-3 text-sm text-green-600">感谢您的评分！</p>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/generate" className="btn-primary px-6 py-2">
              再次生成
            </Link>
            <Link href="/history" className="btn-secondary px-6 py-2">
              查看历史
            </Link>
          </div>

          {/* 免责声明 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              ⚠️ 以上名称建议基于传统玄学理论生成，仅供参考。请务必进行商标查询、工商核名和法律审核，确保名称可用且合法。
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}

