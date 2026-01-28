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
      <div className="max-w-[800px] mx-auto">
        <Skeleton className="h-8 w-48 mb-3" />
        <MuseumListSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="pl-1 mb-5">
        <h1 className="text-xl font-bold mb-3">お気に入り</h1>
        <p className="text-sm text-muted-foreground">
          お気に入りの会場の展覧会情報をまとめて確認できます。
        </p>
      </div>

      {favoriteMuseums.length === 0 ? (
        <Card className="p-6 rounded-lg text-center gap-4 md:p-8">
          <p className="text-sm text-muted-foreground md:text-base">
            まだお気に入りの会場はありません。
          </p>
          <p className="text-xs text-muted-foreground md:text-sm">
            気になる会場を見つけたら☆ボタンで登録して、自分だけのリストをつくりましょう。
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="space-y-4">
            {favoriteMuseums.map((museum) => (
              <div key={museum.name}>
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
      )}
    </div>
  )
}
