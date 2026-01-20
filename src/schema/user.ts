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

// Favorite exhibition type
export type RawUserFavorite = {
  id: string
  userId: string
  exhibitionId: string
  addedAt: Timestamp
  // Denormalized for display
  exhibitionTitle: string
  venue: string
  endDate: Timestamp
}

export const userFavoriteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  exhibitionId: z.string(),
  addedAt: z.string(), // ISO date string
  // Denormalized for display
  exhibitionTitle: z.string(),
  venue: z.string(),
  endDate: z.string(), // ISO date string
})
export type UserFavorite = z.infer<typeof userFavoriteSchema>

// Stripe webhook event tracking
export type RawStripeWebhookEvent = {
  eventId: string
  type: string
  processed: boolean
  processedAt: Timestamp | null
  error: string | null
  createdAt: Timestamp
}

export const stripeWebhookEventSchema = z.object({
  eventId: z.string(),
  type: z.string(),
  processed: z.boolean(),
  processedAt: z.string().nullable(),
  error: z.string().nullable(),
  createdAt: z.string(),
})
export type StripeWebhookEvent = z.infer<typeof stripeWebhookEventSchema>

// Helper function to check if user is Pro
export function isProUser(user: User): boolean {
  if (user.subscriptionTier !== 'pro') {
    return false
  }

  if (user.subscriptionStatus !== 'active') {
    return false
  }

  // Check if subscription has expired
  if (user.currentPeriodEnd) {
    const endDate = new Date(user.currentPeriodEnd)
    return endDate > new Date()
  }

  return false
}
