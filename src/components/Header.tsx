import { Code2, ChevronLeft } from 'lucide-react'

interface HeaderProps {
  onBack?: () => void
}

export default function Header({ onBack }: HeaderProps) {
  return (
    <header className="border-b border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-all group"
              aria-label="Back to projects"
            >
              <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-green-400 transition-colors" />
            </button>
          )}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl shadow-lg shadow-green-500/20">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Cybersecurity Projects
          </h1>
        </div>
        <p className="text-slate-400 ml-14">Live demonstrations of production-grade security tools</p>
      </div>
    </header>
  )
}
