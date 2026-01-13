import { ModeToggle } from '@/components/mode-toggle'

export const Header = () => {
  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center px-6 py-4">
      <h1 className="text-xl font-semibold grow">Evently</h1>
      <ModeToggle />
    </header>
  )
}
