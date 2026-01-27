import { Timestamp } from '@google-cloud/firestore'

export type RawBookmark = {
  userId: string
  exhibitionId: string
  createdAt: Timestamp
}
