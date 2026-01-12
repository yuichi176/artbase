'use client'

import { useState } from 'react'
import { Badge } from '@/components/shadcn-ui/badge'
import { cn } from '@/utils/shadcn'
import { Filter } from '@/components/icon/filter'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/shadcn-ui/drawer'
import { VenueType, venueTypeOptions } from '@/schema/museum'
import { ongoingStatusOptions, OngoingStatusType } from '@/schema/exhibition'

interface FilterSectionProps {
  selectedVenueTypes: string[]
  handleClickVenueType: (type: VenueType) => void
  selectedOngoingStatus: string[]
  handleClickOngoingStatus: (status: OngoingStatusType) => void
}

export const FilterSection = ({
  selectedVenueTypes,
  handleClickVenueType,
  selectedOngoingStatus,
  handleClickOngoingStatus,
}: FilterSectionProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <Drawer direction="bottom" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="w-full rounded-lg border bg-background py-3 px-3 md:px-4 hover:bg-accent hover:text-accent-foreground transition-colors text-left"
        >
          <div className="flex items-center gap-1 text-gray-800">
            <Filter className="size-5" />
            <p>フィルター</p>
          </div>
        </button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="border-b border-gray-200">
          <DrawerTitle className="text-left">フィルター</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 py-4 overflow-y-auto max-h-[80vh]">
          <div className="space-y-3 md:flex md:items-center md:space-y-0 md:divide-x md:divide-gray-200">
            <FilterItem
              label="施設タイプ"
              options={venueTypeOptions}
              selected={selectedVenueTypes}
              onClick={(value) => handleClickVenueType(value as VenueType)}
            />
            <FilterItem
              label="開催状況"
              options={ongoingStatusOptions}
              selected={selectedOngoingStatus}
              onClick={(value) => handleClickOngoingStatus(value as OngoingStatusType)}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

type Option = { value: string; label: string }

interface FilterItemProps {
  label: string
  options: Option[]
  selected: string[]
  onClick: (value: string) => void
}

const FilterItem = ({ label, options, selected, onClick }: FilterItemProps) => (
  <div className="flex flex-wrap items-center gap-y-3 md:px-4 first:md:pl-0">
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-gray-800">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <button key={option.value} type="button" onClick={() => onClick(option.value)}>
              <Badge
                variant="outline"
                className={cn(
                  'rounded-lg px-3 py-1 text-gray-700',
                  isSelected && 'bg-gray-100 border-gray-500',
                )}
              >
                {option.label}
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  </div>
)
