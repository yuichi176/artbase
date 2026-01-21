'use client'

import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { firebaseUserAtom } from '@/store/auth'
import {
  isEmailPasswordLinked,
  isGoogleLinked,
  getEmailPasswordEmail,
  getGoogleEmail,
  canUnlinkProvider,
  PROVIDER_IDS,
} from '@/lib/auth/provider-utils'
import { Card } from '@/components/shadcn-ui/card'
import { Button } from '@/components/shadcn-ui/button'
import { LinkEmailPasswordDialog } from './link-email-password-dialog'
import { LinkGoogleButton } from './link-google-button'
import { UnlinkProviderDialog } from './unlink-provider-dialog'
import { Mail } from 'lucide-react'

export function LinkedProvidersSection() {
  const firebaseUser = useAtomValue(firebaseUserAtom)
  const [isEmailPasswordDialogOpen, setIsEmailPasswordDialogOpen] = useState(false)
  const [unlinkDialogState, setUnlinkDialogState] = useState<{
    open: boolean
    providerId: string
    providerEmail: string | null
  }>({
    open: false,
    providerId: '',
    providerEmail: null,
  })

  if (!firebaseUser) {
    return null
  }

  const hasEmailPassword = isEmailPasswordLinked(firebaseUser)
  const hasGoogle = isGoogleLinked(firebaseUser)
  const emailPasswordEmail = getEmailPasswordEmail(firebaseUser)
  const googleEmail = getGoogleEmail(firebaseUser)
  const canUnlink = canUnlinkProvider(firebaseUser)

  const handleOpenUnlinkDialog = (providerId: string, providerEmail: string | null) => {
    setUnlinkDialogState({
      open: true,
      providerId,
      providerEmail,
    })
  }

  const handleCloseUnlinkDialog = () => {
    setUnlinkDialogState({
      open: false,
      providerId: '',
      providerEmail: null,
    })
  }

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
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">連携済みアカウント</div>
                    <div className="mt-1 font-medium">{googleEmail}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenUnlinkDialog(PROVIDER_IDS.GOOGLE, googleEmail)}
                    disabled={!canUnlink}
                    className="text-destructive hover:text-destructive"
                  >
                    連携解除
                  </Button>
                </div>
                {!canUnlink && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    ※最後のログイン方法は解除できません
                  </p>
                )}
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
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">連携済みメールアドレス</div>
                    <div className="mt-1 font-medium">{emailPasswordEmail}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleOpenUnlinkDialog(PROVIDER_IDS.EMAIL_PASSWORD, emailPasswordEmail)
                    }
                    disabled={!canUnlink}
                    className="text-destructive hover:text-destructive"
                  >
                    連携解除
                  </Button>
                </div>
                {!canUnlink && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    ※最後のログイン方法は解除できません
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEmailPasswordDialogOpen(true)}
                  className="justify-start gap-2"
                >
                  <Mail className="size-5" />
                  メールアドレスログインを追加
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Email/Password Link Dialog */}
      <LinkEmailPasswordDialog
        open={isEmailPasswordDialogOpen}
        onOpenChange={setIsEmailPasswordDialogOpen}
      />

      {/* Unlink Provider Dialog */}
      <UnlinkProviderDialog
        open={unlinkDialogState.open}
        onOpenChange={handleCloseUnlinkDialog}
        providerId={unlinkDialogState.providerId}
        providerEmail={unlinkDialogState.providerEmail}
      />
    </>
  )
}
