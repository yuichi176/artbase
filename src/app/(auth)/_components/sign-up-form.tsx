'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase-client'
import { Button } from '@/components/shadcn-ui/button'
import { Input } from '@/components/shadcn-ui/input'
import { Label } from '@/components/shadcn-ui/label'

interface SignUpFormProps {
  redirectTo: string
}

export function SignUpForm({ redirectTo }: SignUpFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleEmailSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setIsLoading(true)

    try {
      if (!auth) {
        throw new Error('Firebase auth not initialized')
      }

      await createUserWithEmailAndPassword(auth, email, password)
      router.push(redirectTo)
    } catch (err) {
      console.error('Sign up error:', err)
      if (err instanceof Error) {
        if (err.message.includes('email-already-in-use')) {
          setError('このメールアドレスは既に使用されています')
        } else if (err.message.includes('invalid-email')) {
          setError('メールアドレスの形式が正しくありません')
        } else if (err.message.includes('weak-password')) {
          setError('パスワードが弱すぎます')
        } else {
          setError('アカウント作成に失敗しました')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignUp() {
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
      console.error('Google sign up error:', err)
      if (err instanceof Error) {
        if (err.message.includes('popup-closed-by-user')) {
          setError('登録がキャンセルされました')
        } else {
          setError('Google登録に失敗しました')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleEmailSignUp} className="space-y-4">
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">パスワード（確認）</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'アカウント作成中...' : 'アカウント作成'}
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
        onClick={handleGoogleSignUp}
        disabled={isLoading}
      >
        Googleで登録
      </Button>
    </div>
  )
}
