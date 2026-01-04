import { Calendar, ExternalLink } from 'lucide-react'
import { Museum } from '@/schema/museum'
import { Badge } from '@/components/shadcn-ui/badge'
import { MuseumAccess } from '@/app/(list)/_components/MuseumAccess'

interface MuseumCardProps {
  museum: Museum
}

export default function MuseumCard({ museum }: MuseumCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="bg-gray-50 border-b-1 border-gray-200 py-2 px-3 md:py-3 md:px-5 flex flex-col gap-2 md:gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm md:text-base text-gray-900">{museum.name}</h2>
            <Badge
              variant="outline"
              className="py-1 rounded-full text-gray-800 text-[0.625rem] px-2"
            >
              {/*TODO: implement tag feature*/}
              美術館
            </Badge>
          </div>
          <a
            href={museum.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 flex-shrink-0 transition-colors"
            title="会場公式ページ"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <MuseumAccess museumName={museum.name} access={museum.access} />
      </div>

      <div className="divide-y divide-gray-100">
        {museum.exhibitions.map((exhibition) => {
          return (
            <div
              key={exhibition.id}
              className="px-3 py-3 md:px-5 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 text-sm md:text-base mb-1 md:mb-2">
                    {exhibition.title}
                  </h3>

                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                      {exhibition.startDate} ~ {exhibition.endDate}
                    </p>
                    {exhibition.isOngoing && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 border-emerald-200 text-emerald-700 text-[0.625rem]"
                      >
                        開催中
                      </Badge>
                    )}
                  </div>
                </div>
                <a
                  href={exhibition.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex-shrink-0 transition-colors"
                  title="展覧会公式ページ"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
