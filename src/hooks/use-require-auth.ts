'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { isAuthenticatedAtom, authLoadingAtom } from '@/store/auth'

/**
 * Custom hook to protect routes that require authentication
 * Redirects to sign-in page if user is not authenticated
 *
 * Note: This hook reads authentication state that has been initialized
 * by AuthInitializer in the root layout. It does not set up auth listeners.
 *
 * @param redirectTo - URL to redirect to after sign-in (optional)
 */
export function useRequireAuth(redirectTo?: string) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const loading = useAtomValue(authLoadingAtom)
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
