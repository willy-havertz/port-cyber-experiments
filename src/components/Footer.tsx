export default function Footer() {
  return (
    <footer className="border-t border-cyber-border bg-cyber-dark mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-3">Projects</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#network" className="hover:text-cyber-accent">
                  Network Security
                </a>
              </li>
              <li>
                <a href="#incident" className="hover:text-cyber-accent">
                  Incident Response
                </a>
              </li>
              <li>
                <a href="#threat" className="hover:text-cyber-accent">
                  Threat Intelligence
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">More</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#code" className="hover:text-cyber-accent">
                  Code Review
                </a>
              </li>
              <li>
                <a href="#phishing" className="hover:text-cyber-accent">
                  Phishing Detection
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Repositories</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://github.com/willy-havertz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyber-accent"
                >
                  GitHub Profile →
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cyber-border pt-6 text-center text-gray-500 text-sm">
          <p>Cybersecurity Projects © 2025 | Built with React + Vite</p>
        </div>
      </div>
    </footer>
  );
}
