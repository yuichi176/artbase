import { Card } from '@/components/shadcn-ui/card'
import { Badge } from '@/components/shadcn-ui/badge'
import { cn } from '@/utils/shadcn'
import { Filter } from '@/components'

interface FilterSectionProps {
  selectedVenueCategories: string[]
  handleClickVenueCategory: (category: string) => void
}

const venueCategories = [
  { value: '美術館', label: '美術館' },
  { value: '博物館', label: '博物館' },
  { value: 'ギャラリー', label: 'ギャラリー' },
]

export const FilterSection = ({
  selectedVenueCategories,
  handleClickVenueCategory,
}: FilterSectionProps) => {
  return (
    <Card className="p-3 md:p-4 gap-3">
      <div className="flex items-center gap-1">
        <Filter className="size-5" />
        <h2 className="text-sm md:text-base">フィルター</h2>
      </div>
      <div className="flex flex-wrap items-center gap-y-3 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm md:text-base">施設タイプ</span>:
          <div className="flex flex-wrap gap-2">
            {venueCategories.map((category) => {
              const isSelected = selectedVenueCategories.includes(category.value)
              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleClickVenueCategory(category.value)}
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-full px-3 py-1',
                      isSelected && 'bg-secondary border-[#8f8f8f]',
                    )}
                  >
                    {category.label}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
