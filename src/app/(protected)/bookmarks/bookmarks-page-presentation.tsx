'use client'

import { useMemo, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/shadcn-ui/card'
import { Museum } from '@/schema/museum'
import { Exhibition } from '@/schema/exhibition'
import { useRequireAuth } from '@/hooks/use-require-auth'
import { userAtom } from '@/store/auth'
import { Skeleton } from '@/components/shadcn-ui/skeleton'
import { Calendar, MapPin, ExternalLink, Bookmark } from 'lucide-react'
import { Badge } from '@/components/shadcn-ui/badge'
import { BookmarkButton } from '@/app/tokyo/exhibitions/_components/bookmark-button'
import { cn } from '@/utils/shadcn'

interface BookmarksPagePresentationProps {
  museums: Museum[]
}

export function BookmarksPagePresentation({ museums }: BookmarksPagePresentationProps) {
  const { loading: authLoading } = useRequireAuth('/bookmarks')
  const user = useAtomValue(userAtom)
  const router = useRouter()

  // Check Pro plan and redirect if needed
  useEffect(() => {
    if (!authLoading && user && user.subscriptionTier !== 'pro') {
      router.push('/pricing')
    }
  }, [authLoading, user, router])

  // Get bookmarked exhibition IDs from user preferences
  const bookmarkedExhibitionIds = useMemo(
    () => new Set(user?.preferences.bookmarkedExhibitions.map((item) => item.exhibitionId) ?? []),
    [user?.preferences.bookmarkedExhibitions],
  )

  // Extract all exhibitions from museums and filter by bookmarked IDs
  const bookmarkedExhibitions = useMemo(() => {
    const allExhibitions: (Exhibition & { venue: string })[] = []

    museums.forEach((museum) => {
      museum.exhibitions.forEach((exhibition) => {
        if (bookmarkedExhibitionIds.has(exhibition.id)) {
          allExhibitions.push({
            ...exhibition,
            venue: museum.name,
          })
        }
      })
    })

    // Sort by start date (most recent first)
    return allExhibitions.sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  }, [museums, bookmarkedExhibitionIds])

  // Show loading state while checking authentication or Pro plan
  if (authLoading || !user || user.subscriptionTier !== 'pro') {
    return (
      <div className="container">
        <Skeleton className="h-8 w-64 mb-3" />
        <Card className="p-8 rounded-lg">
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full" />
        </Card>
      </div>
    )
  }

  if (bookmarkedExhibitions.length === 0) {
    return (
      <div className="container">
        <div className="pl-1 mb-3">
          <h1 className="text-xl font-bold mb-1">ブックマーク</h1>
          <p>ブックマークページの説明</p>
        </div>
        <Card className="p-8 rounded-lg text-center">
          <p className="text-muted-foreground ">まだブックマークした展覧会がありません</p>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            <span className="inline-flex items-center">
              展覧会ページで
              <span aria-hidden="true" className="inline-flex items-center">
                <Bookmark className="w-4 h-4" />
              </span>
            </span>
            ボタンをクリックして、ブックマークに追加しましょう
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="pl-1 mb-3">
        <h1 className="text-xl font-bold mb-1">ブックマーク</h1>
        <p>ブックマークページの説明</p>
      </div>

      <Card className="p-2 md:p-4 rounded-lg gap-0 bg-background">
        <p className="text-sm pl-1 mb-3">{bookmarkedExhibitions.length}件の展覧会</p>
        <div className="space-y-2">
          {bookmarkedExhibitions.map((exhibition) => {
            const isExpired = !exhibition.isOngoing && new Date(exhibition.endDate) < new Date()
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
                      <h3 className="text-sm md:text-base font-medium mb-2">{exhibition.title}</h3>
                    )}

                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
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
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
