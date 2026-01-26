import { BookmarksPagePresentation } from './bookmarks-page-presentation'
import { getAllMuseumsWithCache } from '@/lib/data/museums'

const now = new Date()

export default async function BookmarksPageSection() {
  const museums = await getAllMuseumsWithCache(now)

  return <BookmarksPagePresentation museums={museums} />
}
