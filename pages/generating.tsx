import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { CompanyNameInput } from '@/lib/validations'

export default function Generating() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [estimatedTime] = useState(60) // 预计60秒完成
  const [error, setError] = useState<string | null>(null)

  const steps = [
    { label: '正在分析行业五行属性...', duration: 8 },
    { label: '正在解析法人姓名笔画...', duration: 8 },
    { label: '正在分析电话号码能量...', duration: 8 },
    { label: '正在推演八字命理...', duration: 10 },
    { label: '正在生成吉利名称...', duration: 18 },
    { label: '正在进行五行匹配分析...', duration: 8 },
  ]

  useEffect(() => {
    // 进度条动画 - 60秒内达到95%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + 1
      })
    }, 630) // 约60秒达到95% (60000ms / 95 ≈ 630ms)

    // 计时器
    const timeInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(timeInterval)
    }
  }, [])

  useEffect(() => {
    // 步骤切换动画
    let cumulativeDuration = 0
    steps.forEach((step, index) => {
      cumulativeDuration += step.duration
      setTimeout(() => {
        setCurrentStep(index)
      }, cumulativeDuration * 1000)
    })
  }, [])

  useEffect(() => {
    // 获取表单数据并发起 API 请求
    const formData = sessionStorage.getItem('generatingFormData')
    if (!formData) {
      setError('缺少必要的表单数据')
      setTimeout(() => router.push('/generate'), 2000)
      return
    }

    const data: CompanyNameInput = JSON.parse(formData)

    const generateName = async () => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || '生成失败')
        }

        // 完成后清除 sessionStorage
        sessionStorage.removeItem('generatingFormData')
        
        // 设置进度到 100%
        setProgress(100)
        
        // 短暂延迟后跳转，让用户看到完成状态
        setTimeout(() => {
          router.push(`/result?id=${result.id}`)
        }, 500)
      } catch (err) {
        setError(err instanceof Error ? err.message : '发生未知错误')
        // 3秒后返回生成页面
        setTimeout(() => {
          sessionStorage.removeItem('generatingFormData')
          router.push('/generate')
        }, 3000)
      }
    }

    generateName()
  }, [router])

  const remainingTime = Math.max(0, estimatedTime - elapsedTime)

  if (error) {
    return (
      <Layout title="生成中 - 易名AI">
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
          <div className="max-w-2xl mx-auto px-4">
            <div className="card bg-red-50 border-red-200 text-center">
              <div className="text-6xl mb-6">❌</div>
              <h2 className="text-2xl font-bold text-red-900 mb-4">生成失败</h2>
              <p className="text-red-800 mb-4">{error}</p>
              <p className="text-sm text-red-600">正在返回生成页面...</p>
            </div>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout title="正在生成 - 易名AI">
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="card bg-white/90 backdrop-blur-sm shadow-2xl p-6">
            {/* 标题 */}
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                AI 正在为您精心生成吉利名称
              </h1>
              <p className="text-sm text-gray-600">
                基于周易五行与命理分析 · 预计需要 {estimatedTime} 秒
              </p>
            </div>

            {/* 主要内容区域 - 使用Grid布局 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 左侧：动画和进度 */}
              <div className="space-y-4">
                {/* 动画区域 */}
                <div className="relative w-32 h-32 mx-auto">
                  {/* 外圈旋转 */}
                  <div className="absolute inset-0 border-6 border-purple-200 rounded-full"></div>
                  <div className="absolute inset-0 border-6 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
                  
                  {/* 中圈反向旋转 */}
                  <div className="absolute inset-3 border-4 border-pink-200 rounded-full"></div>
                  <div className="absolute inset-3 border-4 border-transparent border-t-pink-600 rounded-full animate-spin-reverse"></div>
                  
                  {/* 内圈旋转 */}
                  <div className="absolute inset-6 border-3 border-orange-200 rounded-full"></div>
                  <div className="absolute inset-6 border-3 border-transparent border-t-orange-600 rounded-full animate-spin"></div>
                  
                  {/* 中心图标 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl animate-pulse">✨</span>
                  </div>
                </div>

                {/* 当前步骤 */}
                <div className="text-center">
                  <p className="text-base font-semibold text-purple-900 mb-1 animate-pulse">
                    {steps[currentStep]?.label || steps[steps.length - 1]?.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    步骤 {Math.min(currentStep + 1, steps.length)} / {steps.length}
                  </p>
                </div>

                {/* 进度条 */}
                <div>
                  <div className="relative w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-600">
                    <span>{progress}%</span>
                    <span className="font-medium">预计完成</span>
                  </div>
                </div>

                {/* 时间显示 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-900">
                        {elapsedTime}s
                      </div>
                      <div className="text-xs text-blue-700">已用时间</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-900">
                        ~{remainingTime}s
                      </div>
                      <div className="text-xs text-green-700">预计剩余</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：步骤列表 */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span>📋</span>
                  <span>生成步骤</span>
                </h3>
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                      index < currentStep
                        ? 'bg-green-50 border border-green-200'
                        : index === currentStep
                        ? 'bg-purple-50 border border-purple-300 shadow-sm'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        index < currentStep
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                          ? 'bg-purple-600 text-white animate-pulse'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {index < currentStep ? '✓' : index + 1}
                    </div>
                    <span
                      className={`text-xs flex-1 ${
                        index <= currentStep
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 底部提示信息 */}
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div className="flex-1">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    AI 正在综合分析您的信息，基于传统周易五行理论和现代数理分析生成最适合的吉利名称。请勿关闭此页面，完成后将自动跳转到结果页面。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 添加自定义动画 */}
      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </Layout>
  )
}

