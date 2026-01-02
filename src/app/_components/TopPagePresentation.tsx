import { Card } from '@/components/shadcn-ui/card'
import { Museum } from '@/schema/museum'
import MuseumCard from '@/app/_components/MuseumCard'

interface TopPagePresentationProps {
  museums: Museum[]
}

export const TopPagePresentation = ({ museums }: TopPagePresentationProps) => {
  return (
    <Card className="px-4">
      <p>10件の展覧会が見つかりました</p>
      {museums.map((museum) => (
        <MuseumCard museum={museum} key={museum.name} />
      ))}
    </Card>
  )
}
