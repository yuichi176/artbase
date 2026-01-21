import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Noto_Sans_JP } from 'next/font/google'
import { clsx } from 'clsx'
import { Provider as JotaiProvider } from 'jotai'
import { Header } from '@/components/layout/header'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthInitializer } from '@/components/auth/auth-initializer'

// TODO: Fill in metadata fields
export const metadata: Metadata = {
  // metadataBase: new URL('https://artlyst.com'),
  title: {
    default: 'Artlyst Tokyo',
    template: '%s | Artlyst Tokyo',
  },
  description:
    'Artlyst Tokyoは、東京都内の美術館・博物館・ギャラリーで開催中・開催予定の展覧会情報を一覧・検索できるアート情報プラットフォームです。見逃したくない展覧会を効率的に探せます。',
  applicationName: 'Artlyst Tokyo',
  keywords: [
    '東京',
    '美術館',
    '博物館',
    'ギャラリー',
    '展覧会',
    'アート',
    '企画展',
    '開催中',
    '開催予定',
    'アートイベント',
    '展覧会検索',
  ],
  // openGraph: {
  //   type: 'website',
  //   url: 'https://artlyst.com',
  //   siteName: 'Artlyst Tokyo',
  //   title: 'Artlyst Tokyo | 東京の展覧会をまとめて探せるアート情報プラットフォーム',
  //   description:
  //     '東京の美術館・博物館・ギャラリーの展覧会情報を開催期間順に一覧表示。複数サイトを横断せずに、「調べる」から「選ぶ」までをスムーズにする検索プラットフォームです。',
  //   images: [
  //     {
  //       url: 'https://artlyst.tokyo/og-image.jpg',
  //       width: 1200,
  //       height: 630,
  //       alt: 'Artlyst Tokyo - 東京の展覧会情報を一覧で検索',
  //     },
  //   ],
  //   locale: 'ja_JP',
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Artlyst Tokyo | 東京の展覧会情報を一覧で検索',
  //   description:
  //     '東京都内の美術館・博物館・ギャラリーで開催中・開催予定の展覧会を一元的に検索。開催期間から探せて、気になる展示を見逃しません。',
  //   images: ['https://artlyst.tokyo/og-image.jpg'],
  // },
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     noimageindex: false,
  //     'max-snippet': -1,
  //     'max-image-preview': 'large',
  //     'max-video-preview': -1,
  //   },
  // },
  category: 'entertainment',
}

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-jp',
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={clsx(notoSansJp.className)} suppressHydrationWarning>
      <body className="relative">
        <JotaiProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthInitializer />
            <Header className="h-[var(--height-header)] z-[var(--z-index-header)] fixed" />
            <main className="px-2 md:px-4 pb-2 md:pb-2 pt-[var(--height-header)] min-h-[100dvh]">
              {children}
            </main>
          </ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}
