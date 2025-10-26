import TopPageSection from '@/app/_components/TopPageSection'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function TopPage() {
  return (
    <div>
      <h1 className="font-ubuntu font-bold text-5xl mb-10">Artbase Tokyo</h1>
      <Suspense fallback={<p>読み込み中...</p>}>
        <TopPageSection />
      </Suspense>
    </div>
  )
}
