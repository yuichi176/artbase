import type { Metadata } from 'next'
import './globals.css'
import { Noto_Sans_JP } from 'next/font/google'
import { clsx } from 'clsx'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: 'Evently',
  description: '開催中の展覧会情報をまとめてチェックできるサービス',
}

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-jp',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={clsx(notoSansJp.className)}>
      <body>
        <Header />
        <main className="p-2 md:p-4 bg-gray-50">{children}</main>
      </body>
    </html>
  )
}
