'use cache'

import db from '@/lib/firestore'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'
import { Exhibition } from '@/schema/ui/exhibition'
import { RawExhibition } from '@/schema/db/exhibition'
import { RawMuseum } from '@/schema/db/museum'
import { Museum } from '@/schema/ui/museum'

export async function getMuseumsWithCache(): Promise<Museum[]> {
  const now = new Date()
  const nowJst = new TZDate(now, 'Asia/Tokyo')

  const exhibitionDocumentsSnapshot = await db
    .collection('exhibition')
    .where('status', '==', 'active')
    .where('endDate', '>=', Timestamp.fromDate(new TZDate(now, 'Asia/Tokyo')))
    .orderBy('endDate')
    .get()

  const exhibitions: Exhibition[] = exhibitionDocumentsSnapshot.docs.map((doc) => {
    const data = doc.data() as RawExhibition

    const start = data.startDate?.toDate()
    const end = data.endDate?.toDate()

    // Determine ongoing status
    let ongoingStatus: 'ongoing' | 'upcoming' | 'end' = 'end'
    if (start && end) {
      if (nowJst < start) {
        ongoingStatus = 'upcoming'
      } else if (nowJst >= start && nowJst <= end) {
        ongoingStatus = 'ongoing'
      } else {
        ongoingStatus = 'end'
      }
    }

    return {
      id: doc.id,
      title: data.title,
      venue: data.venue ?? '',
      startDate: data.startDate ? data.startDate.toDate().toISOString().split('T')[0] : '',
      endDate: data.endDate ? data.endDate.toDate().toISOString().split('T')[0] : '',
      officialUrl: data.officialUrl ?? '',
      imageUrl: data.imageUrl ?? '',
      status: data.status,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
      ongoingStatus,
    }
  })

  const museumDocumentsSnapshot = await db.collection('museum').get()
  const museums: Museum[] = museumDocumentsSnapshot.docs
    .map((doc) => {
      const data = doc.data() as RawMuseum
      const relatedExhibitions = exhibitions.filter((exhibition) => exhibition.venue === data.name)

      return {
        id: doc.id,
        name: data.name,
        address: data.address,
        access: data.access,
        openingInformation: data.openingInformation,
        officialUrl: data.officialUrl,
        venueType: data.venueType,
        area: data.area,
        exhibitions: relatedExhibitions,
      }
    })
    .filter((museum) => museum.exhibitions.length > 0)
    .sort((a, b) => {
      // Get the latest createdAt from each museum's exhibitions
      const latestCreatedAtA = Math.max(
        ...a.exhibitions.map((ex) => new Date(ex.createdAt).getTime()),
      )
      const latestCreatedAtB = Math.max(
        ...b.exhibitions.map((ex) => new Date(ex.createdAt).getTime()),
      )

      // Sort by latest createdAt (descending - newest first)
      return latestCreatedAtB - latestCreatedAtA
    })

  return museums
}
