import { NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/verify-token'
import { db } from '@/lib/firebase-admin'
import { type RawUser } from '@/schema/user'
import { type RawBookmark } from '@/schema/bookmark'
import { type RawExhibition, type Exhibition } from '@/schema/exhibition'
import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'
import { TZDate } from '@date-fns/tz'
import { FieldPath } from 'firebase-admin/firestore'

// Request body schema
const toggleBookmarkSchema = z.object({
  exhibitionId: z.string(),
})

/**
 * Get exhibitions by their IDs
 * Handles Firestore's 'in' query limit of 30 items by chunking
 */
async function getExhibitionsByIds(exhibitionIds: string[]): Promise<Exhibition[]> {
  if (exhibitionIds.length === 0) {
    return []
  }

  const tz = 'Asia/Tokyo'
  const now = new TZDate(new Date(), tz)

  // Firestore 'in' query supports max 30 items
  const CHUNK_SIZE = 30
  const chunks: string[][] = []

  for (let i = 0; i < exhibitionIds.length; i += CHUNK_SIZE) {
    chunks.push(exhibitionIds.slice(i, i + CHUNK_SIZE))
  }

  // Fetch all chunks in parallel
  const chunkResults = await Promise.all(
    chunks.map(async (chunk) => {
      const snapshot = await db
        .collection('exhibition')
        .where(FieldPath.documentId(), 'in', chunk)
        .get()

      return snapshot.docs.map((doc) => {
        const data = doc.data() as RawExhibition
        const startDate = data.startDate ? new TZDate(data.startDate.toDate(), tz) : null
        const endDate = data.endDate ? new TZDate(data.endDate.toDate(), tz) : null

        // Format dates as YYYY-MM-DD
        const formatDate = (date: TZDate): string => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }

        const isOngoing = startDate && endDate ? now >= startDate && now <= endDate : false

        return {
          id: doc.id,
          title: data.title,
          venue: data.venue ?? '',
          startDate: startDate ? formatDate(startDate) : '',
          endDate: endDate ? formatDate(endDate) : '',
          officialUrl: data.officialUrl ?? '',
          imageUrl: data.imageUrl ?? '',
          status: data.status,
          isOngoing,
        }
      })
    }),
  )

  // Flatten results
  return chunkResults.flat()
}

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
 * Get all bookmarks with exhibition details for the authenticated user
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

    // Fetch exhibition details
    const exhibitions = await getExhibitionsByIds(exhibitionIds)

    return NextResponse.json({ exhibitions })
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
