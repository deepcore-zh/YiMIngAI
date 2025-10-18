import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { ratingSchema } from '@/lib/validations'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 验证输入
    const validationResult = ratingSchema.safeParse(req.body)
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: '输入验证失败', 
        details: validationResult.error.errors 
      })
    }

    const { id, rating } = validationResult.data

    // 更新评分
    const record = await prisma.companyName.update({
      where: { id },
      data: { rating },
    })

    return res.status(200).json({
      success: true,
      rating: record.rating,
      message: '评分已保存'
    })

  } catch (error) {
    console.error('保存评分时出错:', error)
    return res.status(500).json({ 
      error: '保存评分失败',
      details: error instanceof Error ? error.message : '未知错误'
    })
  }
}

