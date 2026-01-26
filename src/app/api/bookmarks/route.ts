import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/verify-token'
import { db } from '@/lib/firebase-admin'
import { type RawUser } from '@/schema/user'
import { type RawBookmark } from '@/schema/bookmark'
import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'

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

    // Use composite ID for bookmark document
    const bookmarkId = `${uid}_${exhibitionId}`
    const bookmarkRef = db.collection('bookmarks').doc(bookmarkId)
    const bookmarkDoc = await bookmarkRef.get()

    if (bookmarkDoc.exists) {
      // Remove bookmark
      await bookmarkRef.delete()
      return NextResponse.json({ bookmarked: false })
    } else {
      // Add bookmark
      const newBookmark: RawBookmark = {
        userId: uid,
        exhibitionId,
        createdAt: Timestamp.now(),
      }
      await bookmarkRef.set(newBookmark)
      return NextResponse.json({ bookmarked: true })
    }
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

/**
 * GET /api/bookmarks
 * Get all bookmarks for the authenticated user
 */
export async function GET(request: Request) {
  try {
    // Verify Firebase ID token
    const decodedToken = await verifyAuthToken(request)
    const { uid } = decodedToken

    // Get user document from Firestore
    const userRef = db.collection('users').doc(uid)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rawUser = userDoc.data() as RawUser

    // Check if user has Pro plan
    if (rawUser.subscriptionTier !== 'pro') {
      return NextResponse.json({ error: 'Pro plan required' }, { status: 403 })
    }

    // Get all bookmarks for this user
    const bookmarksSnapshot = await db
      .collection('bookmarks')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get()

    const exhibitionIds = bookmarksSnapshot.docs.map((doc) => {
      const data = doc.data() as RawBookmark
      return data.exhibitionId
    })

    return NextResponse.json({ exhibitionIds })
  } catch (error) {
    console.error('Error in GET /api/bookmarks:', error)

    if (error instanceof Error) {
      if (error.message.includes('token')) {
        return NextResponse.json({ error: 'Unauthorized', message: error.message }, { status: 401 })
      }
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
