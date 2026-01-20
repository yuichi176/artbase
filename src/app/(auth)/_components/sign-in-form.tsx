'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase-client'
import { Button } from '@/components/shadcn-ui/button'
import { Input } from '@/components/shadcn-ui/input'
import { Label } from '@/components/shadcn-ui/label'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleEmailSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!auth) {
        throw new Error('Firebase auth not initialized')
      }

      await signInWithEmailAndPassword(auth, email, password)
      router.push(redirectTo)
    } catch (err) {
      console.error('Sign in error:', err)
      if (err instanceof Error) {
        if (err.message.includes('invalid-credential')) {
          setError('メールアドレスまたはパスワードが正しくありません')
        } else if (err.message.includes('user-not-found')) {
          setError('ユーザーが見つかりません')
        } else if (err.message.includes('wrong-password')) {
          setError('パスワードが正しくありません')
        } else {
          setError('ログインに失敗しました')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setError(null)
    setIsLoading(true)

    try {
      if (!auth) {
        throw new Error('Firebase auth not initialized')
      }

      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push(redirectTo)
    } catch (err) {
      console.error('Google sign in error:', err)
      if (err instanceof Error) {
        if (err.message.includes('popup-closed-by-user')) {
          setError('ログインがキャンセルされました')
        } else {
          setError('Googleログインに失敗しました')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">または</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        Googleでログイン
      </Button>
    </div>
  )
}
