'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { signOut } from '@/hooks/use-auth'
import { userAtom, userDisplayNameAtom } from '@/store/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu'
import { UserAvatar } from './user-avatar'
import { Lock } from 'lucide-react'
import { cn } from '@/utils/shadcn'

export function UserMenu() {
  const user = useAtomValue(userAtom)
  const displayName = useAtomValue(userDisplayNameAtom)
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    try {
      setIsSigningOut(true)
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      setIsSigningOut(false)
    }
  }

  if (!user) return null

  const isProPlan = user.subscriptionTier === 'pro'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <UserAvatar
            uid={user.uid}
            photoURL={user.photoURL}
            displayName={user.displayName}
            className="h-8 w-8"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate py-2">{displayName || 'ユーザー'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="py-2">
            アカウント設定
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites" className="py-2">
            お気に入り
          </Link>
        </DropdownMenuItem>
        {isProPlan ? (
          <DropdownMenuItem asChild>
            <Link href="/bookmarks" className="py-2">
              ブックマーク
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => router.push('/pricing')}
            className="cursor-pointer opacity-60 py-2"
          >
            <div className="flex items-center justify-between w-full">
              <span>ブックマーク</span>
              <Lock className="w-4 h-4 ml-2" />
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut} className="py-2">
          {isSigningOut ? 'ログアウト中...' : 'ログアウト'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
