import type { Metadata } from 'next'
import './globals.css'
import { Ubuntu, Noto_Sans_JP } from 'next/font/google'
import { clsx } from 'clsx'

export const metadata: Metadata = {
  title: 'Artbase Tokyo',
  description: '東京で開催中の展覧会情報をまとめてチェックできるサービス',
}

const ubuntu = Ubuntu({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400', '700'],
  variable: '--font-ubuntu',
})

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
    <html lang="ja" className={clsx(ubuntu.className, notoSansJp.className)}>
      <body>{children}</body>
    </html>
  )
}
