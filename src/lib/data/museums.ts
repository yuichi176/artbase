'use cache'

import db from '@/lib/firestore'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'
import { Exhibition, RawExhibition } from '@/schema/exhibition'
import { Museum, RawMuseum } from '@/schema/museum'

export async function getMuseumsWithCache(now: Date) {
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

    const isOngoing = !!start && start <= nowJst && (!!end ? nowJst <= end : true)

    return {
      id: doc.id,
      title: data.title,
      venue: data.venue ?? '',
      startDate: data.startDate ? data.startDate.toDate().toISOString().split('T')[0] : '',
      endDate: data.endDate ? data.endDate.toDate().toISOString().split('T')[0] : '',
      officialUrl: data.officialUrl ?? '',
      imageUrl: data.imageUrl ?? '',
      status: data.status,
      isOngoing,
    }
  })

  const museumDocumentsSnapshot = await db.collection('museum').get()
  const museums: Museum[] = museumDocumentsSnapshot.docs
    .map((doc) => {
      const data = doc.data() as RawMuseum
      const relatedExhibitions = exhibitions.filter((exhibition) => exhibition.venue === data.name)

      return {
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

  return museums
}

/**
 * Get all museums with exhibitions (including past exhibitions)
 * Used for bookmarks page to show all bookmarked exhibitions
 */
export async function getAllMuseumsWithCache(now: Date) {
  const nowJst = new TZDate(now, 'Asia/Tokyo')

  const exhibitionDocumentsSnapshot = await db
    .collection('exhibition')
    .where('status', '==', 'active')
    .orderBy('endDate', 'desc')
    .get()

  const exhibitions: Exhibition[] = exhibitionDocumentsSnapshot.docs
    .map((doc) => {
      const data = doc.data() as RawExhibition

      if (!data.startDate || !data.endDate) {
        return null
      }

      const start = data.startDate?.toDate()
      const end = data.endDate?.toDate()

      const isOngoing = !!start && start <= nowJst && (!!end ? nowJst <= end : true)

      return {
        id: doc.id,
        title: data.title,
        venue: data.venue ?? '',
        startDate: data.startDate ? data.startDate.toDate().toISOString().split('T')[0] : '',
        endDate: data.endDate ? data.endDate.toDate().toISOString().split('T')[0] : '',
        officialUrl: data.officialUrl ?? '',
        imageUrl: data.imageUrl ?? '',
        status: data.status,
        isOngoing,
      }
    })
    .filter((exhibition) => exhibition !== null)

  const museumDocumentsSnapshot = await db.collection('museum').get()
  const museums: Museum[] = museumDocumentsSnapshot.docs
    .map((doc) => {
      const data = doc.data() as RawMuseum
      const relatedExhibitions = exhibitions.filter((exhibition) => exhibition.venue === data.name)

      return {
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

  return museums
}
