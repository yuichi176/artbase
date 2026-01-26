'use client'

import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { firebaseUserAtom, isAuthenticatedAtom } from '@/store/auth'

/**
 * Custom hook to fetch and manage user's bookmarked exhibition IDs
 */
export function useBookmarks() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const firebaseUser = useAtomValue(firebaseUserAtom)
  const [bookmarkedExhibitionIds, setBookmarkedExhibitionIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !firebaseUser) {
      setBookmarkedExhibitionIds(new Set())
      setLoading(false)
      return
    }

    async function fetchBookmarks() {
      try {
        if (!firebaseUser) {
          setBookmarkedExhibitionIds(new Set())
          setLoading(false)
          return
        }

        const idToken = await firebaseUser.getIdToken()
        const response = await fetch('/api/bookmarks', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch bookmarks')
        }

        const data = await response.json()
        setBookmarkedExhibitionIds(new Set(data.exhibitionIds))
        setError(null)
      } catch (err) {
        console.error('Error fetching bookmarks:', err)
        setError('ブックマークの取得に失敗しました')
        setBookmarkedExhibitionIds(new Set())
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [isAuthenticated, firebaseUser])

  const toggleBookmark = (exhibitionId: string, isBookmarked: boolean) => {
    setBookmarkedExhibitionIds((prev) => {
      const next = new Set(prev)
      if (isBookmarked) {
        next.add(exhibitionId)
      } else {
        next.delete(exhibitionId)
      }
      return next
    })
  }

  return {
    bookmarkedExhibitionIds,
    loading,
    error,
    toggleBookmark,
  }
}
