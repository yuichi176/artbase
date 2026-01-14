'use client'

import { ModeToggle } from '@/components/mode-toggle'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export const Header = () => {
  const { theme } = useTheme()

  return (
    <header className="w-full h-16 bg-background border-b border-border flex items-center p-4 md:px-6">
      <div className="grow pt-2">
        {theme === 'dark' ? (
          <Image src="/logo-dark.svg" alt="artlyst tokyo のロゴ" width="170" height="23" />
        ) : (
          <Image src="/logo-light.svg" alt="artlyst tokyo のロゴ" width="170" height="23" />
        )}
      </div>
      <ModeToggle />
    </header>
  )
}
