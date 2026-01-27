import { z } from 'zod'
import { statusSchema } from '@/schema/db/exhibition'

export const exhibitionSchema = z.object({
  id: z.string(),
  title: z.string(),
  venue: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  officialUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  status: statusSchema,
  isOngoing: z.boolean(),
})
export type Exhibition = z.infer<typeof exhibitionSchema>

export type OngoingStatusType = 'all' | 'ongoing' | 'upcoming'
export const ongoingStatusOptions = [
  { label: 'すべて', value: 'all' },
  { label: '開催中', value: 'ongoing' },
  { label: '開催予定', value: 'upcoming' },
] satisfies { label: string; value: OngoingStatusType }[]
