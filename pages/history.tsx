import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { formatDate } from '@/lib/utils'

interface HistoryRecord {
  id: number
  industry: string
  legalName: string
  phone: string
  birthDate: string | null
  location: string | null
  rating: number | null
  createdAt: string
  suggestions: any[]
}

export default function History() {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [phoneFilter, setPhoneFilter] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async (phone?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const url = phone 
        ? `/api/history?phone=${encodeURIComponent(phone)}`
        : '/api/history'
      
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '加载失败')
      }

      setRecords(data.records)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchHistory(phoneFilter)
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400 text-sm">未评分</span>
    
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <Layout title="历史记录 - 易名AI">
      <section className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              历史记录
            </h1>
            <p className="text-gray-600">
              查看过去生成的所有命名记录
            </p>
          </div>

          {/* 搜索框 */}
          <div className="card mb-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="tel"
                placeholder="输入手机号搜索记录"
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
                className="input flex-1"
              />
              <button type="submit" className="btn-primary px-6">
                搜索
              </button>
              {phoneFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setPhoneFilter('')
                    fetchHistory()
                  }}
                  className="btn-secondary px-4"
                >
                  清除
                </button>
              )}
            </form>
          </div>

          {/* 内容区域 */}
          {isLoading ? (
            <LoadingSpinner message="正在加载历史记录..." />
          ) : error ? (
            <div className="card bg-red-50 border-red-200 text-center">
              <p className="text-red-800 mb-4">{error}</p>
              <button onClick={() => fetchHistory()} className="btn-primary">
                重新加载
              </button>
            </div>
          ) : records.length === 0 ? (
            <div className="card text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                暂无历史记录
              </h3>
              <p className="text-gray-600 mb-6">
                {phoneFilter ? '未找到匹配的记录' : '开始生成您的第一个公司名称吧'}
              </p>
              <Link href="/generate" className="btn-primary">
                开始起名
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                共找到 {records.length} 条记录
              </div>
              
              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="card hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            {record.industry}
                          </span>
                          {record.location && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {record.location}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">法人姓名：</span>
                            <span className="font-medium text-gray-900">{record.legalName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">电话号码：</span>
                            <span className="font-medium text-gray-900">{record.phone}</span>
                          </div>
                          {record.birthDate && (
                            <div>
                              <span className="text-gray-600">出生日期：</span>
                              <span className="font-medium text-gray-900">
                                {new Date(record.birthDate).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600">生成时间：</span>
                            <span className="font-medium text-gray-900">
                              {formatDate(new Date(record.createdAt))}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-xs text-gray-600">生成名称数：</span>
                            <span className="ml-1 font-semibold text-gray-900">
                              {record.suggestions.length} 个
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">评分：</span>
                            {renderStars(record.rating)}
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        <Link
                          href={`/result?id=${record.id}`}
                          className="btn-primary px-4 py-2 text-sm whitespace-nowrap"
                        >
                          查看详情
                        </Link>
                      </div>
                    </div>

                    {/* 预览第一个名称 */}
                    {record.suggestions.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">推荐名称：</span>
                          <span className="font-semibold text-gray-900">
                            {record.suggestions[0].name}
                          </span>
                          {record.suggestions[0].score && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                              {record.suggestions[0].score}分
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}

