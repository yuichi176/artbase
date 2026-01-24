import type { Metadata } from 'next'
import { SignUpPageSection } from './signup-page-section'

export const metadata: Metadata = {
  title: '新規登録 | Artlyst',
  description: 'Artlyst アカウント新規登録',
}

interface SignUpPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { redirect } = await searchParams
  const redirectTo = redirect || '/'

  return <SignUpPageSection redirectTo={redirectTo} />
}
