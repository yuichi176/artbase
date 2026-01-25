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

// Bookmarked exhibition item (application type with ISO date string)
export type BookmarkedExhibitionItem = {
  exhibitionId: string
  addedAt: string
}

// Raw bookmarked exhibition item from Firestore (with Timestamp)
export type RawBookmarkedExhibitionItem = {
  exhibitionId: string
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
    bookmarkedExhibitions: RawBookmarkedExhibitionItem[]
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Favorite venue item schema
export const favoriteVenueItemSchema = z.object({
  name: z.string(),
  addedAt: z.string(),
})

// Bookmarked exhibition item schema
export const bookmarkedExhibitionItemSchema = z.object({
  exhibitionId: z.string(),
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
    bookmarkedExhibitions: z.array(bookmarkedExhibitionItemSchema),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type User = z.infer<typeof userSchema>
