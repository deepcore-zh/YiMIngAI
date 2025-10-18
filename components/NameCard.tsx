import React from 'react'
import { CompanyNameSuggestion } from '@/lib/openai'

interface NameCardProps {
  suggestion: CompanyNameSuggestion
  index: number
}

export default function NameCard({ suggestion, index }: NameCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 75) return 'text-blue-600 bg-blue-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300 border-l-4 border-red-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold">
            {index + 1}
          </span>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{suggestion.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{suggestion.pinyin}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(suggestion.score)}`}>
          {suggestion.score}分
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <h4 className="text-sm font-semibold text-amber-900 mb-2">五行属性</h4>
          <p className="text-sm text-amber-800">{suggestion.wuxing}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">详细解释</h4>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {suggestion.explanation}
          </p>
        </div>
      </div>
    </div>
  )
}

