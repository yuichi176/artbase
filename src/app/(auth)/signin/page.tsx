import type { Metadata } from 'next'
import { SignInPageSection } from './signin-page-section'

export const metadata: Metadata = {
  title: 'ログイン | Artlyst',
  description: 'Artlyst にログイン',
}

interface SignInPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect } = await searchParams
  const redirectTo = redirect || '/'

  return <SignInPageSection redirectTo={redirectTo} />
}
