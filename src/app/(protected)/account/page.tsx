'use client'

import { useRequireAuth } from '@/hooks/useRequireAuth'
import { useAuth } from '@/hooks/useAuth'
import { useAtomValue } from 'jotai'
import { subscriptionTierAtom } from '@/store/subscription'
import { Badge } from '@/components/shadcn-ui/badge'
import { Card } from '@/components/shadcn-ui/card'

export default function AccountPage() {
  const { loading } = useRequireAuth('/account')
  const { user } = useAuth()
  const subscriptionTier = useAtomValue(subscriptionTierAtom)

  if (loading || !user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-8 space-y-4">
          <div className="h-32 animate-pulse rounded bg-muted" />
          <div className="h-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">アカウント設定</h1>

      <div className="mt-8 space-y-6">
        {/* User Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold">ユーザー情報</h2>
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">メールアドレス</div>
              <div className="mt-1 font-medium">{user.email}</div>
            </div>

            {user.displayName && (
              <div>
                <div className="text-sm text-muted-foreground">表示名</div>
                <div className="mt-1 font-medium">{user.displayName}</div>
              </div>
            )}

            <div>
              <div className="text-sm text-muted-foreground">ユーザーID</div>
              <div className="mt-1 font-mono text-sm text-muted-foreground">{user.uid}</div>
            </div>
          </div>
        </Card>

        {/* Subscription Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold">プラン</h2>
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <Badge variant={subscriptionTier === 'pro' ? 'default' : 'outline'}>
                {subscriptionTier === 'pro' ? 'PRO' : 'FREE'}
              </Badge>
              <span className="text-sm text-muted-foreground">現在のプラン</span>
            </div>

            {subscriptionTier === 'free' && (
              <div className="mt-4 rounded-lg border border-dashed p-4">
                <p className="text-sm text-muted-foreground">
                  Proプランにアップグレードすると、お気に入り機能などの追加機能をご利用いただけます。
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  ※サブスクリプション機能は現在準備中です
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold">設定</h2>
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">メール通知</div>
              <div className="mt-1 font-medium">
                {user.preferences.emailNotifications ? '有効' : '無効'}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">お気に入り美術館</div>
              <div className="mt-1 font-medium">
                {user.preferences.favoriteVenues.length > 0
                  ? user.preferences.favoriteVenues.join(', ')
                  : 'なし'}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
