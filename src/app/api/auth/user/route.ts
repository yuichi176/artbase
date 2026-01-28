import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/verify-token'
import { db, auth as adminAuth } from '@/lib/firebase-admin'
import { userSchema } from '@/schema/ui/user'
import { Timestamp } from 'firebase-admin/firestore'
import { convertRawUserToUser } from '@/app/api/utils'
import { RawUser } from '@/schema/db/user'

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
      subscriptionTier: 'free',
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

/**
 * PATCH /api/auth/user
 * Update user profile (displayName)
 */
export async function PATCH(request: Request) {
  try {
    // Verify Firebase ID token
    const decodedToken = await verifyAuthToken(request)
    const { uid } = decodedToken

    // Parse request body
    const body = await request.json()
    const { displayName } = body

    // Get current user document
    const userRef = db.collection('users').doc(uid)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rawUser = userDoc.data() as RawUser

    // Prepare update data for Firestore
    const updates: Partial<RawUser> = {
      updatedAt: Timestamp.now(),
    }

    // Update displayName if provided
    if (displayName !== undefined) {
      updates.displayName = displayName
    }

    // Update Firestore document
    await userRef.update(updates)

    // Update local rawUser object instead of refetching from Firestore
    const updatedRawUser: RawUser = {
      ...rawUser,
      ...updates,
    }
    const user = convertRawUserToUser(updatedRawUser)

    // Validate with Zod
    const validatedUser = userSchema.parse(user)

    return NextResponse.json(validatedUser)
  } catch (error) {
    console.error('Error in PATCH /api/auth/user:', error)

    if (error instanceof Error) {
      if (error.message.includes('token')) {
        return NextResponse.json({ error: 'Unauthorized', message: error.message }, { status: 401 })
      }
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
