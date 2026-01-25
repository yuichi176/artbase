'use client'

import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { Card } from '@/components/shadcn-ui/card'
import { Museum } from '@/schema/museum'
import MuseumCard from '@/app/tokyo/exhibitions/_components/museum-card'
import { SearchInput } from '@/app/tokyo/exhibitions/_components/search-input'
import { useRequireAuth } from '@/hooks/use-require-auth'
import { userAtom } from '@/store/auth'

interface FavoritesPagePresentationProps {
  museums: Museum[]
}

export function FavoritesPagePresentation({ museums }: FavoritesPagePresentationProps) {
  const { loading: authLoading } = useRequireAuth('/favorites')
  const user = useAtomValue(userAtom)
  const [searchQuery, setSearchQuery] = useState('')

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

  // Apply search filter
  const filteredMuseums = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    if (!q) return favoriteMuseums

    return favoriteMuseums.filter((museum) => {
      const matchVenueName = museum.name.toLowerCase().includes(q)
      const matchExhibitionTitle = museum.exhibitions.some((exhibition) =>
        exhibition.title.toLowerCase().includes(q),
      )

      return matchVenueName || matchExhibitionTitle
    })
  }, [favoriteMuseums, searchQuery])

  const count = filteredMuseums.reduce((sum, museum) => sum + museum.exhibitions.length, 0)

  // Show loading state while checking authentication
  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">お気に入り会場</h1>
        <Card className="p-8 rounded-lg text-center">
          <p className="text-muted-foreground">読み込み中...</p>
        </Card>
      </div>
    )
  }

  // Empty state: no favorites at all
  if (favoriteVenues.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">お気に入り会場</h1>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">お気に入り会場</h1>

      <div className="space-y-3">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />

        <Card className="p-2 md:p-4 rounded-lg gap-0 bg-background">
          {count !== 0 ? (
            <p className="text-sm pl-1 mb-3">{count}件の展覧会が見つかりました</p>
          ) : (
            <p className="text-sm py-1 pl-1">
              {searchQuery
                ? '条件に一致する展覧会が見つかりませんでした'
                : 'お気に入りの会場に開催中・開催予定の展覧会がありません'}
            </p>
          )}
          <div className="space-y-4 md:columns-2 xl:columns-3 md:gap-4">
            {filteredMuseums.map((museum) => (
              <div key={museum.name} className="break-inside-avoid">
                <MuseumCard museum={museum} isFavorite={favoriteVenueNames.has(museum.name)} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
