import { z } from 'zod'
import { Timestamp } from '@google-cloud/firestore'

const subscriptionStatusSchema = z.enum(['free', 'active', 'canceled', 'past_due'])
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>

const subscriptionTierSchema = z.enum(['free', 'pro'])
export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>

// Favorite venue item (application type with ISO date string)
export type FavoriteVenueItem = {
  name: string
  addedAt: string
}

// Raw favorite venue item from Firestore (with Timestamp)
export type RawFavoriteVenueItem = {
  name: string
  addedAt: Timestamp
}

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
    favoriteVenues: RawFavoriteVenueItem[]
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Favorite venue item schema
export const favoriteVenueItemSchema = z.object({
  name: z.string(),
  addedAt: z.string(),
})

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
    favoriteVenues: z.array(favoriteVenueItemSchema),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type User = z.infer<typeof userSchema>
