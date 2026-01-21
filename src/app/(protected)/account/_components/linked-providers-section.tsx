'use client'

import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { firebaseUserAtom } from '@/store/auth'
import {
  isEmailPasswordLinked,
  isGoogleLinked,
  PROVIDER_IDS,
  getProviderDisplayName,
} from '@/lib/auth/provider-utils'
import { Card } from '@/components/shadcn-ui/card'
import { Badge } from '@/components/shadcn-ui/badge'
import { Button } from '@/components/shadcn-ui/button'
import { LinkEmailPasswordDialog } from './link-email-password-dialog'
import { LinkGoogleButton } from './link-google-button'

export function LinkedProvidersSection() {
  const firebaseUser = useAtomValue(firebaseUserAtom)
  const [isEmailPasswordDialogOpen, setIsEmailPasswordDialogOpen] = useState(false)

  if (!firebaseUser) {
    return null
  }

  const hasEmailPassword = isEmailPasswordLinked(firebaseUser)
  const hasGoogle = isGoogleLinked(firebaseUser)

  return (
    <>
      <Card className="p-6">
        <h2 className="text-lg font-semibold">ログイン方法</h2>

        {/* Current linked providers */}
        <div className="mt-4">
          <div className="text-sm text-muted-foreground">現在のログイン方法</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {hasEmailPassword && (
              <Badge variant="outline">{getProviderDisplayName(PROVIDER_IDS.EMAIL_PASSWORD)}</Badge>
            )}
            {hasGoogle && (
              <Badge variant="outline">{getProviderDisplayName(PROVIDER_IDS.GOOGLE)}</Badge>
            )}
          </div>
        </div>

        {/* Add new provider section - only show if not all providers are linked */}
        {(!hasEmailPassword || !hasGoogle) && (
          <>
            <div className="my-4 border-t" />

            <div>
              <div className="text-sm text-muted-foreground">ログイン方法を追加</div>
              <div className="mt-3 space-y-3">
                {!hasEmailPassword && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEmailPasswordDialogOpen(true)}
                    className="w-full justify-start"
                  >
                    メール/パスワードを追加
                  </Button>
                )}

                {!hasGoogle && <LinkGoogleButton />}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Email/Password Dialog */}
      <LinkEmailPasswordDialog
        open={isEmailPasswordDialogOpen}
        onOpenChange={setIsEmailPasswordDialogOpen}
      />
    </>
  )
}
