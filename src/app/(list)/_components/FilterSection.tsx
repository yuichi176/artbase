import { Badge } from '@/components/shadcn-ui/badge'
import { cn } from '@/utils/shadcn'
import { Filter } from '@/components'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn-ui/accordion'
import { VenueType } from '@/schema/museum'
import { OngoingStatusType } from '@/schema/exhibition'

const venueTypes = [
  { value: '美術館', label: '美術館' },
  { value: '博物館', label: '博物館' },
  { value: 'ギャラリー', label: 'ギャラリー' },
] satisfies {
  value: VenueType
  label: string
}[]

const ongoingStatuses = [
  { value: 'ongoing', label: '開催中' },
  { value: 'upcoming', label: '開催予定' },
] satisfies { value: OngoingStatusType; label: string }[]

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
  return (
    <Accordion type="single" collapsible className="rounded-lg border bg-background">
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:no-underline hover:cursor-pointer py-3 px-3 md:px-4">
          <div className="flex items-center gap-1 text-gray-800">
            <Filter className="size-5" />
            <p>フィルター</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 md:px-4 border-t border-gray-200 py-4">
          <div className="space-y-3 md:flex md:items-center md:space-y-0 md:divide-x md:divide-gray-200 px-1">
            <FilterItem
              label="施設タイプ"
              options={venueTypes}
              selected={selectedVenueTypes}
              onClick={(value) => handleClickVenueType(value as VenueType)}
            />
            <FilterItem
              label="開催状況"
              options={ongoingStatuses}
              selected={selectedOngoingStatus}
              onClick={(value) => handleClickOngoingStatus(value as OngoingStatusType)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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
      <span className="text-gray-800">{label}</span>:
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
