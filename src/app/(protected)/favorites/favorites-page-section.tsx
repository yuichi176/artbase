import { FavoritesPagePresentation } from './favorites-page-presentation'
import { getMuseumsWithCache } from '@/lib/data/museums'

export default async function FavoritesPageSection() {
  const museums = await getMuseumsWithCache()

  return <FavoritesPagePresentation museums={museums} />
}
