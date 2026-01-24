'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { SignUpForm } from '../_components/sign-up-form'

interface SignUpPagePresentationProps {
  redirectTo: string
}

export function SignUpPagePresentation({ redirectTo }: SignUpPagePresentationProps) {
  return (
    <div className="flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">新規登録</h1>
          <p className="mt-2 text-sm text-muted-foreground">Artlyst アカウントを作成</p>
        </div>

        <Suspense fallback={<div className="space-y-4">読み込み中...</div>}>
          <SignUpForm redirectTo={redirectTo} />
        </Suspense>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">既にアカウントをお持ちの方は </span>
          <Link href="/signin" className="font-medium text-primary hover:underline">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}
