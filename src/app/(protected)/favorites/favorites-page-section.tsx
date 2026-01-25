import { FavoritesPagePresentation } from './favorites-page-presentation'
import { getMuseumsWithCache } from '@/lib/data/museums'

const now = new Date()

export default async function FavoritesPageSection() {
  const museums = await getMuseumsWithCache(now)

  return <FavoritesPagePresentation museums={museums} />
}
