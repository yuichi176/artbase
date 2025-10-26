import db from '@/lib/firestore'
import { Exhibition, Museum, RawExhibition } from '@/schema/exhibition'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'
import MuseumCard from '@/app/_components/MuseumCard'

const now = new Date()

export default async function TopPageSection() {
  const exhibitionCollectionRef = db.collection('exhibition')
  const existingDocumentsSnapshot = await exhibitionCollectionRef
    .where('status', '==', 'active')
    .where('endDate', '>=', Timestamp.fromDate(new TZDate(now, 'Asia/Tokyo')))
    .orderBy('status')
    .orderBy('endDate')
    .get()

  const exhibitions = existingDocumentsSnapshot.docs.map((doc) => {
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

  const museums = convertToMuseum(exhibitions)

  return (
    <div className="flex flex-col gap-8">
      {museums.map((museum) => (
        <MuseumCard key={museum.name} museum={museum} />
      ))}
    </div>
  )
}

const convertToMuseum = (exhibitions: Exhibition[]): Museum[] => {
  const museumMap = new Map<string, Exhibition[]>()

  exhibitions.forEach((exhibition) => {
    const venue = exhibition.venue
    if (!museumMap.has(venue)) {
      museumMap.set(venue, [])
    }
    museumMap.get(venue)!.push(exhibition)
  })

  return Array.from(museumMap.entries()).map(([name, exhibitions]) => ({
    name,
    address: '東京都港区六本木7-22-2',
    access:
      '東京メトロ千代田線乃木坂駅6番出口より直結、東京メトロ日比谷線・都営大江戸線六本木駅7番出口より徒歩4分',
    openingInformation: '10:00 ~ 18:00・金曜日、土曜日は20:00まで・火曜休館',
    officialUrl: 'https://www.nact.jp/',
    exhibitions,
  }))
}
