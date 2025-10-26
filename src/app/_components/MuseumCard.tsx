import { Museum } from '@/schema/exhibition'
import { CalendarDays, SquareArrowOutUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface MuseumCardProps {
  museum: Museum
}

export default function MuseumCard({ museum }: MuseumCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 mb-2">
          <span className="text-lg">{museum.name}</span>
          <SquareArrowOutUpRight size={18} />
        </CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <p>
            <span className="font-bold">住所：</span>東京都港区六本木7-22-2
          </p>
          <p>
            <span className="font-bold">開館情報：</span>
            10:00 ~ 18:00・金曜日、土曜日は20:00まで・火曜休館
          </p>
          <p>
            <span className="font-bold">アクセス：</span>
            東京メトロ千代田線乃木坂駅6番出口より直結、東京メトロ日比谷線・都営大江戸線六本木駅7番出口より徒歩4分
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="border-t border-gray-200 pt-5 px-0 mx-5">
        <ul
          className="grid grid-cols-3 gap-5"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, 250px);',
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
              <div className="text-sm text-gray-600 flex gap-2 items-center px-3">
                <CalendarDays size={15} />
                <p>
                  {exhibition.startDate} 〜 {exhibition.endDate}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
