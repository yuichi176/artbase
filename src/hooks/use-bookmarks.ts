'use client'

import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { firebaseUserAtom, isAuthenticatedAtom, userAtom } from '@/store/auth'
import type { Exhibition } from '@/schema/ui/exhibition'

/**
 * Custom hook to fetch and manage user's bookmarked exhibitions
 */
export function useBookmarks() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const firebaseUser = useAtomValue(firebaseUserAtom)
  const user = useAtomValue(userAtom)

  const [bookmarkedExhibitionIds, setBookmarkedExhibitionIds] = useState<Set<string>>(new Set())
  const [bookmarkedExhibitions, setBookmarkedExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !firebaseUser || !user || user.subscriptionTier !== 'pro') {
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
        const exhibitions = data.exhibitions as Exhibition[]

        const filtered = exhibitions.filter((ex) => ex.ongoingStatus !== 'end')
        setBookmarkedExhibitions(filtered)
        setBookmarkedExhibitionIds(new Set(exhibitions.map((ex) => ex.id)))
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
  }, [isAuthenticated, firebaseUser, user])

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

    if (!isBookmarked) {
      setBookmarkedExhibitions((prev) => prev.filter((ex) => ex.id !== exhibitionId))
    }
  }

  return {
    bookmarkedExhibitionIds,
    bookmarkedExhibitions,
    loading,
    error,
    toggleBookmark,
  }
}
