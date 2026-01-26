'use client'

import { startTransition, useActionState, useOptimistic } from 'react'
import { Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { userAtom, firebaseUserAtom, isAuthenticatedAtom } from '@/store/auth'
import { cn } from '@/utils/shadcn'

interface BookmarkButtonProps {
  exhibitionId: string
  isBookmarked: boolean
  onToggle?: (isBookmarked: boolean) => void
  className?: string
}

export function BookmarkButton({
  exhibitionId,
  isBookmarked,
  onToggle,
  className = '',
}: BookmarkButtonProps) {
  const router = useRouter()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const firebaseUser = useAtomValue(firebaseUserAtom)
  const user = useAtomValue(userAtom)

  // Optimistic UI state for bookmark flag
  const [optimisticIsBookmarked, setOptimisticBookmark] = useOptimistic(
    isBookmarked,
    (current, next: boolean) => next,
  )

  // Action that performs the actual toggle and syncs global user state
  const [, toggleBookmark, isPending] = useActionState(async () => {
    if (!isAuthenticated || !firebaseUser) {
      router.push('/signin')

      return { ok: false, error: 'Unauthenticated' }
    }

    // Check if user has Pro plan
    if (user?.subscriptionTier !== 'pro') {
      router.push('/pricing')

      return { ok: false, error: 'Pro plan required' }
    }

    const nextBookmark = !optimisticIsBookmarked

    // Optimistic toggle inside the action
    setOptimisticBookmark(nextBookmark)

    try {
      const idToken = await firebaseUser.getIdToken()
      if (!idToken) {
        throw new Error('Failed to get authentication token')
      }

      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ exhibitionId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 403) {
          // Redirect to pricing page for Pro plan requirement
          router.push('/pricing')
        } else if (response.status === 401) {
          router.push('/signin')
        } else {
          throw new Error(errorData.message || 'Failed to toggle bookmark')
        }

        // Rollback optimistic state on error
        setOptimisticBookmark(!nextBookmark)

        return { ok: false, error: 'Request failed' }
      }

      const result = await response.json()

      // Notify parent component of the change
      if (onToggle) {
        onToggle(result.bookmarked)
      }

      return { ok: true }
    } catch {
      alert('ブックマークの更新に失敗しました。もう一度お試しください。')

      // Rollback on exception as well
      setOptimisticBookmark(!nextBookmark)

      return { ok: false, error: 'Exception' }
    }
  }, null)

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated || !firebaseUser) {
      router.push('/signin')
      return
    }

    // Check if user has Pro plan
    if (user?.subscriptionTier !== 'pro') {
      router.push('/pricing')
      return
    }

    startTransition(() => {
      toggleBookmark()
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn('transition-colors disabled:opacity-50', className)}
      title={optimisticIsBookmarked ? 'ブックマークから削除' : 'ブックマークに追加'}
      aria-label={optimisticIsBookmarked ? 'ブックマークから削除' : 'ブックマークに追加'}
    >
      <Bookmark
        className={cn(
          'w-4 h-4',
          optimisticIsBookmarked
            ? 'text-blue-500 fill-blue-500'
            : 'text-gray-400 hover:text-blue-500',
        )}
      />
    </button>
  )
}
