import { CalendarDays, SquareArrowOutUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Museum } from '@/schema/museum'

interface MuseumCardProps {
  museum: Museum
}

export default function MuseumCard({ museum }: MuseumCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-2">
          <a
            className="flex items-center gap-3 hover:underline"
            href={museum.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-lg">{museum.name}</span>
            <SquareArrowOutUpRight size={18} />
          </a>
        </CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <p>
            <span className="font-bold">住所：</span>
            {museum.address}
          </p>
          <p>
            <span className="font-bold">開館情報：</span>
            {museum.openingInformation}
          </p>
          <p>
            <span className="font-bold">アクセス：</span>
            {museum.access}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="border-gray-200 px-0 mx-5">
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
