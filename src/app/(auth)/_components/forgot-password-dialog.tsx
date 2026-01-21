'use client'

import { useEffect, useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase-client'
import { getAuthErrorMessage } from '@/lib/auth/provider-utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/shadcn-ui/dialog'
import { Input } from '@/components/shadcn-ui/input'
import { Label } from '@/components/shadcn-ui/label'
import { Button } from '@/components/shadcn-ui/button'

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultEmail?: string
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  defaultEmail = '',
}: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!email) {
      setError('メールアドレスを入力してください')
      return
    }

    if (!auth) {
      setError('認証サービスが初期化されていません')
      return
    }

    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)

      // Close dialog after 3 seconds on success
      setTimeout(() => {
        onOpenChange(false)
        // Reset form
        setEmail('')
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Password reset email error:', err)
      const errorCode = (err as { code?: string }).code || ''
      setError(getAuthErrorMessage(errorCode))
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading && !success) {
      onOpenChange(newOpen)
      if (!newOpen) {
        // Reset form when closing
        setEmail(defaultEmail)
        setError(null)
        setSuccess(false)
      }
    }
  }

  // Update email when defaultEmail changes and dialog opens
  useEffect(() => {
    if (open) {
      setEmail(defaultEmail)
    }
  }, [open, defaultEmail])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>パスワードをお忘れの場合</DialogTitle>
          <DialogDescription>
            登録済みのメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">メールアドレス</Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isLoading || success}
              required
            />
          </div>

          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
              パスワード再設定用のメールを送信しました。メールをご確認ください。
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading || success}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading || success}>
              {isLoading ? '送信中...' : '送信'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
