'use client'

import { useMemo } from 'react'
import { Card } from '@/components/shadcn-ui/card'
import { Museum } from '@/schema/ui/museum'
import MuseumCard from '@/app/tokyo/exhibitions/_components/museum-card'
import { useRequireAuth } from '@/hooks/use-require-auth'
import { MuseumListSkeleton } from '@/app/tokyo/exhibitions/_components/museum-card-skeleton'
import { Skeleton } from '@/components/shadcn-ui/skeleton'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { useFavorites } from '@/hooks/use-favorites'

interface FavoritesPagePresentationProps {
  museums: Museum[]
}

export function FavoritesPagePresentation({ museums }: FavoritesPagePresentationProps) {
  const { loading: authLoading } = useRequireAuth('/favorites')
  const { bookmarkedExhibitionIds, toggleBookmark } = useBookmarks()
  const { favoriteMuseumIds, loading: favoritesLoading, toggleFavorite } = useFavorites()

  const favoriteMuseums = useMemo(() => {
    return museums.filter((museum) => favoriteMuseumIds.has(museum.id))
  }, [favoriteMuseumIds, museums])

  // Show loading state while checking authentication or fetching favorites
  if (authLoading || favoritesLoading) {
    return (
      <div className="container">
        <Skeleton className="h-8 w-48 mb-3" />
        <MuseumListSkeleton />
      </div>
    )
  }

  if (favoriteMuseumIds.size === 0) {
    return (
      <div className="container">
        <div className="pl-1 mb-3">
          <h1 className="text-xl font-bold mb-1">お気に入り</h1>
          <p className="text-sm text-muted-foreground">
            お気に入りの会場の展覧会情報をまとめて確認できます。
          </p>
        </div>
        <Card className="p-8 rounded-lg text-center">
          <p className="text-muted-foreground">まだお気に入りの会場がありません</p>
          <p className="text-sm text-muted-foreground mt-2">
            展覧会ページで☆ボタンをクリックして、お気に入りに追加しましょう。
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="pl-1 mb-3">
        <h1 className="text-xl font-bold mb-1">お気に入り</h1>
        <p className="text-sm text-muted-foreground">
          お気に入りの会場の展覧会情報をまとめて確認できます。
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-4 md:columns-2 xl:columns-3 md:gap-4">
          {favoriteMuseums.map((museum) => (
            <div key={museum.name} className="break-inside-avoid">
              <MuseumCard
                museum={museum}
                isFavorite={favoriteMuseumIds.has(museum.id)}
                bookmarkedExhibitionIds={bookmarkedExhibitionIds}
                onBookmarkToggle={toggleBookmark}
                onFavoriteToggle={toggleFavorite}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
