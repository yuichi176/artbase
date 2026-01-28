import { z } from 'zod'
import { Timestamp } from '@google-cloud/firestore'

export const subscriptionTierSchema = z.enum(['free', 'pro'])
export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>

export type RawUser = {
  uid: string
  email: string
  displayName: string | null
  subscriptionTier: SubscriptionTier
  createdAt: Timestamp
  updatedAt: Timestamp
}
