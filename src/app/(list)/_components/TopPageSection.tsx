import db from '@/lib/firestore'
import { Exhibition, RawExhibition } from '@/schema/exhibition'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'
import { Museum, RawMuseum } from '@/schema/museum'
import { TopPagePresentation } from '@/app/(list)/_components/TopPagePresentation'

const now = new Date()

export default async function TopPageSection() {
  const exhibitionCollectionRef = db.collection('exhibition')
  const exhibitionDocumentsSnapshot = await exhibitionCollectionRef
    .where('status', '==', 'active')
    .where('endDate', '>=', Timestamp.fromDate(new TZDate(now, 'Asia/Tokyo')))
    .orderBy('status')
    .orderBy('endDate')
    .get()
  const exhibitions = exhibitionDocumentsSnapshot.docs.map((doc) => {
    const data = doc.data() as RawExhibition

    return {
      id: doc.id,
      title: data.title,
      venue: data.venue ? data.venue : '',
      startDate: data.startDate ? data.startDate.toDate().toISOString().split('T')[0] : '',
      endDate: data.endDate ? data.endDate.toDate().toISOString().split('T')[0] : '',
      officialUrl: data.officialUrl ? data.officialUrl : '',
      imageUrl: data.imageUrl ? data.imageUrl : '',
      status: data.status,
    } satisfies Exhibition
  })

  const museumCollectionRef = db.collection('museum')
  const museumDocumentsSnapshot = await museumCollectionRef.get()
  const museums = museumDocumentsSnapshot.docs.map((doc) => {
    const data = doc.data() as RawMuseum
    const relatedExhibitions = exhibitions.filter((exhibition) => exhibition.venue === data.name)

    return {
      name: data.name,
      address: data.address,
      access: data.access,
      openingInformation: data.openingInformation,
      officialUrl: data.officialUrl,
      exhibitions: relatedExhibitions,
    } satisfies Museum
  })

  return <TopPagePresentation museums={museums} />
}
