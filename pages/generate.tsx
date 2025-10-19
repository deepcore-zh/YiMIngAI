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
      <section className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              智能公司起名
            </h1>
            <p className="text-gray-600">
              填写以下信息，AI将为您生成吉利的公司名称建议
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 公司行业 */}
              <div>
                <label htmlFor="industry" className="label">
                  公司行业 <span className="text-red-500">*</span>
                </label>
                <input
                  id="industry"
                  type="text"
                  placeholder="例如：科技、金融、教育、餐饮"
                  className="input"
                  {...register('industry')}
                />
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                )}
              </div>

              {/* 法人姓名 */}
              <div>
                <label htmlFor="legalName" className="label">
                  法人姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="legalName"
                  type="text"
                  placeholder="请输入法人完整姓名"
                  className="input"
                  {...register('legalName')}
                />
                {errors.legalName && (
                  <p className="mt-1 text-sm text-red-600">{errors.legalName.message}</p>
                )}
              </div>

              {/* 法人电话 */}
              <div>
                <label htmlFor="phone" className="label">
                  法人电话号码 <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="13800138000"
                  className="input"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  电话号码用于命理数字能量分析
                </p>
              </div>

              {/* 出生日期（可选） */}
              <div>
                <label htmlFor="birthDate" className="label">
                  法人出生日期（可选）
                </label>
                <input
                  id="birthDate"
                  type="date"
                  className="input"
                  {...register('birthDate')}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  提供出生日期可进行更精准的八字命理分析
                </p>
              </div>

              {/* 公司所在地（可选） */}
              <div>
                <label htmlFor="location" className="label">
                  公司所在地（可选）
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="例如：北京、上海、深圳"
                  className="input"
                  {...register('location')}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* 提交按钮 */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '正在生成...' : '生成名称'}
                </button>
              </div>
            </form>
          </div>

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 温馨提示</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 所有标注 * 的字段为必填项</li>
              <li>• 提供更完整的信息可获得更精准的命名建议</li>
              <li>• 生成过程需要10-30秒，请耐心等待</li>
              <li>• 生成的名称仅供参考，请进行商标查询和法律审核</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  )
}

