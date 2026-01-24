import { z } from 'zod'
import { Timestamp } from '@google-cloud/firestore'

const subscriptionStatusSchema = z.enum(['free', 'active', 'canceled', 'past_due'])
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>

const subscriptionTierSchema = z.enum(['free', 'pro'])
export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>

// Raw user type from Firestore (with Timestamp objects)
export type RawUser = {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  stripeCustomerId: string | null
  subscriptionStatus: SubscriptionStatus
  subscriptionTier: SubscriptionTier
  currentPeriodEnd: Timestamp | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  preferences: {
    emailNotifications: boolean
    favoriteVenues: string[]
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Application user type (with ISO date strings)
export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  photoURL: z.string().url().nullable(),
  stripeCustomerId: z.string().nullable(),
  subscriptionStatus: subscriptionStatusSchema,
  subscriptionTier: subscriptionTierSchema,
  currentPeriodEnd: z.string().nullable(),
  stripeSubscriptionId: z.string().nullable(),
  stripePriceId: z.string().nullable(),
  preferences: z.object({
    emailNotifications: z.boolean(),
    favoriteVenues: z.array(z.string()),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type User = z.infer<typeof userSchema>
