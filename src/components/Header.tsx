import { Code2, ChevronLeft } from 'lucide-react'

interface HeaderProps {
  onBack?: () => void
}

export default function Header({ onBack }: HeaderProps) {
  return (
    <header className="border-b border-cyber-border bg-cyber-dark sticky top-0 z-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 hover:bg-cyber-border rounded transition-all"
              aria-label="Back to projects"
            >
              <ChevronLeft className="w-6 h-6 text-gray-400 hover:text-cyber-accent" />
            </button>
          )}
          <Code2 className="w-8 h-8 text-cyber-accent" />
          <h1 className="text-3xl font-bold text-white">Cybersecurity Projects</h1>
        </div>
        <p className="text-gray-400 ml-11">Live demonstrations of production-grade security tools</p>
      </div>
    </header>
  )
}
