'use client'

import { useState } from 'react'
import { Filter } from '@/components/icon/filter'
import { X } from '@/components/icon/x'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/shadcn-ui/drawer'
import { VenueType, venueTypeOptions, Area } from '@/schema/museum'
import { ongoingStatusOptions, OngoingStatusType } from '@/schema/exhibition'
import { Label } from '@radix-ui/react-label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn-ui/radio-group'
import { Checkbox } from '@/components/shadcn-ui/checkbox'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn-ui/dialog'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface FilterDrawerProps {
  selectedVenueTypes: string[]
  handleClickVenueType: (type: VenueType) => void
  selectedAreas: Area[]
  availableAreas: Area[]
  handleClickArea: (area: Area) => void
  selectedMuseumNames: string[]
  availableMuseumNames: string[]
  handleClickMuseumName: (name: string) => void
  selectedOngoingStatus: OngoingStatusType
  handleClickOngoingStatus: (status: OngoingStatusType) => void
  onReset: () => void
}

export const FilterDrawer = (props: FilterDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 48rem)')

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="w-full rounded-lg border bg-background py-3 px-2 md:px-4 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 text-foreground">
              <Filter className="size-5" />
              <p className="text-sm">フィルター</p>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-left">フィルター</DialogTitle>
            <FilterContent {...props} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer direction="bottom" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="w-full rounded-lg border bg-background py-3 px-2 md:px-4 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 text-foreground">
            <Filter className="size-5" />
            <p className="text-sm">フィルター</p>
          </div>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-left">フィルター</DrawerTitle>
            <DrawerClose asChild>
              <button
                type="button"
                className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
                aria-label="閉じる"
              >
                <X className="size-5" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <FilterContent {...props} />
      </DrawerContent>
    </Drawer>
  )
}

const FilterContent = ({
  selectedVenueTypes,
  handleClickVenueType,
  selectedAreas,
  availableAreas,
  handleClickArea,
  selectedMuseumNames,
  availableMuseumNames,
  handleClickMuseumName,
  selectedOngoingStatus,
  handleClickOngoingStatus,
  onReset,
}: FilterDrawerProps) => {
  const availableAreaOptions = availableAreas.map((area) => ({
    label: area,
    value: area,
  }))

  const availableMuseumNameOptions = availableMuseumNames.map((name) => ({
    label: name,
    value: name,
  }))

  return (
    <div className="px-4 overflow-y-auto max-h-[80vh]">
      <div className="divide-y divide-border">
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
        <FilterFieldCheckbox
          label="エリア"
          options={availableAreaOptions}
          selected={selectedAreas}
          onValueChange={(value) => handleClickArea(value as Area)}
        />
        <FilterFieldCheckbox
          label="会場名"
          options={availableMuseumNameOptions}
          selected={selectedMuseumNames}
          onValueChange={(value) => handleClickMuseumName(value)}
        />
      </div>
      <div className="py-4">
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 font-medium transition-colors cursor-pointer"
        >
          すべてリセット
        </button>
      </div>
    </div>
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
    <p className="mb-5">{label}</p>
    <RadioGroup onValueChange={onValueChange} value={value} className="space-y-4">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-3 w-full">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value} className="grow cursor-pointer">
            {option.label}
          </Label>
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
  const [isExpanded, setIsExpanded] = useState(false)
  const INITIAL_DISPLAY_COUNT = 5
  const shouldShowExpandButton = options.length > INITIAL_DISPLAY_COUNT

  const displayedOptions =
    shouldShowExpandButton && !isExpanded ? options.slice(0, INITIAL_DISPLAY_COUNT) : options

  return (
    <div className="py-5">
      <p className="mb-5">{label}</p>
      <div className="space-y-4">
        {displayedOptions.map((option) => {
          const isChecked = selected.includes(option.value)
          return (
            <div key={option.value} className="flex items-center gap-3 w-full">
              <Checkbox
                id={option.value}
                checked={isChecked}
                onCheckedChange={() => onValueChange(option.value)}
              />
              <Label htmlFor={option.value} className="cursor-pointer grow">
                {option.label}
              </Label>
            </div>
          )
        })}
      </div>

      {shouldShowExpandButton && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-sm text-foreground  flex items-center gap-1 cursor-pointer"
        >
          {isExpanded ? '- 閉じる' : `+ もっとみる (${options.length - INITIAL_DISPLAY_COUNT})`}
        </button>
      )}
    </div>
  )
}
