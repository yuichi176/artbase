import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/verify-token'
import { db, auth as adminAuth } from '@/lib/firebase-admin'
import { userSchema, type RawUser, type User } from '@/schema/user'
import { Timestamp } from 'firebase-admin/firestore'

// Convert Firestore Timestamp to ISO date string
function timestampToISOString(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString()
}

// Convert RawUser (from Firestore) to User (application format)
function convertRawUserToUser(rawUser: RawUser): User {
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
    preferences: rawUser.preferences,
    createdAt: timestampToISOString(rawUser.createdAt),
    updatedAt: timestampToISOString(rawUser.updatedAt),
  }
}

/**
 * GET /api/auth/user
 * Get or create user data from Firestore
 */
export async function GET(request: Request) {
  try {
    // Verify Firebase ID token
    const decodedToken = await verifyAuthToken(request)
    const { uid } = decodedToken

    // Get user document from Firestore
    const userRef = db.collection('users').doc(uid)
    const userDoc = await userRef.get()

    if (userDoc.exists) {
      // User exists, return data
      const rawUser = userDoc.data() as RawUser
      const user = convertRawUserToUser(rawUser)

      // Validate with Zod
      const validatedUser = userSchema.parse(user)
      return NextResponse.json(validatedUser)
    }

    // User doesn't exist, create new user document
    const firebaseUser = await adminAuth.getUser(uid)
    const now = Timestamp.now()

    const newRawUser: RawUser = {
      uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? null,
      photoURL: firebaseUser.photoURL ?? null,
      stripeCustomerId: null,
      subscriptionStatus: 'free',
      subscriptionTier: 'free',
      currentPeriodEnd: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      preferences: {
        emailNotifications: false,
        favoriteVenues: [],
      },
      createdAt: now,
      updatedAt: now,
    }

    await userRef.set(newRawUser)

    const newUser = convertRawUserToUser(newRawUser)
    const validatedNewUser = userSchema.parse(newUser)

    return NextResponse.json(validatedNewUser)
  } catch (error) {
    console.error('Error in /api/auth/user:', error)

    if (error instanceof Error) {
      if (error.message.includes('token')) {
        return NextResponse.json({ error: 'Unauthorized', message: error.message }, { status: 401 })
      }
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
