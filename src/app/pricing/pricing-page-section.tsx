'use client'

import { useAuth } from '@/hooks/useAuth'
import { PricingPagePresentation } from './pricing-page-presentation'

export function PricingPageSection() {
  const { isAuthenticated } = useAuth()

  return <PricingPagePresentation isAuthenticated={isAuthenticated} />
}
