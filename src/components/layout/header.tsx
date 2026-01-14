import { ModeToggle } from '@/components/mode-toggle'
import { Logo } from '@/components/icon/Logo'

export const Header = () => {
  return (
    <header className="w-full h-16 bg-background border-b border-border flex items-center p-4 md:px-6">
      <div className="grow pt-2">
        <Logo />
      </div>
      <ModeToggle />
    </header>
  )
}
