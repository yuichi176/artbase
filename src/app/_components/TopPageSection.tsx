import { Badge } from '@/components/ui/badge'
import { CalendarDays } from 'lucide-react'
import db from '@/lib/firestore'
import { Exhibition, Museum, RawExhibition } from '@/schema/exhibition'
import { Timestamp } from '@google-cloud/firestore'
import { TZDate } from '@date-fns/tz'

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
        <section className="px-5" key={museum.name}>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-bold">{museum.name}</h2>
            <Badge>{`${museum.exhibitions.length}件`}</Badge>
          </div>
          <ul
            className="grid grid-cols-3 gap-5"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, 280px);',
            }}
          >
            {museum.exhibitions.map((exhibition) => (
              <li
                key={exhibition.id}
                className="row-span-3 grid grid-cols-subgrid gap-3 relative border-1 rounded-md py-3 w-full"
              >
                <div className="w-full h-[282px] rounded-t-md">
                  <img
                    src={exhibition.imageUrl}
                    alt={`${exhibition.title}のポスター画像`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col justify-between px-3">
                  <a href={exhibition.officialUrl} target="_blank" rel="noopener noreferrer">
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                      }}
                    />
                    <h3 className="text-sm font-semibold line-clamp-3">{exhibition.title}</h3>
                  </a>
                </div>
                <div className="text-xs text-gray-600 flex gap-2 items-center px-3">
                  <CalendarDays size={15} />
                  <p>
                    {exhibition.startDate} 〜 {exhibition.endDate}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
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
    exhibitions,
  }))
}
