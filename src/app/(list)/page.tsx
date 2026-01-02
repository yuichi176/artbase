import TopPageSection from '@/app/(list)/_components/TopPageSection'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function TopPage() {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <TopPageSection />
    </Suspense>
  )
}
