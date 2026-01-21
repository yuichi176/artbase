import 'server-only'

import { auth } from '@/lib/firebase-admin'
import type { DecodedIdToken } from 'firebase-admin/auth'

/**
 * Verify Firebase ID token from Authorization header
 * @param request - Next.js request object
 * @returns Decoded token with user information
 * @throws Error if token is missing or invalid
 */
export async function verifyAuthToken(request: Request): Promise<DecodedIdToken> {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No authentication token provided')
  }

  const token = authHeader.split('Bearer ')[1]

  if (!token) {
    throw new Error('Invalid token format')
  }

  try {
    const decodedToken = await auth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error('Token verification failed:', error)
    throw new Error('Invalid or expired token')
  }
}
