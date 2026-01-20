import { atom } from 'jotai'
import type { User as FirebaseUser } from 'firebase/auth'
import type { User } from '@/schema/user'

/**
 * Firebase Auth user (from Firebase Auth SDK)
 * null when not authenticated or loading
 */
export const firebaseUserAtom = atom<FirebaseUser | null>(null)

/**
 * Application user data (from Firestore)
 * null when not authenticated or data not yet loaded
 */
export const userAtom = atom<User | null>(null)

/**
 * Authentication loading state
 * true during initial auth check and user data fetch
 */
export const authLoadingAtom = atom<boolean>(true)

/**
 * Authentication error state
 */
export const authErrorAtom = atom<string | null>(null)

/**
 * Computed atom: is user authenticated
 */
export const isAuthenticatedAtom = atom((get) => {
  const user = get(firebaseUserAtom)
  return user !== null
})

/**
 * Computed atom: user display name or email
 */
export const userDisplayNameAtom = atom((get) => {
  const user = get(userAtom)
  if (!user) return null
  return user.displayName || user.email
})
