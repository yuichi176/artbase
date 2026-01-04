'use client'

import { Card } from '@/components/shadcn-ui/card'
import { Museum } from '@/schema/museum'
import MuseumCard from '@/app/(list)/_components/MuseumCard'
import { useState } from 'react'
import { FilterSection } from '@/app/(list)/_components/FilterSection'

interface TopPagePresentationProps {
  museums: Museum[]
}

export const TopPagePresentation = ({ museums }: TopPagePresentationProps) => {
  const [selectedVenueCategories, setSelectedVenueCategories] = useState<string[]>([])
  const [selectedOpenStatuses, setSelectedOpenStatuses] = useState<string[]>([])

  const count = museums.reduce((sum, museum) => sum + museum.exhibitions.length, 0)

  const handleClickVenueCategory = (value: string) => {
    setSelectedVenueCategories((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }

  const handleClickOpenStatus = (value: string) => {
    setSelectedOpenStatuses((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }

  return (
    <div className="space-y-3">
      <FilterSection
        selectedVenueCategories={selectedVenueCategories}
        handleClickVenueCategory={handleClickVenueCategory}
        selectedOpenStatus={selectedOpenStatuses}
        handleClickOpenStatus={handleClickOpenStatus}
      />
      <Card className="p-2 md:p-4 gap-3">
        <p className="text-sm pl-1">{count}件の展覧会が見つかりました</p>
        <div className="space-y-4 md:columns-2 xl:columns-3 md:gap-4">
          {museums.map((museum) => (
            <div key={museum.name} className="break-inside-avoid">
              <MuseumCard museum={museum} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
