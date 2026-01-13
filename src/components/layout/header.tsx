import { ModeToggle } from '@/components/mode-toggle'

export const Header = () => {
  return (
    <header className="w-full h-16 bg-background border-b border-border flex items-center p-4 md:px-6">
      <h1 className="text-xl font-semibold grow">Evently</h1>
      <ModeToggle />
    </header>
  )
}
