'use client'

import { useState } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
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

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
}

export function ChangePasswordDialog({ open, onOpenChange, userEmail }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationError(null)
    setSuccess(false)

    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setValidationError('すべての項目を入力してください')
      return
    }

    if (newPassword !== confirmPassword) {
      setValidationError('新しいパスワードが一致しません')
      return
    }

    if (currentPassword === newPassword) {
      setValidationError('現在のパスワードと同じパスワードは設定できません')
      return
    }

    if (!auth.currentUser) {
      setError('ログインしていません')
      return
    }

    setIsLoading(true)

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(userEmail, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)

      // Update password
      await updatePassword(auth.currentUser, newPassword)

      // Show success message
      setSuccess(true)

      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange(false)
        // Reset form
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setSuccess(false)
      }, 2000)
    } catch (err) {
      console.error('Password change error:', err)
      const errorCode = (err as { code?: string }).code || ''

      // Custom error message for wrong password
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        setError('現在のパスワードが正しくありません')
      } else {
        setError(getAuthErrorMessage(errorCode))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading && !success) {
      onOpenChange(newOpen)
      if (!newOpen) {
        // Reset form when closing
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setError(null)
        setValidationError(null)
        setSuccess(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>パスワードを変更</DialogTitle>
          <DialogDescription>
            現在のパスワードを入力して、新しいパスワードを設定してください。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">現在のパスワード</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="現在のパスワード"
              disabled={isLoading || success}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">新しいパスワード</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="新しいパスワードを入力"
              disabled={isLoading || success}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">新しいパスワード（確認）</Label>
            <Input
              id="confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="新しいパスワードを再入力"
              disabled={isLoading || success}
              required
            />
          </div>

          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
              パスワードを変更しました
            </div>
          )}

          {(error || validationError) && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error || validationError}
            </div>
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
              {isLoading ? '変更中...' : '変更'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
