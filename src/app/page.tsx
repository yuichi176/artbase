import TopPageSection from '@/app/_components/TopPageSection'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function TopPage() {
  return (
    <div>
      <h1 className="font-ubuntu font-bold text-xl">Evently</h1>
      <p className="text-sm mb-3">開催中の展覧会情報をまとめて閲覧</p>
      <Suspense fallback={<p>読み込み中...</p>}>
        <TopPageSection />
      </Suspense>
    </div>
  )
}
