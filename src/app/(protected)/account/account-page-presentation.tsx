'use client'

import { useState } from 'react'
import { Card } from '@/components/shadcn-ui/card'
import { Button } from '@/components/shadcn-ui/button'
import { Badge } from '@/components/shadcn-ui/badge'
import { Skeleton } from '@/components/shadcn-ui/skeleton'
import { AccountEditForm } from '@/app/(protected)/account/_components/account-edit-form'
import { LinkedProvidersSection } from '@/app/(protected)/account/_components/linked-providers-section'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/store/auth'
import { useRequireAuth } from '@/hooks/use-require-auth'
import { subscriptionTierAtom } from '@/store/subscription'

export function AccountPagePresentation() {
  const { loading } = useRequireAuth('/account')
  const user = useAtomValue(userAtom)
  const subscriptionTier = useAtomValue(subscriptionTierAtom)
  const [isEditing, setIsEditing] = useState(false)

  if (loading || !user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
        <Skeleton className="h-8 w-48" />

        <div className="mt-8 space-y-6">
          {/* User Info Skeleton */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-16" />
            </div>
            <div className="mt-6 space-y-5">
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-1 h-6 w-40" />
              </div>
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-1 h-5 w-full" />
              </div>
            </div>
          </Card>

          {/* Login Methods Skeleton */}
          <Card className="p-6">
            <Skeleton className="h-6 w-32" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </Card>

          {/* Subscription Skeleton */}
          <Card className="p-6">
            <Skeleton className="h-6 w-24" />
            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-xl px-4 py-8 md:py-12 mx-auto">
      <h1 className="text-xl font-bold pl-1">アカウント設定</h1>

      <div className="mt-5 space-y-6">
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
      </div>
    </div>
  )
}
