'use client'

import { Card } from '@/components/shadcn-ui/card'
import { Museum, VenueType, Area } from '@/schema/museum'
import MuseumCard from '@/app/tokyo/exhibitions/_components/museum-card'
import { useMemo, useState } from 'react'
import { FilterDrawer } from '@/app/tokyo/exhibitions/_components/filter-drawer'
import { OngoingStatusType } from '@/schema/exhibition'
import { SearchInput } from '@/app/tokyo/exhibitions/_components/search-input'

interface TopPagePresentationProps {
  museums: Museum[]
}

export const TopPagePresentation = ({ museums }: TopPagePresentationProps) => {
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<VenueType[]>([])
  const [selectedAreas, setSelectedAreas] = useState<Area[]>([])
  const [selectedMuseumNames, setSelectedMuseumNames] = useState<string[]>([])
  const [selectedOngoingStatus, setSelectedOngoingStatus] = useState<OngoingStatusType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleClickVenueType = (value: VenueType) => {
    setSelectedVenueTypes((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }

  const handleClickArea = (value: Area) => {
    setSelectedAreas((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }

  const handleClickMuseumName = (value: string) => {
    setSelectedMuseumNames((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }

  const handleClickOngoingStatus = (value: OngoingStatusType) => {
    setSelectedOngoingStatus(value)
  }

  const handleResetFilters = () => {
    setSelectedVenueTypes([])
    setSelectedAreas([])
    setSelectedMuseumNames([])
    setSelectedOngoingStatus('all')
  }

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
          if (selectedOngoingStatus === 'ongoing') return exhibition.isOngoing
          if (selectedOngoingStatus === 'upcoming') return !exhibition.isOngoing
          return true
        })

        return {
          ...museum,
          exhibitions: filteredExhibitions,
        }
      })
      .filter((museum) => museum.exhibitions.length > 0)
      .filter((museum) => {
        if (!q) return true

        const matchVenueName = museum.name.toLowerCase().includes(q)
        const matchExhibitionTitle = museum.exhibitions.some((exhibition) =>
          exhibition.title.toLowerCase().includes(q),
        )

        return matchVenueName || matchExhibitionTitle
      })
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
        handleClickVenueType={handleClickVenueType}
        selectedAreas={selectedAreas}
        availableAreas={availableAreas}
        handleClickArea={handleClickArea}
        selectedMuseumNames={selectedMuseumNames}
        availableMuseumNames={availableMuseumNames}
        handleClickMuseumName={handleClickMuseumName}
        selectedOngoingStatus={selectedOngoingStatus}
        handleClickOngoingStatus={handleClickOngoingStatus}
        onReset={handleResetFilters}
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
              <MuseumCard museum={museum} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
