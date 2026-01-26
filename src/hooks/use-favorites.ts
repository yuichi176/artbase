'use client'

import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { firebaseUserAtom, isAuthenticatedAtom } from '@/store/auth'

/**
 * Custom hook to fetch and manage user's favorite museums
 */
export function useFavorites() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const firebaseUser = useAtomValue(firebaseUserAtom)

  const [favoriteMuseumIds, setFavoriteMuseumIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !firebaseUser) {
      setFavoriteMuseumIds(new Set())
      setLoading(false)
      return
    }

    async function fetchFavorites() {
      try {
        if (!firebaseUser) {
          setFavoriteMuseumIds(new Set())
          setLoading(false)
          return
        }

        const idToken = await firebaseUser.getIdToken()
        const response = await fetch('/api/favorites', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch favorites')
        }

        const data = await response.json()
        const museumIds = data.museumIds as string[]
        setFavoriteMuseumIds(new Set(museumIds))
        setError(null)
      } catch (err) {
        console.error('Error fetching favorites:', err)
        setError('お気に入りの取得に失敗しました')
        setFavoriteMuseumIds(new Set())
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [isAuthenticated, firebaseUser])

  const toggleFavorite = (museumId: string, isFavorited: boolean) => {
    setFavoriteMuseumIds((prev) => {
      const next = new Set(prev)
      if (isFavorited) {
        next.add(museumId)
      } else {
        next.delete(museumId)
      }
      return next
    })
  }

  return {
    favoriteMuseumIds,
    loading,
    error,
    toggleFavorite,
  }
}
