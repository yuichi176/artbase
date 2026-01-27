import { z } from 'zod'
import { statusSchema } from '@/schema/db/exhibition'

const ongoingStatusSchema = z.enum(['all', 'ongoing', 'upcoming', 'end'])
export type OngoingStatusType = z.infer<typeof ongoingStatusSchema>
export const ongoingStatusOptions = [
  { label: 'すべて', value: 'all' },
  { label: '開催中', value: 'ongoing' },
  { label: '開催前', value: 'upcoming' },
] satisfies { label: string; value: OngoingStatusType }[]

export const exhibitionSchema = z.object({
  id: z.string(),
  title: z.string(),
  venue: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  officialUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  status: statusSchema,
  ongoingStatus: ongoingStatusSchema,
})
export type Exhibition = z.infer<typeof exhibitionSchema>
