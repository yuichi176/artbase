'use client'

import { useMemo, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/shadcn-ui/card'
import { useRequireAuth } from '@/hooks/use-require-auth'
import { userAtom } from '@/store/auth'
import { Skeleton } from '@/components/shadcn-ui/skeleton'
import { Calendar, MapPin, ExternalLink, Bookmark } from 'lucide-react'
import { Badge } from '@/components/shadcn-ui/badge'
import { BookmarkButton } from '@/app/tokyo/exhibitions/_components/bookmark-button'
import { cn } from '@/utils/shadcn'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { TZDate } from '@date-fns/tz'

export function BookmarksPagePresentation() {
  const { loading: authLoading } = useRequireAuth('/bookmarks')
  const user = useAtomValue(userAtom)
  const router = useRouter()
  const {
    bookmarkedExhibitions: exhibitions,
    toggleBookmark,
    loading: bookmarksLoading,
  } = useBookmarks()

  // Check Pro plan and redirect if needed
  useEffect(() => {
    if (!authLoading && user && user.subscriptionTier !== 'pro') {
      router.push('/pricing')
    }
  }, [authLoading, user, router])

  // Sort exhibitions by status (ongoing > upcoming > end), then by date
  const bookmarkedExhibitions = useMemo(() => {
    const statusOrder: Record<'ongoing' | 'upcoming' | 'end', number> = {
      ongoing: 0,
      upcoming: 1,
      end: 2,
    }

    return [...exhibitions].sort((a, b) => {
      // First, sort by status
      const statusDiff = statusOrder[a.ongoingStatus] - statusOrder[b.ongoingStatus]
      if (statusDiff !== 0) return statusDiff

      // Then sort by date within each status
      // For upcoming: sort by start date (ascending - soonest to start first)
      // For ongoing and end: sort by end date (ascending - soonest to end first)
      if (a.ongoingStatus === 'upcoming') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      } else {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      }
    })
  }, [exhibitions])

  // Show loading state while checking authentication or fetching bookmarks
  if (authLoading || bookmarksLoading || !user) {
    return (
      <div className="container">
        <Skeleton className="h-8 w-64 mb-3" />
        <Skeleton className="h-8 max-w-96 mb-3" />
        <Card className="p-8 rounded-lg">
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full" />
        </Card>
      </div>
    )
  }

  // Check Pro plan after authentication is complete
  if (user.subscriptionTier !== 'pro') {
    return null // Redirect happens in useEffect
  }

  return (
    <div className="container">
      <div className="pl-1 mb-5">
        <h1 className="text-xl font-bold mb-3">ブックマーク</h1>
        <p className="text-sm text-muted-foreground">
          気になる展覧会をブックマークして管理できます。終了した展覧会は自動的に非表示になります。
        </p>
      </div>

      {bookmarkedExhibitions.length === 0 ? (
        <Card className="p-6 rounded-lg text-center gap-4">
          <p className="text-sm text-muted-foreground">まだブックマークした展覧会がありません</p>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            <span className="inline-flex items-center">
              気になる展覧会を見つけたら、
              <span aria-hidden="true" className="inline-flex items-center">
                <Bookmark className="w-3 h-3" />
              </span>
            </span>
            ボタンでブックマークしておきましょう。
          </p>
        </Card>
      ) : (
        <Card className="p-2 md:p-4 rounded-lg gap-0 bg-background">
          <p className="text-sm pl-1 mb-3">{bookmarkedExhibitions.length}件の展覧会</p>
          <div className="space-y-2">
            {bookmarkedExhibitions.map((exhibition) => {
              const isExpired = exhibition.ongoingStatus === 'end'
              return (
                <div
                  key={exhibition.id}
                  className={cn(
                    'border border-border rounded-lg p-3 md:p-4',
                    isExpired && 'opacity-60 bg-muted/30',
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm mb-2">
                        <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                        <span>{exhibition.venue}</span>
                      </div>

                      {exhibition.officialUrl ? (
                        <a
                          href={exhibition.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 transition-colors mb-2"
                          title="展覧会公式ページ"
                        >
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          <h3 className="text-sm md:text-base font-medium">{exhibition.title}</h3>
                        </a>
                      ) : (
                        <h3 className="text-sm md:text-base font-medium mb-2">
                          {exhibition.title}
                        </h3>
                      )}

                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <p>
                          {exhibition.startDate} ~ {exhibition.endDate}
                        </p>
                        {exhibition.ongoingStatus === 'ongoing' && (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300 text-[0.625rem]"
                          >
                            開催中
                          </Badge>
                        )}
                        {exhibition.ongoingStatus === 'upcoming' && (
                          <Badge
                            variant="secondary"
                            className="bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-400 text-[0.625rem]"
                          >
                            開催前
                          </Badge>
                        )}
                        {isExpired && (
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 text-[0.625rem]"
                          >
                            終了
                          </Badge>
                        )}
                      </div>
                    </div>
                    <BookmarkButton
                      exhibitionId={exhibition.id}
                      isBookmarked={true}
                      onToggle={(bookmarked) => toggleBookmark(exhibition.id, bookmarked)}
                      className="flex-shrink-0"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
