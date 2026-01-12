'use client'

import { useState } from 'react'
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
import { Label } from '@radix-ui/react-label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn-ui/radio-group'
import { Checkbox } from '@/components/shadcn-ui/checkbox'

interface FilterSectionProps {
  selectedVenueTypes: string[]
  handleClickVenueType: (type: VenueType) => void
  selectedOngoingStatus: OngoingStatusType
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

        <div className="px-4 overflow-y-auto max-h-[80vh]">
          <div className="divide-y divide-gray-200">
            <FilterFieldRadio
              label="開催状況"
              options={ongoingStatusOptions}
              onValueChange={(value) => handleClickOngoingStatus(value as OngoingStatusType)}
              value={selectedOngoingStatus}
            />
            <FilterFieldCheckbox
              label="施設タイプ"
              options={venueTypeOptions}
              selected={selectedVenueTypes}
              onValueChange={(value) => handleClickVenueType(value as VenueType)}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface FilterFieldProps {
  label: string
  options: { value: string; label: string }[]
  onValueChange: (value: string) => void
}

const FilterFieldRadio = ({
  label,
  options,
  onValueChange,
  value,
}: FilterFieldProps & {
  value: string
}) => (
  <div className="py-5">
    <p className="font-bold mb-5">{label}</p>
    <RadioGroup onValueChange={onValueChange} value={value}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  </div>
)

const FilterFieldCheckbox = ({
  label,
  options,
  onValueChange,
  selected,
}: FilterFieldProps & { selected: string[] }) => {
  return (
    <div className="py-5">
      <p className="font-bold mb-5">{label}</p>
      <div className="space-y-3">
        {options.map((option) => {
          const isChecked = selected.includes(option.value)
          return (
            <div key={option.value} className="flex items-center gap-3">
              <Checkbox
                id={option.value}
                checked={isChecked}
                onCheckedChange={() => onValueChange(option.value)}
              />
              <Label htmlFor={option.value} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
