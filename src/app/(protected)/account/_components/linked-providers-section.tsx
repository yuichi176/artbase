'use client'

import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { firebaseUserAtom } from '@/store/auth'
import {
  isEmailPasswordLinked,
  isGoogleLinked,
  getEmailPasswordEmail,
  getGoogleEmail,
} from '@/lib/auth/provider-utils'
import { Card } from '@/components/shadcn-ui/card'
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
  const emailPasswordEmail = getEmailPasswordEmail(firebaseUser)
  const googleEmail = getGoogleEmail(firebaseUser)

  return (
    <>
      <Card className="p-6">
        <h2 className="text-lg font-semibold">ログイン方法</h2>

        <div className="space-y-6">
          {/* Google Login Section */}
          <div>
            <h3 className="text-sm font-bold">Googleログイン</h3>
            {hasGoogle ? (
              <div className="mt-2">
                <div className="text-sm text-muted-foreground">連携済みアカウント</div>
                <div className="mt-1 font-medium">{googleEmail}</div>
              </div>
            ) : (
              <div className="mt-3">
                <LinkGoogleButton />
              </div>
            )}
          </div>

          {/* Email/Password Login Section */}
          <div>
            <h3 className="text-sm font-bold">メールアドレスログイン</h3>
            {hasEmailPassword ? (
              <div className="mt-2">
                <div className="text-sm text-muted-foreground">連携済みメールアドレス</div>
                <div className="mt-1 font-medium">{emailPasswordEmail}</div>
              </div>
            ) : (
              <div className="mt-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEmailPasswordDialogOpen(true)}
                  className="w-full justify-start"
                >
                  メール/パスワードを追加
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Email/Password Dialog */}
      <LinkEmailPasswordDialog
        open={isEmailPasswordDialogOpen}
        onOpenChange={setIsEmailPasswordDialogOpen}
      />
    </>
  )
}
