'use cache'

import db from '@/lib/firestore'
import { Exhibition, RawExhibition } from '@/schema/exhibition'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'
import { Museum, RawMuseum } from '@/schema/museum'
import { FavoritesPagePresentation } from './favorites-page-presentation'

const now = new Date()

export default async function FavoritesPageSection() {
  const nowJst = new TZDate(now, 'Asia/Tokyo')
  const exhibitionDocumentsSnapshot = await db
    .collection('exhibition')
    .where('status', '==', 'active')
    .where('endDate', '>=', Timestamp.fromDate(new TZDate(now, 'Asia/Tokyo')))
    .orderBy('endDate')
    .get()

  const exhibitions = exhibitionDocumentsSnapshot.docs.map((doc) => {
    const data = doc.data() as RawExhibition

    const start = data.startDate?.toDate()
    const end = data.endDate?.toDate()

    const isOngoing = !!start && start <= nowJst && (!!end ? nowJst <= end : true)

    return {
      id: doc.id,
      title: data.title,
      venue: data.venue ? data.venue : '',
      startDate: data.startDate ? data.startDate.toDate().toISOString().split('T')[0] : '',
      endDate: data.endDate ? data.endDate.toDate().toISOString().split('T')[0] : '',
      officialUrl: data.officialUrl ? data.officialUrl : '',
      imageUrl: data.imageUrl ? data.imageUrl : '',
      status: data.status,
      isOngoing,
    } satisfies Exhibition
  })

  const museumDocumentsSnapshot = await db.collection('museum').get()
  const museums = museumDocumentsSnapshot.docs
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
      } satisfies Museum
    })
    .filter((museum) => museum.exhibitions.length > 0)

  return <FavoritesPagePresentation museums={museums} />
}
