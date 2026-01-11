import { z } from 'zod'
import { Timestamp } from '@google-cloud/firestore'

const statusSchema = z.enum(['pending', 'active'])
type Status = z.infer<typeof statusSchema>

export type RawExhibition = {
  title: string
  venue: string
  startDate: Timestamp
  endDate?: Timestamp
  officialUrl?: string
  imageUrl?: string
  status: Status
  updatedAt: Timestamp
  createdAt: Timestamp
}

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

export type OngoingStatusType = 'ongoing' | 'upcoming'
export const ongoingStatusOptions = [
  { label: '開催中', value: 'ongoing' },
  { label: '開催予定', value: 'upcoming' },
] satisfies { label: string; value: OngoingStatusType }[]
