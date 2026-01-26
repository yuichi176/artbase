'use client'

import { startTransition, useActionState, useOptimistic } from 'react'
import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { firebaseUserAtom, isAuthenticatedAtom } from '@/store/auth'
import { cn } from '@/utils/shadcn'

interface FavoriteButtonProps {
  museumId: string
  isFavorite: boolean
  onToggle?: (favorited: boolean) => void
  className?: string
}

export function FavoriteButton({
  museumId,
  isFavorite,
  onToggle,
  className = '',
}: FavoriteButtonProps) {
  const router = useRouter()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const firebaseUser = useAtomValue(firebaseUserAtom)

  // Optimistic UI state for favorite flag
  const [optimisticIsFavorite, setOptimisticFavorite] = useOptimistic(
    isFavorite,
    (current, next: boolean) => next,
  )

  // Action that performs the actual toggle
  const [, toggleFavorite, isPending] = useActionState(async () => {
    if (!isAuthenticated || !firebaseUser) {
      router.push('/signin')

      return { ok: false, error: 'Unauthenticated' }
    }

    const nextFavorite = !optimisticIsFavorite

    // Optimistic toggle inside the action
    setOptimisticFavorite(nextFavorite)

    try {
      const idToken = await firebaseUser.getIdToken()
      if (!idToken) {
        throw new Error('Failed to get authentication token')
      }

      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ museumId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 403) {
          // TODO: Show a nicer UI message instead of alert
          alert(errorData.message)
        } else if (response.status === 401) {
          router.push('/signin')
        } else {
          throw new Error(errorData.message || 'Failed to toggle favorite')
        }

        // Rollback optimistic state on error
        setOptimisticFavorite(!nextFavorite)

        return { ok: false, error: 'Request failed' }
      }

      // Call the optional callback with the new state
      if (onToggle) {
        onToggle(nextFavorite)
      }

      return { ok: true }
    } catch {
      // TODO: Show a nicer UI message instead of alert
      alert('お気に入りの更新に失敗しました。もう一度お試しください。')

      // Rollback on exception as well
      setOptimisticFavorite(!nextFavorite)

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

    startTransition(() => {
      toggleFavorite()
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn('transition-colors disabled:opacity-50', className)}
      title={optimisticIsFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
      aria-label={optimisticIsFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <Star
        className={cn(
          'w-4 h-4',
          optimisticIsFavorite
            ? 'text-yellow-500 fill-yellow-500'
            : 'text-gray-400 hover:text-yellow-500',
        )}
      />
    </button>
  )
}
