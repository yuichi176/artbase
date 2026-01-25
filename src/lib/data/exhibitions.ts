import db from '@/lib/firestore'
import { type Exhibition, type RawExhibition } from '@/schema/exhibition'
import { TZDate } from '@date-fns/tz'
import { FieldPath } from '@google-cloud/firestore'

/**
 * Get exhibitions by their IDs
 * Handles Firestore's 'in' query limit of 30 items by chunking
 */
export async function getExhibitionsByIds(exhibitionIds: string[]): Promise<Exhibition[]> {
  if (exhibitionIds.length === 0) {
    return []
  }

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
        .collection('exhibitions')
        .where(FieldPath.documentId(), 'in', chunk)
        .get()

      return snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
        const data = doc.data() as RawExhibition
        return convertRawExhibitionToExhibition(doc.id, data)
      })
    }),
  )

  // Flatten results
  return chunkResults.flat()
}

/**
 * Convert RawExhibition (from Firestore) to Exhibition (application format)
 */
function convertRawExhibitionToExhibition(id: string, raw: RawExhibition): Exhibition {
  const tz = 'Asia/Tokyo'
  const startDate = new TZDate(raw.startDate.toDate(), tz)
  const endDate = raw.endDate ? new TZDate(raw.endDate.toDate(), tz) : startDate
  const now = new TZDate(new Date(), tz)

  // Format dates as YYYY-MM-DD
  const formatDate = (date: TZDate): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const isOngoing = now >= startDate && now <= endDate

  return {
    id,
    title: raw.title,
    venue: raw.venue,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    officialUrl: raw.officialUrl,
    imageUrl: raw.imageUrl,
    status: raw.status,
    isOngoing,
  }
}
