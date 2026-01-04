'use client'

import { Train } from 'lucide-react'
import { useExpandableClamp } from '@/hooks/useExpandableClamp'

type Props = {
  museumName: string
  access: string
}

export function MuseumAccess({ museumName, access }: Props) {
  const { getTextProps, getToggleButtonProps, isClamped, isExpanded } =
    useExpandableClamp<HTMLParagraphElement>()

  const textProps = getTextProps()
  const toggleButtonProps = getToggleButtonProps()

  return (
    <div className="text-xs md:text-sm text-gray-500 flex">
      <Train className="w-4 h-4 mt-0.5 mr-1 shrink-0" aria-label={`${museumName}のアクセス情報`} />
      <div className="flex-1 min-w-0">
        <p {...textProps}>{access}</p>

        {isClamped && (
          <button
            className="mt-1 text-blue-600 hover:text-blue-700 underline"
            {...toggleButtonProps}
          >
            {isExpanded ? '閉じる' : 'もっと見る'}
          </button>
        )}
      </div>
    </div>
  )
}
