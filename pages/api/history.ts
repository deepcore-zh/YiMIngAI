import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { limit = '10', offset = '0', phone } = req.query

    const where = phone && typeof phone === 'string' 
      ? { phone } 
      : {}

    const [records, total] = await Promise.all([
      prisma.companyName.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      }),
      prisma.companyName.count({ where })
    ])

    return res.status(200).json({
      records,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })

  } catch (error) {
    console.error('获取历史记录时出错:', error)
    return res.status(500).json({ 
      error: '获取历史记录失败',
      details: error instanceof Error ? error.message : '未知错误'
    })
  }
}

