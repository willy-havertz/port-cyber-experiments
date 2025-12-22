import { useState } from "react";
import { Play, AlertCircle } from "lucide-react";

export default function CodeReviewTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(false);

  const handleRunReview = () => {
    setRunning(true);
    setTimeout(() => {
      setResults(true);
      setRunning(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Secure Code Review
        </h2>
        <p className="text-gray-400 mb-4">
          Static Application Security Testing (SAST) scanner supporting 8
          programming languages. Detects 10+ vulnerability patterns including
          SQL injection, XSS, command injection, and hardcoded credentials with
          OWASP/CWE mappings.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Language</p>
            <p className="text-white font-semibold">Python</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Coverage</p>
            <p className="text-white font-semibold">8 Languages</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Mappings</p>
            <p className="text-white font-semibold">OWASP & CWE</p>
          </div>
        </div>

        <button
          onClick={handleRunReview}
          disabled={running}
          className="flex items-center gap-2 bg-cyber-accent hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 px-6 rounded transition-all"
        >
          <Play className="w-4 h-4" />
          {running ? "Scanning..." : "Run Demo"}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-400 text-2xl font-bold">3</p>
              <p className="text-gray-400 text-sm">Critical</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <p className="text-orange-400 text-2xl font-bold">2</p>
              <p className="text-gray-400 text-sm">High</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-400 text-2xl font-bold">1</p>
              <p className="text-gray-400 text-sm">Medium</p>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
              <p className="text-cyan-400 text-2xl font-bold">6</p>
              <p className="text-gray-400 text-sm">Total Issues</p>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Vulnerability Findings
            </h3>

            <div className="space-y-3">
              <div className="bg-red-900/20 border-l-4 border-l-red-500 rounded p-4">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white font-semibold">SQL Injection</p>
                    <p className="text-gray-400 text-xs">
                      src/auth/login.py:42
                    </p>
                  </div>
                  <span className="text-red-400 font-bold text-sm">
                    CRITICAL
                  </span>
                </div>
                <p className="text-gray-300 text-sm">
                  User input directly concatenated into SQL query
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  CWE-89 • Recommendation: Use parameterized queries
                </p>
              </div>

              <div className="bg-red-900/20 border-l-4 border-l-red-500 rounded p-4">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white font-semibold">Hardcoded Secret</p>
                    <p className="text-gray-400 text-xs">
                      src/utils/secrets.js:8
                    </p>
                  </div>
                  <span className="text-red-400 font-bold text-sm">
                    CRITICAL
                  </span>
                </div>
                <p className="text-gray-300 text-sm">
                  API key exposed in source code: sk_live_51234...
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  CWE-798 • Recommendation: Move to environment variables
                </p>
              </div>

              <div className="bg-orange-900/20 border-l-4 border-l-orange-500 rounded p-4">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      Cross-Site Scripting (XSS)
                    </p>
                    <p className="text-gray-400 text-xs">
                      src/web/template.html:73
                    </p>
                  </div>
                  <span className="text-orange-400 font-bold text-sm">
                    HIGH
                  </span>
                </div>
                <p className="text-gray-300 text-sm">
                  User comment rendered without HTML escaping
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  CWE-79 • Recommendation: Use template auto-escaping
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 text-sm">
            <p className="text-gray-300">
              <span className="text-cyan-400 font-semibold">
                Scan coverage:
              </span>{" "}
              Python, JavaScript, TypeScript, Java, PHP, Go, and more
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
