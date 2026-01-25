import { Calendar, ExternalLink, MapPin } from 'lucide-react'
import { Museum } from '@/schema/museum'
import { Badge } from '@/components/shadcn-ui/badge'
import { MuseumAccess } from '@/app/tokyo/exhibitions/_components/museum-access'
import { FavoriteButton } from '@/app/tokyo/exhibitions/_components/favorite-button'

interface MuseumCardProps {
  museum: Museum
  isFavorite: boolean
}

export default function MuseumCard({ museum, isFavorite }: MuseumCardProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      <div className="bg-muted/65 border-b-1 border-border py-2 px-3 md:py-3 md:px-5 flex flex-col gap-2 md:gap-3">
        <div className="flex justify-between gap-2 items-start">
          <div className="flex gap-2 items-start">
            <a
              href={museum.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors"
              title="会場公式ページ"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              <h2 className="text-sm md:text-base">{museum.name}</h2>
            </a>
            <Badge variant="outline" className="rounded-lg text-[0.625rem] px-2">
              {museum.venueType}
            </Badge>
          </div>
          <FavoriteButton venueName={museum.name} isFavorite={isFavorite} />
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
          <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
          <span className="leading-relaxed">{museum.area}</span>
        </div>

        <MuseumAccess museumName={museum.name} access={museum.access} />
      </div>

      <div className="p-2 space-y-2">
        {museum.exhibitions.map((exhibition) => {
          return (
            <div key={exhibition.id} className="border border-border rounded-lg p-3  group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {exhibition.officialUrl ? (
                    <a
                      href={exhibition.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 transition-colors mb-1 md:mb-2"
                      title="展覧会公式ページ"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      <h3 className="text-sm md:text-base">{exhibition.title}</h3>
                    </a>
                  ) : (
                    <h3 className="text-sm md:text-base mb-1 md:mb-2">{exhibition.title}</h3>
                  )}

                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                      {exhibition.startDate} ~ {exhibition.endDate}
                    </p>
                    {exhibition.isOngoing && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300 text-[0.625rem]"
                      >
                        開催中
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
