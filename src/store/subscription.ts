import { atom } from 'jotai'
import { userAtom } from './auth'
import { isProUser } from '@/schema/user'
import type { SubscriptionStatus, SubscriptionTier, UserFavorite } from '@/schema/user'

/**
 * Subscription status
 * Derived from user data
 */
export const subscriptionStatusAtom = atom<SubscriptionStatus>((get) => {
  const user = get(userAtom)
  return user?.subscriptionStatus ?? 'free'
})

/**
 * Subscription tier
 * Derived from user data
 */
export const subscriptionTierAtom = atom<SubscriptionTier>((get) => {
  const user = get(userAtom)
  return user?.subscriptionTier ?? 'free'
})

/**
 * Computed atom: is user a Pro subscriber
 * Checks both tier and subscription status/expiry
 */
export const isProAtom = atom((get) => {
  const user = get(userAtom)
  if (!user) return false
  return isProUser(user)
})

/**
 * Current subscription period end date (ISO string)
 * null if not subscribed or no end date
 */
export const subscriptionEndDateAtom = atom<string | null>((get) => {
  const user = get(userAtom)
  return user?.currentPeriodEnd ?? null
})

/**
 * User favorites (Pro feature)
 */
export const favoritesAtom = atom<UserFavorite[]>([])

/**
 * Favorites loading state
 */
export const favoritesLoadingAtom = atom<boolean>(false)

/**
 * Set of favorited exhibition IDs for quick lookup
 */
export const favoritedExhibitionIdsAtom = atom((get) => {
  const favorites = get(favoritesAtom)
  return new Set(favorites.map((fav) => fav.exhibitionId))
})

/**
 * Check if an exhibition is favorited
 */
export const isFavoritedAtom = (exhibitionId: string) =>
  atom((get) => {
    const favoritedIds = get(favoritedExhibitionIdsAtom)
    return favoritedIds.has(exhibitionId)
  })
