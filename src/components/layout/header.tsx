import { ModeToggle } from '@/components/mode-toggle'
import { Logo } from '@/components/icon/Logo'
import { AuthButton } from '@/components/auth/auth-button'
import { cn } from '@/utils/shadcn'
import Link from 'next/link'

export const Header = ({ className }: { className?: string }) => {
  return (
    <header
      className={cn(
        'w-full bg-background border-b border-border flex items-center p-4 md:px-6',
        className,
      )}
    >
      <div className="grow pt-2">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <AuthButton />
        <ModeToggle />
      </div>
    </header>
  )
}
