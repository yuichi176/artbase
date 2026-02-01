'use client'

import { useState } from 'react'
import { GoogleAuthProvider, linkWithPopup } from 'firebase/auth'
import { useSetAtom } from 'jotai'
import { auth } from '@/lib/firebase-client'
import { getAuthErrorMessage } from '@/lib/auth/provider-utils'
import { firebaseUserAtom } from '@/store/auth'
import { Button } from '@/components/shadcn-ui/button'

interface LinkGoogleButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function LinkGoogleButton({ onSuccess, onError }: LinkGoogleButtonProps) {
  const setFirebaseUser = useSetAtom(firebaseUserAtom)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLinkGoogle = async () => {
    setError(null)

    if (!auth?.currentUser) {
      const errorMsg = 'ログインしていません'
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    setIsLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      await linkWithPopup(auth.currentUser, provider)

      // Reload user to get updated provider data
      await auth.currentUser.reload()

      const refreshedUser = auth.currentUser

      // Clone the user object to ensure a new reference so Jotai detects the change and re-renders
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFirebaseUser(refreshedUser ? ({ ...refreshedUser } as any) : null)

      // Call success callback
      onSuccess?.()
    } catch (err) {
      console.error('Google linking error:', err)
      const errorCode = (err as { code?: string }).code || ''
      const errorMsg = getAuthErrorMessage(errorCode)
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={handleLinkGoogle}
        disabled={isLoading}
        className="justify-start gap-2"
      >
        <svg className="size-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {isLoading ? '連携中...' : 'Googleアカウントを連携'}
      </Button>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}
    </div>
  )
}
