'use client'

import { useState, useEffect } from 'react'
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
import { VenueType, venueTypeOptions, Area } from '@/schema/db/museum'
import { ongoingStatusOptions, OngoingStatusFilter } from '@/schema/ui/exhibition'
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
import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/shadcn-ui/button'
import { FilterValues } from '@/hooks/use-filter-params'

interface FilterDrawerProps {
  selectedVenueTypes: VenueType[]
  selectedAreas: Area[]
  availableAreas: Area[]
  selectedMuseumNames: string[]
  availableMuseumNames: string[]
  selectedOngoingStatus: OngoingStatusFilter
  onApply: (filters: FilterValues) => void
  onReset: () => void
}

export const FilterDrawer = (props: FilterDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 48rem)')

  const handleClose = () => {
    setIsOpen(false)
  }

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
            <FilterContent {...props} isOpen={isOpen} onClose={handleClose} />
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
        <FilterContent {...props} isOpen={isOpen} onClose={handleClose} />
      </DrawerContent>
    </Drawer>
  )
}

const FilterContent = ({
  selectedVenueTypes,
  selectedAreas,
  availableAreas,
  selectedMuseumNames,
  availableMuseumNames,
  selectedOngoingStatus,
  onApply,
  onReset,
  isOpen,
  onClose,
}: FilterDrawerProps & { isOpen: boolean; onClose: () => void }) => {
  // Draft state (temporary state before applying)
  const [draftVenueTypes, setDraftVenueTypes] = useState<VenueType[]>(selectedVenueTypes)
  const [draftAreas, setDraftAreas] = useState<Area[]>(selectedAreas)
  const [draftMuseumNames, setDraftMuseumNames] = useState<string[]>(selectedMuseumNames)
  const [draftOngoingStatus, setDraftOngoingStatus] =
    useState<OngoingStatusFilter>(selectedOngoingStatus)

  // Reset draft state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setDraftVenueTypes(selectedVenueTypes)
      setDraftAreas(selectedAreas)
      setDraftMuseumNames(selectedMuseumNames)
      setDraftOngoingStatus(selectedOngoingStatus)
    }
  }, [isOpen, selectedVenueTypes, selectedAreas, selectedMuseumNames, selectedOngoingStatus])

  const handleClickVenueType = (value: VenueType) => {
    setDraftVenueTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleClickArea = (value: Area) => {
    setDraftAreas((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleClickMuseumName = (value: string) => {
    setDraftMuseumNames((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleClickOngoingStatus = (value: OngoingStatusFilter) => {
    setDraftOngoingStatus(value)
  }

  const handleResetDraft = () => {
    setDraftVenueTypes([])
    setDraftAreas([])
    setDraftMuseumNames([])
    setDraftOngoingStatus('all')
  }

  const handleApply = () => {
    onApply({
      venueTypes: draftVenueTypes,
      areas: draftAreas,
      museumNames: draftMuseumNames,
      ongoingStatus: draftOngoingStatus,
    })
    onClose()
  }

  const handleResetAndApply = () => {
    onReset()
    onClose()
  }

  const availableAreaOptions = availableAreas.map((area) => ({
    label: area,
    value: area,
  }))

  const availableMuseumNameOptions = availableMuseumNames.map((name) => ({
    label: name,
    value: name,
  }))

  return (
    <>
      <div className="px-4 overflow-y-auto max-h-[80vh]">
        <div className="divide-y divide-border">
          <FilterFieldRadio
            label="開催状況"
            options={ongoingStatusOptions}
            onValueChange={(value) => handleClickOngoingStatus(value as OngoingStatusFilter)}
            value={draftOngoingStatus}
          />
          <FilterFieldCheckbox
            label="施設タイプ"
            options={venueTypeOptions}
            selected={draftVenueTypes}
            onValueChange={(value) => handleClickVenueType(value as VenueType)}
          />
          <FilterFieldCheckbox
            label="エリア"
            options={availableAreaOptions}
            selected={draftAreas}
            onValueChange={(value) => handleClickArea(value as Area)}
          />
          <FilterFieldCheckbox
            label="会場名"
            options={availableMuseumNameOptions}
            selected={draftMuseumNames}
            onValueChange={(value) => handleClickMuseumName(value)}
          />
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          <div className="w-full flex gap-3">
            <Button onClick={handleResetDraft} className="w-1/2" variant="outline">
              クリア
            </Button>
            <Button onClick={handleApply} className="w-1/2">
              適用
            </Button>
          </div>
          <Button onClick={handleResetAndApply} className="w-full" variant="outline">
            リセット
          </Button>
        </div>
      </div>
    </>
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
