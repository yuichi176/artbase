import { Calendar, ExternalLink, Train } from 'lucide-react'
import { Museum } from '@/schema/museum'
import { Badge } from '@/components/shadcn-ui/badge'

interface MuseumCardProps {
  museum: Museum
}

export default function MuseumCard({ museum }: MuseumCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 border-b-1 border-gray-200 py-3 px-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-gray-900">{museum.name}</h2>
            <Badge variant="outline" className="px-3 py-1 rounded-full text-gray-800">
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
            <ExternalLink className="w-4.5 h-4.5" />
          </a>
        </div>

        <div className="text-sm text-gray-500 flex items-center">
          <div className="flex items-center gap-1">
            <Train className="w-4 h-4 mt-0.5" />
            <span>アクセス：</span>
          </div>
          <p>{museum.access}</p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {museum.exhibitions.map((exhibition) => {
          return (
            <div key={exhibition.id} className="py-3 px-5 hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <h3 className="text-gray-900 truncate">{exhibition.title}</h3>
                    {exhibition.isOngoing && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 border-emerald-200 text-emerald-700"
                      >
                        開催中
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                      {exhibition.startDate} ~ {exhibition.endDate}
                    </p>
                  </div>
                </div>
                <a
                  href={exhibition.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex-shrink-0 transition-colors"
                  title="展覧会公式ページ"
                >
                  <ExternalLink className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
