'use client'

import { useState } from 'react'
import { unlink } from 'firebase/auth'
import { auth } from '@/lib/firebase-client'
import { getAuthErrorMessage, getProviderDisplayName } from '@/lib/auth/provider-utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/shadcn-ui/dialog'
import { Button } from '@/components/shadcn-ui/button'

interface UnlinkProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  providerId: string
  providerEmail: string | null
}

export function UnlinkProviderDialog({
  open,
  onOpenChange,
  providerId,
  providerEmail,
}: UnlinkProviderDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUnlink = async () => {
    setError(null)

    if (!auth.currentUser) {
      setError('ログインしていません')
      return
    }

    setIsLoading(true)

    try {
      await unlink(auth.currentUser, providerId)

      // Reload user to get updated provider data
      await auth.currentUser.reload()

      // Close dialog
      onOpenChange(false)
    } catch (err) {
      console.error('Provider unlink error:', err)
      const errorCode = (err as { code?: string }).code || ''
      setError(getAuthErrorMessage(errorCode))
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen)
      if (!newOpen) {
        setError(null)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ログイン方法の連携解除</DialogTitle>
          <DialogDescription>
            以下のログイン方法の連携を解除してもよろしいですか？
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md bg-muted p-4">
          <div className="text-sm font-medium">{getProviderDisplayName(providerId)}</div>
          {providerEmail && (
            <div className="mt-1 text-sm text-muted-foreground">{providerEmail}</div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          連携を解除すると、この方法ではログインできなくなります。
        </p>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button type="button" variant="destructive" onClick={handleUnlink} disabled={isLoading}>
            {isLoading ? '解除中...' : '連携を解除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
