import { Timestamp } from '@google-cloud/firestore'
import { RawUser, User } from '@/schema/user'

// Convert Firestore Timestamp to ISO date string
function timestampToISOString(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString()
}

// Convert RawUser (from Firestore) to User (application format)
export function convertRawUserToUser(rawUser: RawUser): User {
  return {
    uid: rawUser.uid,
    email: rawUser.email,
    displayName: rawUser.displayName,
    photoURL: rawUser.photoURL,
    stripeCustomerId: rawUser.stripeCustomerId,
    subscriptionStatus: rawUser.subscriptionStatus,
    subscriptionTier: rawUser.subscriptionTier,
    currentPeriodEnd: rawUser.currentPeriodEnd
      ? timestampToISOString(rawUser.currentPeriodEnd)
      : null,
    stripeSubscriptionId: rawUser.stripeSubscriptionId,
    stripePriceId: rawUser.stripePriceId,
    preferences: {
      emailNotifications: rawUser.preferences.emailNotifications,
      favoriteVenues: rawUser.preferences.favoriteVenues.map((item) => ({
        name: item.name,
        addedAt: timestampToISOString(item.addedAt),
      })),
    },
    createdAt: timestampToISOString(rawUser.createdAt),
    updatedAt: timestampToISOString(rawUser.updatedAt),
  }
}
