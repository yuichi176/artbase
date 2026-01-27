import { z } from 'zod'
import { statusSchema } from '@/schema/db/exhibition'

const ongoingStatusSchema = z.enum(['ongoing', 'upcoming', 'end'])
export type OngoingStatus = z.infer<typeof ongoingStatusSchema>

export type OngoingStatusFilter = 'all' | OngoingStatus

export const ongoingStatusOptions = [
  { label: 'すべて', value: 'all' as const },
  { label: '開催中', value: 'ongoing' as const },
  { label: '開催前', value: 'upcoming' as const },
] satisfies { label: string; value: OngoingStatusFilter }[]

export const exhibitionSchema = z.object({
  id: z.string(),
  title: z.string(),
  venue: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  officialUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  status: statusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  ongoingStatus: ongoingStatusSchema,
})
export type Exhibition = z.infer<typeof exhibitionSchema>
