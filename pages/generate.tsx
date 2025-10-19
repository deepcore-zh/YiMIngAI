import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Layout from '@/components/Layout'
import { companyNameSchema, CompanyNameInput } from '@/lib/validations'

export default function Generate() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyNameInput>({
    resolver: zodResolver(companyNameSchema),
  })

  const onSubmit = async (data: CompanyNameInput) => {
    setIsLoading(true)
    setError(null)

    try {
      // 将表单数据存储到 sessionStorage
      sessionStorage.setItem('generatingFormData', JSON.stringify(data))
      
      // 立即跳转到等待页面
      router.push('/generating')
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误')
      setIsLoading(false)
    }
  }

  return (
    <Layout title="开始起名 - 易名AI">
      <section className="container py-6">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 - 紧凑版 */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              智能公司起名
            </h1>
            <p className="text-sm text-gray-600">
              融合周易八卦、五行命理、数字能量学，为您的企业量身定制吉祥名称
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* 左侧：表单 */}
            <div className="lg:col-span-2">
              <div className="card">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  
                  {/* 公司行业 */}
                  <div>
                    <label htmlFor="industry" className="label">
                      <span className="text-indigo-600 font-bold mr-1">*</span>
                      公司行业
                    </label>
                    <input
                      id="industry"
                      type="text"
                      placeholder="例如：科技、金融、教育、餐饮"
                      className="input focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      {...register('industry')}
                    />
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                      <span className="text-indigo-700 font-semibold">五行属性：</span>
                      不同行业对应不同五行（科技属金、教育属木、餐饮属火、物流属水、房地产属土），选择与命格相生的行业可增强事业运势
                    </p>
                    {errors.industry && (
                      <p className="mt-1 text-xs text-red-600">{errors.industry.message}</p>
                    )}
                  </div>

                  {/* 法人姓名 */}
                  <div>
                    <label htmlFor="legalName" className="label">
                      <span className="text-indigo-600 font-bold mr-1">*</span>
                      法人姓名
                    </label>
                    <input
                      id="legalName"
                      type="text"
                      placeholder="请输入法人完整姓名"
                      className="input focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      {...register('legalName')}
                    />
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                      <span className="text-indigo-700 font-semibold">姓名学分析：</span>
                      通过姓名笔画、五格数理、三才配置分析命理特征，公司名称需与法人姓名相生相合，形成良好能量共振场
                    </p>
                    {errors.legalName && (
                      <p className="mt-1 text-xs text-red-600">{errors.legalName.message}</p>
                    )}
                  </div>

                  {/* 法人电话 */}
                  <div>
                    <label htmlFor="phone" className="label">
                      <span className="text-indigo-600 font-bold mr-1">*</span>
                      法人电话号码
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="13800138000"
                      className="input focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      {...register('phone')}
                    />
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                      <span className="text-indigo-700 font-semibold">数字能量学：</span>
                      电话号码蕴含数字能量场，每个数字对应特定五行属性和吉凶能量，通过分析号码磁场选择能量相符的名称数理
                    </p>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* 出生日期 */}
                  <div>
                    <label htmlFor="birthDate" className="label">
                      法人出生日期
                      <span className="ml-2 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">推荐填写</span>
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      className="input focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      {...register('birthDate')}
                    />
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                      <span className="text-amber-700 font-semibold">八字命理：</span>
                      出生年月日时构成"四柱八字"决定五行旺衰和喜用神，提供准确生辰可选择补益命格、增强运势的字音字形
                    </p>
                    {errors.birthDate && (
                      <p className="mt-1 text-xs text-red-600">{errors.birthDate.message}</p>
                    )}
                  </div>

                  {/* 公司所在地 */}
                  <div>
                    <label htmlFor="location" className="label">
                      公司所在地
                      <span className="ml-2 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">推荐填写</span>
                    </label>
                    <input
                      id="location"
                      type="text"
                      placeholder="例如：北京、上海、深圳"
                      className="input focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      {...register('location')}
                    />
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                      <span className="text-amber-700 font-semibold">风水方位：</span>
                      不同地域有不同地理气场和五行属性（东木南火西金北水中土），结合地域特征选择名称利于业务扩展和财运亨通
                    </p>
                    {errors.location && (
                      <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>
                    )}
                  </div>

                  {/* 错误提示 */}
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 border border-red-200">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  {/* 提交按钮 */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        正在生成吉名...
                      </span>
                    ) : (
                      '开始生成吉祥名称'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* 右侧：说明信息 */}
            <div className="lg:col-span-1 space-y-4">
              {/* 易经起名原理 */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-sm font-bold text-amber-900">易经起名原理</h3>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  公司起名遵循"天人合一"理念，通过分析<strong>五行命格</strong>、<strong>八字喜忌</strong>、<strong>数字能量</strong>以及<strong>行业属性</strong>，选择与之相生相合的字音、字形、字义，达到"名正言顺，事成业兴"的效果。
                </p>
              </div>

              {/* AI分析维度 */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100 shadow-sm">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-sm font-bold text-indigo-900">AI分析维度</h3>
                </div>
                <ul className="text-xs text-indigo-800 space-y-1 leading-relaxed">
                  <li>• 五行相生相克关系分析</li>
                  <li>• 八字命理格局匹配</li>
                  <li>• 姓名笔画数理吉凶</li>
                  <li>• 数字能量磁场计算</li>
                  <li>• 行业五行属性匹配</li>
                  <li>• 地域风水方位考量</li>
                </ul>
              </div>

              {/* 温馨提示 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100 shadow-sm">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-sm font-bold text-purple-900">温馨提示</h3>
                </div>
                <ul className="text-xs text-purple-800 space-y-1 leading-relaxed">
                  <li>• 信息越完整，分析越精准</li>
                  <li>• 生成时间约10-30秒</li>
                  <li>• 建议配合商标查询</li>
                  <li>• 名称需经工商核准</li>
                  <li>• 可多次生成优选方案</li>
                </ul>
              </div>

              {/* 信息安全提示 */}
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-green-800 leading-relaxed">
                    所有信息仅用于起名分析，我们严格保护您的隐私安全
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

