'use client'

import { useEffect } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase-client'
import {
  firebaseUserAtom,
  userAtom,
  authLoadingAtom,
  authErrorAtom,
  isAuthenticatedAtom,
} from '@/store/auth'
import type { User } from '@/schema/user'

/**
 * Custom hook to manage Firebase authentication state
 * Syncs Firebase Auth with Firestore user data and Jotai atoms
 */
export function useAuth() {
  const setFirebaseUser = useSetAtom(firebaseUserAtom)
  const setUser = useSetAtom(userAtom)
  const setAuthLoading = useSetAtom(authLoadingAtom)
  const setAuthError = useSetAtom(authErrorAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const user = useAtomValue(userAtom)

  useEffect(() => {
    if (!auth) return

    setAuthLoading(true)

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        try {
          setFirebaseUser(firebaseUser)

          if (firebaseUser) {
            // User is signed in, fetch user data from Firestore
            const idToken = await firebaseUser.getIdToken()
            const response = await fetch('/api/auth/user', {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            })

            if (!response.ok) {
              throw new Error('Failed to fetch user data')
            }

            const userData: User = await response.json()
            setUser(userData)
            setAuthError(null)
          } else {
            // User is signed out
            setUser(null)
            setAuthError(null)
          }
        } catch (error) {
          console.error('Auth error:', error)
          setAuthError(error instanceof Error ? error.message : 'Authentication failed')
          setUser(null)
        } finally {
          setAuthLoading(false)
        }
      },
      (error) => {
        console.error('Auth state change error:', error)
        setAuthError(error.message)
        setAuthLoading(false)
      },
    )

    return () => unsubscribe()
    // Jotai's useSetAtom returns stable references that don't change between renders
    // The effect should only run once on mount to set up the auth listener
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    user,
    isAuthenticated,
    loading: useAtomValue(authLoadingAtom),
    error: useAtomValue(authErrorAtom),
  }
}

// Sign out the current user
export async function signOut() {
  if (!auth) {
    throw new Error('Firebase auth not initialized')
  }
  await firebaseSignOut(auth)
}
