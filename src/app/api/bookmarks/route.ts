import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/verify-token'
import { db } from '@/lib/firebase-admin'
import { userSchema, type RawUser, type RawBookmarkedExhibitionItem } from '@/schema/user'
import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'
import { convertRawUserToUser } from '@/app/api/utils'

// Request body schema
const toggleBookmarkSchema = z.object({
  exhibitionId: z.string(),
})

/**
 * POST /api/bookmarks
 * Toggle bookmarked exhibition (add or remove)
 * Pro plan only
 */
export async function POST(request: Request) {
  try {
    // Verify Firebase ID token
    const decodedToken = await verifyAuthToken(request)
    const { uid } = decodedToken

    // Parse and validate request body
    const body = await request.json()
    const { exhibitionId } = toggleBookmarkSchema.parse(body)

    // Get user document from Firestore
    const userRef = db.collection('users').doc(uid)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rawUser = userDoc.data() as RawUser
    const currentBookmarks = rawUser.preferences.bookmarkedExhibitions ?? []
    const subscriptionTier = rawUser.subscriptionTier

    // Check if user has Pro plan
    if (subscriptionTier !== 'pro') {
      return NextResponse.json(
        {
          error: 'Pro plan required',
          message: 'ブックマーク機能はProプラン限定です。',
        },
        { status: 403 },
      )
    }

    // Check if exhibition is already bookmarked
    const bookmarkIndex = currentBookmarks.findIndex((item) => item.exhibitionId === exhibitionId)
    const isBookmarked = bookmarkIndex !== -1

    let updatedBookmarks: RawBookmarkedExhibitionItem[]

    if (isBookmarked) {
      // Remove from bookmarks
      updatedBookmarks = currentBookmarks.filter((item) => item.exhibitionId !== exhibitionId)
    } else {
      // Add to bookmarks
      const newBookmark: RawBookmarkedExhibitionItem = {
        exhibitionId,
        addedAt: Timestamp.now(),
      }
      updatedBookmarks = [...currentBookmarks, newBookmark]
    }

    // Update Firestore document
    const updateTimestamp = Timestamp.now()
    await userRef.update({
      'preferences.bookmarkedExhibitions': updatedBookmarks,
      updatedAt: updateTimestamp,
    })

    const updatedRawUser: RawUser = {
      ...rawUser,
      preferences: {
        ...rawUser.preferences,
        bookmarkedExhibitions: updatedBookmarks,
      },
      updatedAt: updateTimestamp,
    }
    const updatedUser = convertRawUserToUser(updatedRawUser)

    // Validate with Zod
    const validatedUser = userSchema.parse(updatedUser)

    return NextResponse.json(validatedUser)
  } catch (error) {
    console.error('Error in POST /api/bookmarks:', error)

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
