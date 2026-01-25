import { BookmarksPagePresentation } from './bookmarks-page-presentation'
import { getMuseumsWithCache } from '@/lib/data/museums'

const now = new Date()

export default async function BookmarksPageSection() {
  const museums = await getMuseumsWithCache(now)

  return <BookmarksPagePresentation museums={museums} />
}
