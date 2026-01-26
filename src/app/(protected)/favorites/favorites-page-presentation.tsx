'use client'

import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { Card } from '@/components/shadcn-ui/card'
import { Museum } from '@/schema/museum'
import MuseumCard from '@/app/tokyo/exhibitions/_components/museum-card'
import { useRequireAuth } from '@/hooks/use-require-auth'
import { userAtom } from '@/store/auth'
import { MuseumListSkeleton } from '@/app/tokyo/exhibitions/_components/museum-card-skeleton'
import { Skeleton } from '@/components/shadcn-ui/skeleton'
import { useBookmarks } from '@/hooks/use-bookmarks'

interface FavoritesPagePresentationProps {
  museums: Museum[]
}

export function FavoritesPagePresentation({ museums }: FavoritesPagePresentationProps) {
  const { loading: authLoading } = useRequireAuth('/favorites')
  const user = useAtomValue(userAtom)
  const { bookmarkedExhibitionIds, toggleBookmark } = useBookmarks()

  // Get favorite venues from user preferences
  const favoriteVenues = useMemo(
    () => user?.preferences.favoriteVenues ?? [],
    [user?.preferences.favoriteVenues],
  )

  // Filter museums to only show favorited venues
  const favoriteVenueNames = useMemo(
    () => new Set(favoriteVenues.map((item) => item.name)),
    [favoriteVenues],
  )

  const favoriteMuseums = useMemo(() => {
    return museums.filter((museum) => favoriteVenueNames.has(museum.name))
  }, [favoriteVenueNames, museums])

  const count = favoriteMuseums.reduce((sum, museum) => sum + museum.exhibitions.length, 0)

  // Show loading state while checking authentication
  if (authLoading || !user) {
    return (
      <div className="container">
        <Skeleton className="h-8 w-48 mb-3" />
        <MuseumListSkeleton />
      </div>
    )
  }

  if (favoriteVenues.length === 0) {
    return (
      <div className="container">
        <h1 className="text-xl font-bold mb-3 pl-1">お気に入り</h1>
        <Card className="p-8 rounded-lg text-center">
          <p className="text-muted-foreground">まだお気に入りの会場がありません</p>
          <p className="text-sm text-muted-foreground mt-2">
            展覧会ページで☆ボタンをクリックして、お気に入りに追加しましょう
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="text-xl font-bold mb-3 pl-1">お気に入り</h1>

      {count !== 0 ? (
        <div className="space-y-3">
          <div className="space-y-4 md:columns-2 xl:columns-3 md:gap-4">
            {favoriteMuseums.map((museum) => (
              <div key={museum.name} className="break-inside-avoid">
                <MuseumCard
                  museum={museum}
                  isFavorite={favoriteVenueNames.has(museum.name)}
                  bookmarkedExhibitionIds={bookmarkedExhibitionIds}
                  onBookmarkToggle={toggleBookmark}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm py-1 pl-1">お気に入りの会場に開催中・開催予定の展覧会がありません</p>
      )}
    </div>
  )
}
