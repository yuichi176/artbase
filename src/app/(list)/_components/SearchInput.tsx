import { ChangeEvent } from 'react'
import { Label } from '@/components/shadcn-ui/label'
import { Input } from '@/components/shadcn-ui/input'
import { Search } from 'lucide-react'

type SearchInputProps = {
  id?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export const SearchInput = ({
  id = 'search',
  placeholder = '会場名、展覧会名で検索...',
  value,
  onChange,
}: SearchInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      <Label htmlFor={id} className="sr-only">
        Search
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        className="pl-8 bg-background h-8 w-full shadow-none"
        value={value}
        onChange={handleChange}
      />
      <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
    </div>
  )
}
