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
})
export type Exhibition = z.infer<typeof exhibitionSchema>

export type Museum = {
  name: string
  exhibitions: Exhibition[]
}
