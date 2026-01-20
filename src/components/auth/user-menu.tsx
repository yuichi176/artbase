'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { signOut } from '@/hooks/useAuth'
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
        <DropdownMenuLabel>{displayName || 'ユーザー'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">アカウント設定</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? 'ログアウト中...' : 'ログアウト'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
