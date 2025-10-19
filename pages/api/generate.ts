import type { NextApiRequest, NextApiResponse } from 'next'
import { openai, SYSTEM_PROMPT, CompanyNameResponse } from '@/lib/openai'
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
    let userPrompt = `请为以下信息生成3个公司名称建议：
行业：${industry}
法人姓名：${legalName}
法人电话：${phone}`

    if (birthDate) {
      userPrompt += `\n出生日期：${birthDate}`
    }

    if (location) {
      userPrompt += `\n公司所在地：${location}`
    }

    userPrompt += `\n\n请严格按照JSON格式返回完整的结果，包括核心分析(coreAnalysis)、名称建议(nameSuggestions)和总结(summary)。`
    console.log("userPrompt============", userPrompt)
    // 调用OpenAI API
    const completion = await openai.chat.completions.create({
      // model: 'gemini-2.5-pro',
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 8000,  // 增加token限制，确保返回完整
      response_format: { type: "json_object" }
    })

    const responseContent = completion.choices[0].message.content
    console.log("responseContent============", responseContent)
    if (!responseContent) {
      throw new Error('AI 返回了空响应')
    }

    // 解析AI响应 - 处理可能的markdown代码块包裹
    let aiResponse: CompanyNameResponse
    try {
      // 去除可能的markdown代码块标记
      let cleanedContent = responseContent.trim()
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      const parsed = JSON.parse(cleanedContent)
      
      // 验证返回格式包含必要字段
      if (!parsed.coreAnalysis || !parsed.nameSuggestions || !parsed.summary) {
        throw new Error('AI返回的格式不完整')
      }
      
      aiResponse = parsed as CompanyNameResponse
    } catch (parseError) {
      console.error('解析AI响应失败:', parseError)
      throw new Error('无法解析AI响应')
    }

    // 存储到数据库（存储完整的AI响应）
    const record = await prisma.companyName.create({
      data: {
        industry,
        legalName,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        location: location || null,
        suggestions: aiResponse as any,
      },
    })

    return res.status(200).json({
      id: record.id,
      response: aiResponse,
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

