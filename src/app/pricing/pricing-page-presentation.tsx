'use client'

import { Card } from '@/components/shadcn-ui/card'
import { Button } from '@/components/shadcn-ui/button'
import { Badge } from '@/components/shadcn-ui/badge'
import { CheckIcon } from 'lucide-react'
import Link from 'next/link'

interface PricingPagePresentationProps {
  isAuthenticated: boolean
}

export function PricingPagePresentation({ isAuthenticated }: PricingPagePresentationProps) {
  async function handleSubscribe() {
    if (!isAuthenticated) {
      window.location.href = '/signin?redirect=/pricing'
      return
    }
    // TODO: Implement subscription flow
    alert('サブスクリプション機能は現在開発中です。')
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Artlyst Tokyo プラン</h1>
        <p className="text-lg text-muted-foreground">
          展示情報の閲覧は無料。Proプランでお気に入り機能をご利用いただけます。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="p-8 relative">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Freeプラン</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">¥0</span>
              <span className="text-muted-foreground">/月</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span>東京都内の展示情報を無制限に閲覧</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span>開催期間・美術館名で検索</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span>ジャンルでフィルタリング</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span>詳細情報・公式サイトへのリンク</span>
            </li>
          </ul>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/">無料で始める</Link>
          </Button>
        </Card>

        {/* Pro Plan */}
        <Card className="p-8 relative border-primary shadow-lg">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">おすすめ</Badge>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Proプラン</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">¥300</span>
              <span className="text-muted-foreground">/月</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold mb-3">Freeプランの全機能 +</p>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span className="font-medium">お気に入り機能</span>
            </li>
            <li className="flex items-start gap-3 ml-8">
              <span className="text-sm text-muted-foreground">
                気になる展示を保存して、いつでも確認
              </span>
            </li>
            <li className="flex items-start gap-3 ml-8">
              <span className="text-sm text-muted-foreground">
                お気に入りした展示の開催期間を見逃さない
              </span>
            </li>
          </ul>

          <Button className="w-full" onClick={handleSubscribe}>
            Proプランに登録
          </Button>

          {!isAuthenticated && (
            <p className="text-xs text-center text-muted-foreground mt-4">
              登録にはアカウント作成が必要です
            </p>
          )}
        </Card>
      </div>

      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-center">よくある質問</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">支払い方法は何が使えますか？</h3>
            <p className="text-sm text-muted-foreground">
              クレジットカード（Visa、Mastercard、American Express等）がご利用いただけます。
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">解約はいつでもできますか？</h3>
            <p className="text-sm text-muted-foreground">
              はい、いつでも解約可能です。解約後も課金期間終了までProプランをご利用いただけます。
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Freeプランに戻ることはできますか？</h3>
            <p className="text-sm text-muted-foreground">
              はい、サブスクリプションをキャンセルすると自動的にFreeプランに戻ります。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
