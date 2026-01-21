'use client'

import { useState } from 'react'
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth'
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
import { useAtomValue } from 'jotai'
import { firebaseUserAtom } from '@/store/auth'

interface LinkEmailPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LinkEmailPasswordDialog({ open, onOpenChange }: LinkEmailPasswordDialogProps) {
  const firebaseUser = useAtomValue(firebaseUserAtom)
  const [email, setEmail] = useState(firebaseUser?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationError(null)

    // Client-side validation
    if (!email || !password || !confirmPassword) {
      setValidationError('すべての項目を入力してください')
      return
    }

    if (password.length < 6) {
      setValidationError('パスワードは6文字以上で設定してください')
      return
    }

    if (password !== confirmPassword) {
      setValidationError('パスワードが一致しません')
      return
    }

    if (!auth?.currentUser) {
      setError('ログインしていません')
      return
    }

    setIsLoading(true)

    try {
      const credential = EmailAuthProvider.credential(email, password)
      await linkWithCredential(auth.currentUser, credential)

      // Reload user to get updated provider data
      await auth.currentUser.reload()

      // Close dialog and reset form
      onOpenChange(false)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error('Email/Password linking error:', err)
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
        // Reset form when closing
        setEmail(firebaseUser?.email || '')
        setPassword('')
        setConfirmPassword('')
        setError(null)
        setValidationError(null)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>メール/パスワードを追加</DialogTitle>
          <DialogDescription>
            メールアドレスとパスワードでもログインできるようになります。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上"
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">パスワード（確認）</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="パスワードを再入力"
              disabled={isLoading}
              required
            />
          </div>

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
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '追加中...' : '追加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
