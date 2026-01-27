import { Timestamp } from '@google-cloud/firestore'
import { RawUser } from '@/schema/db/user'
import { User } from '@/schema/ui/user'

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
    subscriptionTier: rawUser.subscriptionTier,
    createdAt: timestampToISOString(rawUser.createdAt),
    updatedAt: timestampToISOString(rawUser.updatedAt),
  }
}
