import { TopPagePresentation } from '@/app/tokyo/exhibitions/top-page-presentation'
import { getMuseumsWithCache } from '@/lib/data/museums'

export default async function TopPageSection() {
  const museums = await getMuseumsWithCache()

  return <TopPagePresentation museums={museums} />
}
