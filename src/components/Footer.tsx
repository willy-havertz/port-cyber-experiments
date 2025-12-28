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
              <li>
                <a href="#scanner" className="hover:text-cyber-accent">
                  Vulnerability Scanner
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">More</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#api-audit" className="hover:text-cyber-accent">
                  API Audit
                </a>
              </li>
              <li>
                <a href="#password" className="hover:text-cyber-accent">
                  Password Analyzer
                </a>
              </li>
              <li>
                <a href="#certificate" className="hover:text-cyber-accent">
                  Certificate Checker
                </a>
              </li>
              <li>
                <a href="#security-tools" className="hover:text-cyber-accent">
                  Security Tools
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
          <p>Cybersecurity Projects © 2025 | wiltord</p>
        </div>
      </div>
    </footer>
  );
}
