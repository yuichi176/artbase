'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/shadcn-ui/button'
import { UserMenu } from './user-menu'

export function AuthButton() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
  }

  if (isAuthenticated) {
    return <UserMenu />
  }

  return (
    <Button asChild size="sm">
      <Link href="/signin">ログイン</Link>
    </Button>
  )
}
