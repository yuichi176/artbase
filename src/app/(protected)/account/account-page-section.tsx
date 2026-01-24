'use client'

import { useRequireAuth } from '@/hooks/use-require-auth'
import { useAuth } from '@/hooks/use-auth'
import { useAtomValue } from 'jotai'
import { subscriptionTierAtom } from '@/store/subscription'
import { AccountPagePresentation } from '@/app/(protected)/account/account-page-presentation'

export function AccountPageSection() {
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

  return <AccountPagePresentation user={user} subscriptionTier={subscriptionTier} />
}
