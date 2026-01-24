'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { SignInForm } from '../_components/sign-in-form'

interface SignInPagePresentationProps {
  redirectTo: string
}

export function SignInPagePresentation({ redirectTo }: SignInPagePresentationProps) {
  return (
    <div className="flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ログイン</h1>
          <p className="mt-2 text-sm text-muted-foreground">Artlyst へようこそ</p>
        </div>

        <Suspense fallback={<div className="space-y-4">読み込み中...</div>}>
          <SignInForm redirectTo={redirectTo} />
        </Suspense>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">アカウントをお持ちでない方は </span>
          <Link href="/signup" className="font-medium text-primary hover:underline">
            新規登録
          </Link>
        </div>
      </div>
    </div>
  )
}
