'use client'

import { useState, useEffect } from 'react'
import { VenueType, venueTypeOptions, Area } from '@/schema/db/museum'
import { ongoingStatusOptions, OngoingStatusFilter } from '@/schema/ui/exhibition'
import { Label } from '@radix-ui/react-label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn-ui/radio-group'
import { Checkbox } from '@/components/shadcn-ui/checkbox'
import { Button } from '@/components/shadcn-ui/button'
import { FilterValues } from '@/hooks/use-filter-params'
import { Card } from '@/components/shadcn-ui/card'

interface FilterPanelProps {
  selectedVenueTypes: VenueType[]
  selectedAreas: Area[]
  availableAreas: Area[]
  selectedMuseumNames: string[]
  availableMuseumNames: string[]
  selectedOngoingStatus: OngoingStatusFilter
  onApply: (filters: FilterValues) => void
  onReset: () => void
}

export const FilterPanel = ({
  selectedVenueTypes,
  selectedAreas,
  availableAreas,
  selectedMuseumNames,
  availableMuseumNames,
  selectedOngoingStatus,
  onApply,
  onReset,
}: FilterPanelProps) => {
  // Draft state (temporary state before applying)
  const [draftVenueTypes, setDraftVenueTypes] = useState<VenueType[]>(selectedVenueTypes)
  const [draftAreas, setDraftAreas] = useState<Area[]>(selectedAreas)
  const [draftMuseumNames, setDraftMuseumNames] = useState<string[]>(selectedMuseumNames)
  const [draftOngoingStatus, setDraftOngoingStatus] =
    useState<OngoingStatusFilter>(selectedOngoingStatus)

  // Sync draft state with props when they change
  useEffect(() => {
    setDraftVenueTypes(selectedVenueTypes)
    setDraftAreas(selectedAreas)
    setDraftMuseumNames(selectedMuseumNames)
    setDraftOngoingStatus(selectedOngoingStatus)
  }, [selectedVenueTypes, selectedAreas, selectedMuseumNames, selectedOngoingStatus])

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
  }

  const handleResetAndApply = () => {
    onReset()
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
    <Card className="p-4 rounded-lg max-h-[calc(100vh-var(--height-header)-2rem)] flex flex-col gap-2">
      <h2 className="text-lg font-semibold flex-shrink-0">フィルター</h2>
      <div className="overflow-y-auto flex-1 min-h-0">
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
      <div className="pt-4 border-t border-border mt-4 flex-shrink-0">
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
    </Card>
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
    <p className="mb-5 font-medium">{label}</p>
    <RadioGroup onValueChange={onValueChange} value={value} className="space-y-4">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-3 w-full">
          <RadioGroupItem value={option.value} id={`panel-${option.value}`} />
          <Label htmlFor={`panel-${option.value}`} className="grow cursor-pointer">
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
      <p className="mb-5 font-medium">{label}</p>
      <div className="space-y-4">
        {displayedOptions.map((option) => {
          const isChecked = selected.includes(option.value)
          return (
            <div key={option.value} className="flex items-center gap-3 w-full">
              <Checkbox
                id={`panel-${option.value}`}
                checked={isChecked}
                onCheckedChange={() => onValueChange(option.value)}
              />
              <Label htmlFor={`panel-${option.value}`} className="cursor-pointer grow">
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
          className="mt-3 text-sm text-foreground flex items-center gap-1 cursor-pointer"
        >
          {isExpanded ? '- 閉じる' : `+ もっとみる (${options.length - INITIAL_DISPLAY_COUNT})`}
        </button>
      )}
    </div>
  )
}
