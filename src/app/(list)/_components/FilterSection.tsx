import { Card } from '@/components/shadcn-ui/card'
import { Badge } from '@/components/shadcn-ui/badge'
import { cn } from '@/utils/shadcn'
import { Filter } from '@/components'

const venueCategories = [
  { value: '美術館', label: '美術館' },
  { value: '博物館', label: '博物館' },
  { value: 'ギャラリー', label: 'ギャラリー' },
]

const openStatuses = [
  { value: 'ongoing', label: '開催中' },
  { value: 'upcoming', label: '開催予定' },
]

interface FilterSectionProps {
  selectedVenueCategories: string[]
  handleClickVenueCategory: (category: string) => void
  selectedOpenStatus: string[]
  handleClickOpenStatus: (status: string) => void
}

export const FilterSection = ({
  selectedVenueCategories,
  handleClickVenueCategory,
  selectedOpenStatus,
  handleClickOpenStatus,
}: FilterSectionProps) => {
  return (
    <Card className="p-3 md:p-4 gap-3">
      <div className="flex items-center gap-1">
        <Filter className="size-5" />
        <h2 className="text-sm md:text-base">フィルター</h2>
      </div>

      <FilterItem
        label="施設タイプ"
        options={venueCategories}
        selected={selectedVenueCategories}
        onClick={handleClickVenueCategory}
      />

      <FilterItem
        label="開催状況"
        options={openStatuses}
        selected={selectedOpenStatus}
        onClick={handleClickOpenStatus}
      />
    </Card>
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
  <div className="flex flex-wrap items-center gap-y-3 px-1">
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm md:text-base">{label}</span>:
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <button key={option.value} type="button" onClick={() => onClick(option.value)}>
              <Badge
                variant="outline"
                className={cn(
                  'rounded-md px-3 py-1',
                  isSelected && 'bg-secondary border-[#8f8f8f]',
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
