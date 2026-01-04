import { Card } from '@/components/shadcn-ui/card'
import { Museum } from '@/schema/museum'
import MuseumCard from '@/app/(list)/_components/MuseumCard'

interface TopPagePresentationProps {
  museums: Museum[]
}

export const TopPagePresentation = ({ museums }: TopPagePresentationProps) => {
  const count = museums.reduce((sum, museum) => sum + museum.exhibitions.length, 0)

  return (
    <Card className="p-2 md:p-4 gap-3">
      <p className="text-sm pl-1">{count}件の展覧会が見つかりました</p>
      <div className="space-y-4 md:columns-2 xl:columns-3 md:gap-4">
        {museums.map((museum) => (
          <div key={museum.name} className="break-inside-avoid">
            <MuseumCard museum={museum} />
          </div>
        ))}
      </div>
    </Card>
  )
}
