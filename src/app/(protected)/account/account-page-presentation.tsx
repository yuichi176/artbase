'use client'

import { useState } from 'react'
import { Card } from '@/components/shadcn-ui/card'
import { Button } from '@/components/shadcn-ui/button'
import { Badge } from '@/components/shadcn-ui/badge'
import { AccountEditForm } from '@/app/(protected)/account/_components/account-edit-form'
import { LinkedProvidersSection } from '@/app/(protected)/account/_components/linked-providers-section'
import type { User, SubscriptionTier } from '@/schema/user'

interface AccountPagePresentationProps {
  user: User
  subscriptionTier: SubscriptionTier
}

export function AccountPagePresentation({ user, subscriptionTier }: AccountPagePresentationProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold">アカウント設定</h1>

      <div className="mt-8 space-y-6">
        {/* User Info */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">ユーザー情報</h2>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                編集
              </Button>
            )}
          </div>

          {isEditing ? (
            <AccountEditForm
              user={user}
              onSuccess={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-5">
              <div>
                <div className="text-sm text-muted-foreground">表示名</div>
                <div className="mt-1 font-medium">{user.displayName || '未設定'}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">ユーザーID</div>
                <div className="mt-1 break-all font-mono text-sm text-muted-foreground">
                  {user.uid}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Login Methods */}
        <LinkedProvidersSection />

        {/* Subscription Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold">プラン</h2>
          <div className="flex items-center gap-3">
            <Badge variant={subscriptionTier === 'pro' ? 'default' : 'outline'}>
              {subscriptionTier === 'pro' ? 'PRO' : 'FREE'}
            </Badge>
            <span className="text-sm text-muted-foreground">現在のプラン</span>
          </div>

          {subscriptionTier === 'free' && (
            <div className="rounded-lg border border-dashed p-4">
              <p className="text-sm text-muted-foreground">
                Proプランにアップグレードすると、お気に入り機能などの追加機能をご利用いただけます。
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                ※サブスクリプション機能は現在準備中です
              </p>
            </div>
          )}
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold">設定</h2>
          <div className="space-y-3">
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
