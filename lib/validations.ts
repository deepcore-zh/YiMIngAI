import { z } from 'zod'

export const companyNameSchema = z.object({
  industry: z.string().min(1, '请输入公司行业'),
  legalName: z.string().min(2, '法人姓名至少2个字符').max(20, '法人姓名不超过20个字符'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的中国大陆手机号'),
  birthDate: z.string().optional(),
  location: z.string().optional(),
})

export type CompanyNameInput = z.infer<typeof companyNameSchema>

export const ratingSchema = z.object({
  id: z.number(),
  rating: z.number().min(1).max(5),
})

export type RatingInput = z.infer<typeof ratingSchema>

