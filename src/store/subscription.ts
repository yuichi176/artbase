import { atom } from 'jotai'
import { userAtom } from './auth'
import type { SubscriptionTier } from '@/schema/db/user'

/**
 * Subscription tier
 * Derived from user data
 */
export const subscriptionTierAtom = atom<SubscriptionTier>((get) => {
  const user = get(userAtom)
  return user?.subscriptionTier ?? 'free'
})
