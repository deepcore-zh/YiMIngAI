import React from 'react'
import { CompanyNameSuggestion } from '@/lib/openai'

interface NameCardProps {
  suggestion: CompanyNameSuggestion
  index: number
}

export default function NameCard({ suggestion, index }: NameCardProps) {
  const getInterpretationColor = (interpretation: string) => {
    if (interpretation === '大吉') return 'text-green-600 bg-green-50'
    if (interpretation === '吉') return 'text-blue-600 bg-blue-50'
    if (interpretation === '中吉') return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500">
      {/* 头部：名称、拼音和评分 */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold text-lg">
            {index + 1}
          </span>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{suggestion.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{suggestion.pinyin}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full font-semibold ${getInterpretationColor(suggestion.numerology.interpretation)}`}>
          {suggestion.numerology.interpretation}
        </div>
      </div>

      {/* 名称解析 */}
      <div className="mb-6">
        <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span className="text-xl">📝</span>
          名称解析
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          {suggestion.nameAnalysis}
        </p>
      </div>

      {/* 五行分析 */}
      <div className="mb-6 bg-amber-50 rounded-lg p-5 border border-amber-200">
        <h4 className="text-base font-semibold text-amber-900 mb-3 flex items-center gap-2">
          <span className="text-xl">☯️</span>
          五行分析 (Wu Xing)
        </h4>
        
        {/* 每个字的五行属性 */}
        <div className="space-y-3 mb-4">
          {suggestion.wuxingAnalysis.characters.map((char, idx) => (
            <div key={idx} className="bg-white rounded-md p-3 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-amber-900">{char.char}</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded">
                  五行属{char.wuxing}
                </span>
              </div>
              <p className="text-sm text-gray-700">{char.effect}</p>
            </div>
          ))}
        </div>

        {/* 五行组合效果 */}
        <div className="bg-white rounded-md p-3 border-2 border-amber-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-amber-900">组合效果：</span>
            <span className="px-2 py-1 bg-amber-200 text-amber-900 text-sm font-bold rounded">
              {suggestion.wuxingAnalysis.combination}
            </span>
          </div>
          <p className="text-sm text-gray-700">{suggestion.wuxingAnalysis.combinationEffect}</p>
        </div>
      </div>

      {/* 命理数理 */}
      <div className="mb-6 bg-blue-50 rounded-lg p-5 border border-blue-200">
        <h4 className="text-base font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <span className="text-xl">🔢</span>
          命理数理 (Ming Li)
        </h4>
        
        {/* 笔画详情 */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {suggestion.numerology.strokes.map((stroke, idx) => (
            <div key={idx} className="bg-white rounded-md px-3 py-2 border border-blue-100">
              <span className="text-lg font-bold text-blue-900">{stroke.char}</span>
              <span className="text-xs text-gray-600 ml-1">({stroke.strokes}画)</span>
            </div>
          ))}
          <div className="bg-blue-200 rounded-md px-4 py-2 border-2 border-blue-300">
            <span className="text-sm font-semibold text-blue-900">
              总计：{suggestion.numerology.totalStrokes}画
            </span>
          </div>
        </div>

        {/* 数理释义 */}
        <div className="bg-white rounded-md p-3 border border-blue-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-blue-900">数理释义：</span>
            {suggestion.numerology.meaning}
          </p>
        </div>
      </div>

      {/* 周易卦象 */}
      <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
        <h4 className="text-base font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <span className="text-xl">☰</span>
          周易卦象 (Zhou Yi)
        </h4>
        
        <div className="bg-white rounded-md p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-purple-900">{suggestion.yijingHexagram.hexagram}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {suggestion.yijingHexagram.meaning}
          </p>
        </div>
      </div>
    </div>
  )
}
