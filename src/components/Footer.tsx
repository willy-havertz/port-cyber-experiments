export default function Footer() {
  return (
    <footer className="border-t border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-3">Projects</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="#network"
                  className="hover:text-green-400 transition-colors"
                >
                  Network Security
                </a>
              </li>
              <li>
                <a
                  href="#incident"
                  className="hover:text-green-400 transition-colors"
                >
                  Incident Response
                </a>
              </li>
              <li>
                <a
                  href="#threat"
                  className="hover:text-green-400 transition-colors"
                >
                  Threat Intelligence
                </a>
              </li>
              <li>
                <a
                  href="#code"
                  className="hover:text-green-400 transition-colors"
                >
                  Code Review
                </a>
              </li>
              <li>
                <a
                  href="#phishing"
                  className="hover:text-green-400 transition-colors"
                >
                  Phishing Detection
                </a>
              </li>
              <li>
                <a
                  href="#scanner"
                  className="hover:text-green-400 transition-colors"
                >
                  Vulnerability Scanner
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">More</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="#api-audit"
                  className="hover:text-green-400 transition-colors"
                >
                  API Audit
                </a>
              </li>
              <li>
                <a
                  href="#password"
                  className="hover:text-green-400 transition-colors"
                >
                  Password Analyzer
                </a>
              </li>
              <li>
                <a
                  href="#certificate"
                  className="hover:text-green-400 transition-colors"
                >
                  Certificate Checker
                </a>
              </li>
              <li>
                <a
                  href="#security-tools"
                  className="hover:text-green-400 transition-colors"
                >
                  Security Tools
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Repositories</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="https://github.com/willy-havertz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  GitHub Profile →
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700/50 pt-6 text-center text-slate-500 text-sm">
          <p>Cybersecurity Projects © 2025 | wiltord</p>
        </div>
      </div>
    </footer>
  );
}
