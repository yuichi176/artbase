import { z } from 'zod'
import { Timestamp } from '@google-cloud/firestore'

const subscriptionTierSchema = z.enum(['free', 'pro'])
export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>

// Raw user type from Firestore (with Timestamp objects)
export type RawUser = {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  subscriptionTier: SubscriptionTier
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Application user type (with ISO date strings)
export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  photoURL: z.string().url().nullable(),
  subscriptionTier: subscriptionTierSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type User = z.infer<typeof userSchema>
