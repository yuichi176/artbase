import type { Metadata } from 'next'
import { PricingPageSection } from './pricing-page-section'

export const metadata: Metadata = {
  title: 'プラン | Artlyst',
  description: 'Artlyst Tokyo のプランと料金をご確認ください',
}

export default function PricingPage() {
  return <PricingPageSection />
}
