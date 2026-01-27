import { Timestamp } from '@google-cloud/firestore'

export type RawFavorite = {
  userId: string
  museumId: string
  createdAt: Timestamp
}
