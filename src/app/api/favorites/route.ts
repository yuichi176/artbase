import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/verify-token'
import { db } from '@/lib/firebase-admin'
import { userSchema, type RawUser, type RawFavoriteVenueItem } from '@/schema/user'
import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'
import { convertRawUserToUser } from '@/app/api/utils'

// Request body schema
const toggleFavoriteSchema = z.object({
  venueName: z.string(),
})

/**
 * POST /api/favorites
 * Toggle favorite venue (add or remove)
 */
export async function POST(request: Request) {
  try {
    // Verify Firebase ID token
    const decodedToken = await verifyAuthToken(request)
    const { uid } = decodedToken

    // Parse and validate request body
    const body = await request.json()
    const { venueName } = toggleFavoriteSchema.parse(body)

    // Get user document from Firestore
    const userRef = db.collection('users').doc(uid)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rawUser = userDoc.data() as RawUser
    const currentFavorites = rawUser.preferences.favoriteVenues
    const subscriptionTier = rawUser.subscriptionTier

    // Check if venue is already favorited
    const favoriteIndex = currentFavorites.findIndex((item) => item.name === venueName)
    const isFavorited = favoriteIndex !== -1

    let updatedFavorites: RawFavoriteVenueItem[]

    if (isFavorited) {
      // Remove from favorites
      updatedFavorites = currentFavorites.filter((item) => item.name !== venueName)
    } else {
      // Check plan limits before adding
      const maxFavorites = subscriptionTier === 'free' ? 1 : Infinity

      if (currentFavorites.length >= maxFavorites) {
        return NextResponse.json(
          {
            error: 'Favorite limit exceeded',
            message: 'Freeプランでは1つまでお気に入りに追加できます。',
          },
          { status: 403 },
        )
      }

      // Add to favorites
      const newFavorite: RawFavoriteVenueItem = {
        name: venueName,
        addedAt: Timestamp.now(),
      }
      updatedFavorites = [...currentFavorites, newFavorite]
    }

    // Update Firestore document
    const updateTimestamp = Timestamp.now()
    await userRef.update({
      'preferences.favoriteVenues': updatedFavorites,
      updatedAt: updateTimestamp,
    })

    const updatedRawUser: RawUser = {
      ...rawUser,
      preferences: {
        ...rawUser.preferences,
        favoriteVenues: updatedFavorites,
      },
      updatedAt: updateTimestamp,
    }
    const updatedUser = convertRawUserToUser(updatedRawUser)

    // Validate with Zod
    const validatedUser = userSchema.parse(updatedUser)

    return NextResponse.json(validatedUser)
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
