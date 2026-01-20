'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

/**
 * Custom hook to protect routes that require authentication
 * Redirects to sign-in page if user is not authenticated
 *
 * @param redirectTo - URL to redirect to after sign-in (optional)
 */
export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const signInUrl = redirectTo
        ? `/signin?redirect=${encodeURIComponent(redirectTo)}`
        : '/signin'
      router.push(signInUrl)
    }
  }, [isAuthenticated, loading, router, redirectTo])

  return { isAuthenticated, loading }
}
