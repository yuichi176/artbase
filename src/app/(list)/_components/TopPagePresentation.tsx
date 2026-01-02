import { Card } from '@/components/shadcn-ui/card'
import { Museum } from '@/schema/museum'
import MuseumCard from '@/app/(list)/_components/MuseumCard'

interface TopPagePresentationProps {
  museums: Museum[]
}

export const TopPagePresentation = ({ museums }: TopPagePresentationProps) => {
  const count = museums.reduce((sum, museum) => sum + museum.exhibitions.length, 0)

  return (
    <Card className="p-4 gap-3">
      <p className="text-sm">{count}件の展覧会が見つかりました</p>
      <div className="flex flex-col gap-4">
        {museums.map((museum) => (
          <MuseumCard museum={museum} key={museum.name} />
        ))}
      </div>
    </Card>
  )
}
