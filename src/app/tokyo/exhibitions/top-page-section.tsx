import { TopPagePresentation } from '@/app/tokyo/exhibitions/top-page-presentation'
import { getMuseumsWithCache } from '@/lib/data/museums'

const now = new Date()

export default async function TopPageSection() {
  const museums = await getMuseumsWithCache(now)

  return <TopPagePresentation museums={museums} />
}
