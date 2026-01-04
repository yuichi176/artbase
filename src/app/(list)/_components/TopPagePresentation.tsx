'use client'

import { Card } from '@/components/shadcn-ui/card'
import { Museum, VenueType } from '@/schema/museum'
import MuseumCard from '@/app/(list)/_components/MuseumCard'
import { useMemo, useState } from 'react'
import { FilterSection } from '@/app/(list)/_components/FilterSection'
import { OngoingStatusType } from '@/schema/exhibition'

interface TopPagePresentationProps {
  museums: Museum[]
}

export const TopPagePresentation = ({ museums }: TopPagePresentationProps) => {
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<VenueType[]>([])
  const [selectedOngoingStatuses, setSelectedOngoingStatuses] = useState<OngoingStatusType[]>([])

  const handleClickVenueType = (value: VenueType) => {
    setSelectedVenueTypes((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }

  const handleClickOngoingStatus = (value: OngoingStatusType) => {
    setSelectedOngoingStatuses((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }

  const filteredMuseums = useMemo(() => {
    return museums
      .filter((museum) => {
        if (selectedVenueTypes.length === 0) return true
        return selectedVenueTypes.includes(museum.venueType)
      })
      .map((museum) => {
        if (selectedOngoingStatuses.length === 0) return museum

        const filteredExhibitions = museum.exhibitions.filter((exhibition) => {
          if (selectedOngoingStatuses.includes('ongoing') && exhibition.isOngoing) {
            return true
          }
          return selectedOngoingStatuses.includes('upcoming') && !exhibition.isOngoing
        })

        return {
          ...museum,
          exhibitions: filteredExhibitions,
        }
      })
      .filter((museum) => museum.exhibitions.length > 0)
  }, [museums, selectedVenueTypes, selectedOngoingStatuses])

  const count = filteredMuseums.reduce((sum, museum) => sum + museum.exhibitions.length, 0)

  return (
    <div className="space-y-3">
      <FilterSection
        selectedVenueTypes={selectedVenueTypes}
        handleClickVenueType={handleClickVenueType}
        selectedOngoingStatus={selectedOngoingStatuses}
        handleClickOngoingStatus={handleClickOngoingStatus}
      />

      <Card className="p-2 md:p-4 gap-3">
        <p className="text-sm pl-1">{count}件の展覧会が見つかりました</p>
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
