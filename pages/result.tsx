import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import NameCard from '@/components/NameCard'
import { CompanyNameResponse, CompanyNameSuggestion } from '@/lib/openai'

interface ResultData {
  id: number
  industry: string
  legalName: string
  phone: string
  birthDate: string | null
  location: string | null
  suggestions: CompanyNameResponse | CompanyNameSuggestion[]
  createdAt: string
  rating?: number | null
}

export default function Result() {
  const router = useRouter()
  const { id } = router.query
  
  const [data, setData] = useState<ResultData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rating, setRating] = useState<number | null>(null)

  // 检查是否是新格式的响应
  const isNewFormat = (suggestions: any): suggestions is CompanyNameResponse => {
    return suggestions && 'coreAnalysis' in suggestions && 'nameSuggestions' in suggestions && 'summary' in suggestions
  }

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

  const responseData = data.suggestions
  const isNew = isNewFormat(responseData)
  const nameSuggestions = isNew ? (responseData.nameSuggestions || []) : (Array.isArray(responseData) ? responseData : [])

  return (
    <Layout title="生成结果 - 易名AI">
      <section className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              为您生成的吉利名称
            </h1>
            <p className="text-gray-600">
              基于周易五行与命理分析，为{data.industry}行业精心定制
            </p>
          </div>

          {/* 核心信息分析 (仅新格式) */}
          {isNew && responseData.coreAnalysis && (
            <div className="mb-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 核心信息分析</h2>

              {/* 行业分析 */}
              {responseData.coreAnalysis.industry && (
                <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">🏢</span>
                    行业分析
                  </h3>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">行业：</span>
                      <span className="font-semibold text-gray-900 ml-2">{responseData.coreAnalysis.industry.name || '未知'}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">五行属性：</span>
                      <span className="font-semibold text-blue-700 ml-2">{responseData.coreAnalysis.industry.wuxingAttributes || '未知'}</span>
                    </div>
                    {responseData.coreAnalysis.industry.description && (
                      <p className="text-sm text-gray-700 mt-3">{responseData.coreAnalysis.industry.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 法人命理分析 */}
              {responseData.coreAnalysis.legalRepresentative && (
                <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    法人命理分析
                  </h3>
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">姓名：</span>
                        <span className="font-semibold text-gray-900 ml-2">
                          {responseData.coreAnalysis.legalRepresentative.name || '未知'}
                        </span>
                        {responseData.coreAnalysis.legalRepresentative.pinyin && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({responseData.coreAnalysis.legalRepresentative.pinyin})
                          </span>
                        )}
                      </div>
                      {responseData.coreAnalysis.legalRepresentative.totalStrokes && (
                        <div>
                          <span className="text-sm text-gray-600">总笔画：</span>
                          <span className="font-semibold text-purple-700 ml-2">
                            {responseData.coreAnalysis.legalRepresentative.totalStrokes}画
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {responseData.coreAnalysis.legalRepresentative.characters && 
                     Array.isArray(responseData.coreAnalysis.legalRepresentative.characters) &&
                     responseData.coreAnalysis.legalRepresentative.characters.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {responseData.coreAnalysis.legalRepresentative.characters.map((char, idx) => (
                          <div key={idx} className="bg-purple-50 rounded-md px-3 py-2 border border-purple-200">
                            <span className="text-lg font-bold text-purple-900">{char?.char || ''}</span>
                            <span className="text-xs text-gray-600 ml-1">
                              {char?.strokes || 0}画 · {char?.wuxing || ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {responseData.coreAnalysis.legalRepresentative.numerologyNote && (
                      <p className="text-sm text-gray-700 bg-purple-50 rounded-md p-3 border border-purple-100">
                        {responseData.coreAnalysis.legalRepresentative.numerologyNote}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 八字分析 */}
              {responseData.coreAnalysis.bazi && (
                <div className="card bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">☯️</span>
                    八字命理分析 (Bazi Analysis)
                  </h3>
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    {responseData.coreAnalysis.bazi.birthDate && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">出生日期：</span>
                        <span className="font-semibold text-gray-900 ml-2">{responseData.coreAnalysis.bazi.birthDate}</span>
                      </div>
                    )}
                    
                    {responseData.coreAnalysis.bazi.chart && (
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-amber-50 rounded-md p-3 border border-amber-200">
                          <div className="text-xs text-gray-600 mb-1">年柱</div>
                          <div className="font-semibold text-amber-900">{responseData.coreAnalysis.bazi.chart.year || '-'}</div>
                        </div>
                        <div className="bg-amber-50 rounded-md p-3 border border-amber-200">
                          <div className="text-xs text-gray-600 mb-1">月柱</div>
                          <div className="font-semibold text-amber-900">{responseData.coreAnalysis.bazi.chart.month || '-'}</div>
                        </div>
                        <div className="bg-amber-50 rounded-md p-3 border border-amber-200">
                          <div className="text-xs text-gray-600 mb-1">日柱</div>
                          <div className="font-semibold text-amber-900">{responseData.coreAnalysis.bazi.chart.day || '-'}</div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      {responseData.coreAnalysis.bazi.dayMaster && (
                        <div>
                          <span className="font-semibold text-amber-900">日主：</span>
                          <span className="text-gray-900 ml-2">{responseData.coreAnalysis.bazi.dayMaster}</span>
                          {responseData.coreAnalysis.bazi.dayMasterDescription && (
                            <span className="text-gray-600 ml-2">— {responseData.coreAnalysis.bazi.dayMasterDescription}</span>
                          )}
                        </div>
                      )}
                      {responseData.coreAnalysis.bazi.strength && (
                        <div>
                          <span className="font-semibold text-amber-900">五行旺衰：</span>
                          <span className="text-gray-900 ml-2">{responseData.coreAnalysis.bazi.strength}</span>
                        </div>
                      )}
                      {responseData.coreAnalysis.bazi.strengthAnalysis && (
                        <p className="text-gray-700 bg-amber-50 rounded-md p-3 border border-amber-100">
                          {responseData.coreAnalysis.bazi.strengthAnalysis}
                        </p>
                      )}
                      {responseData.coreAnalysis.bazi.favorableElements && 
                       Array.isArray(responseData.coreAnalysis.bazi.favorableElements) &&
                       responseData.coreAnalysis.bazi.favorableElements.length > 0 && (
                        <div className="bg-green-50 rounded-md p-3 border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-green-900">喜用神：</span>
                            {responseData.coreAnalysis.bazi.favorableElements.map((element, idx) => (
                              <span key={idx} className="px-2 py-1 bg-green-200 text-green-900 text-sm font-bold rounded">
                                {element}
                              </span>
                            ))}
                          </div>
                          {responseData.coreAnalysis.bazi.favorableElementsNote && (
                            <p className="text-sm text-gray-700">{responseData.coreAnalysis.bazi.favorableElementsNote}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 电话号码分析 */}
              {responseData.coreAnalysis.phoneNumber && (
                <div className="card bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    电话号码分析 (Numerology)
                  </h3>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      {responseData.coreAnalysis.phoneNumber.number && (
                        <div>
                          <span className="text-sm text-gray-600">号码：</span>
                          <span className="font-semibold text-gray-900 ml-2">{responseData.coreAnalysis.phoneNumber.number}</span>
                        </div>
                      )}
                      {responseData.coreAnalysis.phoneNumber.digitSum !== undefined && (
                        <div>
                          <span className="text-sm text-gray-600">数字之和：</span>
                          <span className="font-semibold text-green-700 ml-2">{responseData.coreAnalysis.phoneNumber.digitSum}</span>
                        </div>
                      )}
                    </div>
                    {responseData.coreAnalysis.phoneNumber.numerologyMeaning && (
                      <p className="text-sm text-gray-700 mb-3">{responseData.coreAnalysis.phoneNumber.numerologyMeaning}</p>
                    )}
                    {(responseData.coreAnalysis.phoneNumber.yijingHexagram || responseData.coreAnalysis.phoneNumber.hexagramMeaning) && (
                      <div className="bg-green-50 rounded-md p-3 border border-green-200">
                        {responseData.coreAnalysis.phoneNumber.yijingHexagram && (
                          <div className="mb-1">
                            <span className="font-semibold text-green-900">易经卦象：</span>
                            <span className="text-gray-900 ml-2">
                              {typeof responseData.coreAnalysis.phoneNumber.yijingHexagram === 'string' 
                                ? responseData.coreAnalysis.phoneNumber.yijingHexagram 
                                : (responseData.coreAnalysis.phoneNumber.yijingHexagram as any)?.hexagram || ''}
                            </span>
                          </div>
                        )}
                        {responseData.coreAnalysis.phoneNumber.hexagramMeaning ? (
                          <p className="text-sm text-gray-700">{responseData.coreAnalysis.phoneNumber.hexagramMeaning}</p>
                        ) : (typeof responseData.coreAnalysis.phoneNumber.yijingHexagram === 'object' && 
                             (responseData.coreAnalysis.phoneNumber.yijingHexagram as any)?.meaning) && (
                          <p className="text-sm text-gray-700">{(responseData.coreAnalysis.phoneNumber.yijingHexagram as any).meaning}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 输入信息摘要 (仅旧格式或作为补充) */}
          {!isNew && (
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
          )}

          {/* 名称建议列表 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💎 公司名称建议</h2>
            {nameSuggestions && nameSuggestions.length > 0 ? (
              <div className="space-y-6">
                {nameSuggestions.map((suggestion, index) => (
                  <NameCard key={index} suggestion={suggestion} index={index} />
                ))}
              </div>
            ) : (
              <div className="card bg-gray-50 border-gray-200 text-center">
                <p className="text-gray-600">暂无名称建议数据</p>
              </div>
            )}
          </div>

          {/* 总结对比表格 (仅新格式) */}
          {isNew && responseData.summary && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 总结与建议</h2>
              
              {/* 对比表格 */}
              {responseData.summary.comparisonTable && 
               Array.isArray(responseData.summary.comparisonTable) &&
               responseData.summary.comparisonTable.length > 0 && (
                <div className="card overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">建议名称</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">五行匹配</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">数理吉凶</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">寓意与行业关联</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {responseData.summary.comparisonTable.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-bold text-gray-900">{item?.name || '-'}</div>
                              {item?.pinyin && (
                                <div className="text-xs text-gray-500">{item.pinyin}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-700">{item?.wuxingMatch || '-'}</td>
                            <td className="px-4 py-3 text-gray-700">{item?.numerology || '-'}</td>
                            <td className="px-4 py-3 text-gray-700">{item?.meaning || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 选择建议 */}
              {responseData.summary.recommendations && 
               Array.isArray(responseData.summary.recommendations) &&
               responseData.summary.recommendations.length > 0 && (
                <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 最后建议</h3>
                  <div className="space-y-2">
                    {responseData.summary.recommendations.map((rec, idx) => (
                      <div key={idx} className="text-sm text-gray-700">
                        {rec?.condition && (
                          <>
                            <span className="font-semibold text-indigo-900">{rec.condition}</span>
                            <span className="text-gray-600">，</span>
                          </>
                        )}
                        {rec?.suggestion && (
                          <span className="text-gray-900">{rec.suggestion}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 评分 */}
          <div className="card text-center mb-8">
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
          <div className="flex items-center justify-center gap-4 mb-8">
            <Link href="/generate" className="btn-primary px-6 py-2">
              再次生成
            </Link>
            <Link href="/history" className="btn-secondary px-6 py-2">
              查看历史
            </Link>
          </div>

          {/* 免责声明 */}
          <div className="card bg-gray-50 border-gray-200">
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              ⚠️ {isNew && responseData.summary?.disclaimer ? responseData.summary.disclaimer : '以上名称建议基于传统玄学理论生成，仅供参考。请务必进行商标查询、工商核名和法律审核，确保名称可用且合法。'}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
