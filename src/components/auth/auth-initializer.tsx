'use client'

import { useAuth } from '@/hooks/useAuth'

// Initialize authentication state globally
export function AuthInitializer() {
  useAuth()
  return null
}
