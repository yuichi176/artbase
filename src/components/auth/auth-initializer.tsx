'use client'

import { useAuth } from '@/hooks/use-auth'

// Initialize authentication state globally
export function AuthInitializer() {
  useAuth()
  return null
}
