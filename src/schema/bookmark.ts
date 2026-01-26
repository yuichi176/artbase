import { z } from 'zod'
import { Timestamp } from '@google-cloud/firestore'

// Raw bookmark type from Firestore (with Timestamp)
export type RawBookmark = {
  userId: string
  exhibitionId: string
  createdAt: Timestamp
}

// Application bookmark type (with ISO date string)
export const bookmarkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  exhibitionId: z.string(),
  createdAt: z.string(),
})
export type Bookmark = z.infer<typeof bookmarkSchema>
