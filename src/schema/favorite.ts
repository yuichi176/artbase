import { z } from 'zod'
import { Timestamp } from '@google-cloud/firestore'

// Raw favorite type from Firestore (with Timestamp)
export type RawFavorite = {
  userId: string
  museumId: string
  createdAt: Timestamp
}

// Application favorite type (with ISO date string)
export const favoriteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  museumId: z.string(),
  createdAt: z.string(),
})
export type Favorite = z.infer<typeof favoriteSchema>
