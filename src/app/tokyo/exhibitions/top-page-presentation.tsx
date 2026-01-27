'use client'

import { Card } from '@/components/shadcn-ui/card'
import { Museum } from '@/schema/ui/museum'
import MuseumCard from '@/app/tokyo/exhibitions/_components/museum-card'
import { useMemo, useState } from 'react'
import { FilterDrawer } from '@/app/tokyo/exhibitions/_components/filter-drawer'
import { SearchInput } from '@/app/tokyo/exhibitions/_components/search-input'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { useFavorites } from '@/hooks/use-favorites'
import { useFilterParams } from '@/hooks/use-filter-params'

interface TopPagePresentationProps {
  museums: Museum[]
}

export const TopPagePresentation = ({ museums }: TopPagePresentationProps) => {
  const { bookmarkedExhibitionIds, toggleBookmark } = useBookmarks()
  const { favoriteMuseumIds, toggleFavorite } = useFavorites()
  const {
    selectedVenueTypes,
    selectedAreas,
    selectedMuseumNames,
    selectedOngoingStatus,
    applyFilters,
    resetFilters,
  } = useFilterParams()

  // Search query is local state (not synced to URL)
  const [searchQuery, setSearchQuery] = useState('')

  const availableAreas = useMemo(() => {
    const uniqueAreas = [...new Set(museums.map((museum) => museum.area))]
    return uniqueAreas.sort()
  }, [museums])

  const availableMuseumNames = useMemo(() => {
    const uniqueNames = [...new Set(museums.map((museum) => museum.name))]
    return uniqueNames.sort()
  }, [museums])

  const filteredMuseums = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return museums
      .filter((museum) => {
        if (selectedVenueTypes.length === 0) return true
        return selectedVenueTypes.includes(museum.venueType)
      })
      .filter((museum) => {
        if (selectedAreas.length === 0) return true
        return selectedAreas.includes(museum.area)
      })
      .filter((museum) => {
        if (selectedMuseumNames.length === 0) return true
        return selectedMuseumNames.includes(museum.name)
      })
      .map((museum) => {
        const filteredExhibitions = museum.exhibitions.filter((exhibition) => {
          if (selectedOngoingStatus === 'all') return true
          return exhibition.ongoingStatus === selectedOngoingStatus
        })

        return {
          ...museum,
          exhibitions: filteredExhibitions,
        }
      })
      .filter((museum) => museum.exhibitions.length > 0)
      .map((museum) => {
        if (!q) return museum

        const matchVenueName = museum.name.toLowerCase().includes(q)

        // 会場名に一致した場合、すべての展覧会を返す
        if (matchVenueName) {
          return museum
        }

        // 会場名に一致しない場合、展覧会名でフィルタリング
        const filteredExhibitions = museum.exhibitions.filter((exhibition) =>
          exhibition.title.toLowerCase().includes(q),
        )

        return {
          ...museum,
          exhibitions: filteredExhibitions,
        }
      })
      .filter((museum) => museum.exhibitions.length > 0)
  }, [
    museums,
    selectedVenueTypes,
    selectedAreas,
    selectedMuseumNames,
    selectedOngoingStatus,
    searchQuery,
  ])

  const count = filteredMuseums.reduce((sum, museum) => sum + museum.exhibitions.length, 0)

  return (
    <div className="space-y-3">
      <SearchInput value={searchQuery} onChange={setSearchQuery} />

      <FilterDrawer
        selectedVenueTypes={selectedVenueTypes}
        selectedAreas={selectedAreas}
        availableAreas={availableAreas}
        selectedMuseumNames={selectedMuseumNames}
        availableMuseumNames={availableMuseumNames}
        selectedOngoingStatus={selectedOngoingStatus}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <Card className="p-2 md:p-4 rounded-lg gap-0 bg-background">
        {count !== 0 ? (
          <p className="text-sm pl-1 mb-3">{count}件の展覧会が見つかりました</p>
        ) : (
          <p className="text-sm py-1 pl-1">条件に一致する展覧会が見つかりませんでした</p>
        )}
        <div className="space-y-4 md:columns-2 xl:columns-3 md:gap-4">
          {filteredMuseums.map((museum) => (
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
      </Card>
    </div>
  )
}
