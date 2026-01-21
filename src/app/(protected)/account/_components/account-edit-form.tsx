'use client'

import { useState, FormEvent } from 'react'
import { useSetAtom } from 'jotai'
import { auth } from '@/lib/firebase-client'
import { userAtom } from '@/store/auth'
import type { User } from '@/schema/user'
import { Button } from '@/components/shadcn-ui/button'
import { Input } from '@/components/shadcn-ui/input'
import { Label } from '@/components/shadcn-ui/label'

interface AccountEditFormProps {
  user: User
  onSuccess?: () => void
  onCancel?: () => void
}

export function AccountEditForm({ user, onSuccess, onCancel }: AccountEditFormProps) {
  const setUser = useSetAtom(userAtom)
  const [displayName, setDisplayName] = useState(user.displayName || '')
  const [email, setEmail] = useState(user.email)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!auth?.currentUser) {
        throw new Error('Not authenticated')
      }

      // Get ID token
      const idToken = await auth.currentUser.getIdToken()

      // Prepare update data
      const updates: {
        displayName?: string | null
        email?: string
      } = {}

      if (displayName !== user.displayName) {
        updates.displayName = displayName || null
      }

      if (email !== user.email) {
        updates.email = email
      }

      // Skip if no changes
      if (Object.keys(updates).length === 0) {
        onCancel?.()
        return
      }

      // Update user profile
      const response = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      const updatedUser: User = await response.json()
      setUser(updatedUser)

      // If email was changed, reload the page to refresh auth state
      if (updates.email) {
        window.location.reload()
        return
      }

      onSuccess?.()
    } catch (err) {
      console.error('Profile update error:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('プロフィールの更新に失敗しました')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">表示名</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="表示名を入力"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              メールアドレスを変更するとログイン情報が更新されます
            </p>
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '更新中...' : '保存'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            キャンセル
          </Button>
        </div>
      </div>
    </form>
  )
}
