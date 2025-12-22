import { Code2 } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-cyber-border bg-cyber-dark sticky top-0 z-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Code2 className="w-8 h-8 text-cyber-accent" />
          <h1 className="text-3xl font-bold text-white">
            Cybersecurity Projects
          </h1>
        </div>
        <p className="text-gray-400">
          Live demonstrations of production-grade security tools
        </p>
      </div>
    </header>
  );
}
