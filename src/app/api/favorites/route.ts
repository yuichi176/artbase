import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/verify-token'
import { db } from '@/lib/firebase-admin'
import { type RawUser } from '@/schema/db/user'
import { type RawFavorite } from '@/schema/db/favorite'
import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'

// Request body schema
const toggleFavoriteSchema = z.object({
  museumId: z.string(),
})

/**
 * POST /api/favorites
 * Toggle favorite museum (add or remove)
 */
export async function POST(request: Request) {
  try {
    // Verify Firebase ID token
    const decodedToken = await verifyAuthToken(request)
    const { uid } = decodedToken

    // Parse and validate request body
    const body = await request.json()
    const { museumId } = toggleFavoriteSchema.parse(body)

    // Get user document from Firestore
    const userRef = db.collection('users').doc(uid)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rawUser = userDoc.data() as RawUser
    const subscriptionTier = rawUser.subscriptionTier

    // Validate that museum exists
    const museumRef = db.collection('museum').doc(museumId)
    const museumDoc = await museumRef.get()

    if (!museumDoc.exists) {
      return NextResponse.json(
        {
          error: 'Museum not found',
          message: '指定された会場が見つかりません。',
        },
        { status: 404 },
      )
    }

    // Use composite ID for favorite document
    const favoriteId = `${uid}_${museumId}`
    const favoriteRef = db.collection('favorites').doc(favoriteId)

    // Use transaction to handle race conditions
    try {
      const result = await db.runTransaction(async (transaction) => {
        const favoriteDoc = await transaction.get(favoriteRef)

        if (favoriteDoc.exists) {
          // Remove favorite
          transaction.delete(favoriteRef)
          return { favorited: false }
        } else {
          // Check plan limits before adding (for free users only)
          if (subscriptionTier === 'free') {
            // Query existing favorites within transaction to prevent race conditions
            const favoritesSnapshot = await transaction.get(
              db.collection('favorites').where('userId', '==', uid),
            )

            if (favoritesSnapshot.size >= 1) {
              throw new Error('LIMIT_EXCEEDED')
            }
          }

          // Add favorite
          const newFavorite: RawFavorite = {
            userId: uid,
            museumId,
            createdAt: Timestamp.now(),
          }
          transaction.set(favoriteRef, newFavorite)
          return { favorited: true }
        }
      })

      return NextResponse.json(result)
    } catch (error) {
      if (error instanceof Error && error.message === 'LIMIT_EXCEEDED') {
        return NextResponse.json(
          {
            error: 'Favorite limit exceeded',
            message: 'Freeプランでは1つまでお気に入りに追加できます。',
          },
          { status: 403 },
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Error in POST /api/favorites:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 },
      )
    }

    if (error instanceof Error) {
      if (error.message.includes('token')) {
        return NextResponse.json({ error: 'Unauthorized', message: error.message }, { status: 401 })
      }
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/favorites
 * Get all favorite museums for the authenticated user
 */
export async function GET(request: Request) {
  try {
    // Verify Firebase ID token
    const decodedToken = await verifyAuthToken(request)
    const { uid } = decodedToken

    // Get all favorites for this user
    const favoritesSnapshot = await db
      .collection('favorites')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get()

    const museumIds = favoritesSnapshot.docs.map((doc) => {
      const data = doc.data() as RawFavorite
      return data.museumId
    })

    return NextResponse.json({ museumIds })
  } catch (error) {
    console.error('Error in GET /api/favorites:', error)

    if (error instanceof Error) {
      if (error.message.includes('token')) {
        return NextResponse.json({ error: 'Unauthorized', message: error.message }, { status: 401 })
      }
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
