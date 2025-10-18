import type { NextApiRequest, NextApiResponse } from 'next'
import { openai, SYSTEM_PROMPT, CompanyNameSuggestion } from '@/lib/openai'
import prisma from '@/lib/prisma'
import { companyNameSchema } from '@/lib/validations'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 验证输入
    const validationResult = companyNameSchema.safeParse(req.body)
    console.log("validationResult============", validationResult)
    if (!validationResult.success) {
      return res.status(400).json({
        error: '输入验证失败',
        details: validationResult.error.errors
      })
    }

    const { industry, legalName, phone, birthDate, location } = validationResult.data

    // 构建用户提示
    let userPrompt = `请为以下信息生成3-5个公司名称建议：
行业：${industry}
法人姓名：${legalName}
法人电话：${phone}`

    if (birthDate) {
      userPrompt += `\n出生日期：${birthDate}`
    }

    if (location) {
      userPrompt += `\n公司所在地：${location}`
    }

    userPrompt += `\n\n请严格按照JSON格式返回结果。`
    console.log("userPrompt============", userPrompt)
    // 调用OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gemini-2.5-pro',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    const responseContent = completion.choices[0].message.content
    console.log("responseContent============", responseContent)
    if (!responseContent) {
      throw new Error('AI 返回了空响应')
    }

    // 解析AI响应
    let suggestions: CompanyNameSuggestion[]
    try {
      const parsed = JSON.parse(responseContent)
      // 处理可能的不同响应格式
      suggestions = parsed.suggestions || parsed.names || parsed

      if (!Array.isArray(suggestions)) {
        suggestions = [parsed]
      }
    } catch (parseError) {
      console.error('解析AI响应失败:', parseError)
      throw new Error('无法解析AI响应')
    }

    // 存储到数据库
    const record = await prisma.companyName.create({
      data: {
        industry,
        legalName,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        location: location || null,
        suggestions: suggestions as any,
      },
    })

    return res.status(200).json({
      id: record.id,
      suggestions,
      message: '名称生成成功'
    })

  } catch (error) {
    console.error('生成名称时出错:', error)
    return res.status(500).json({
      error: '生成名称失败',
      details: error instanceof Error ? error.message : '未知错误'
    })
  }
}

