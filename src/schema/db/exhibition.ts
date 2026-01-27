import { z } from 'zod'
import { Timestamp } from '@google-cloud/firestore'

export const statusSchema = z.enum(['pending', 'active'])
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
