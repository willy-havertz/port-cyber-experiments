import { useState } from "react";
import { Play, AlertCircle } from "lucide-react";
import { analyzeCode, CodeScanResult } from "../../lib/api-services";

export default function CodeReviewTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(false);
  const [repoUrl, setRepoUrl] = useState("https://github.com/h4cker/h4cker");
  const [language, setLanguage] = useState("python");
  const [scanResults, setScanResults] = useState<CodeScanResult | null>(null);
  const [error, setError] = useState("");

  const handleRunReview = async () => {
    setRunning(true);
    setError("");
    try {
      const result = await analyzeCode(repoUrl, language);
      setScanResults(result);
      setResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
      setResults(true);
    } finally {
      setRunning(false);
    }
  };

  const criticalCount = scanResults?.vulnerabilities.filter((v) => v.severity === "critical").length || 0;
  const highCount = scanResults?.vulnerabilities.filter((v) => v.severity === "high").length || 0;
  const mediumCount = scanResults?.vulnerabilities.filter((v) => v.severity === "medium").length || 0;

  return (
    <div className="space-y-6">
      <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Secure Code Review</h2>
        <p className="text-gray-400 mb-4">
          Static Application Security Testing (SAST) scanner supporting multiple programming languages. Detects vulnerability patterns with OWASP/CWE mappings.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Language</p>
            <p className="text-white font-semibold">Python</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Coverage</p>
            <p className="text-white font-semibold">8+ Languages</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Mappings</p>
            <p className="text-white font-semibold">OWASP & CWE</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">GitHub Repository URL</label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full bg-cyber-border text-white p-2 rounded border border-cyan-700 focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Primary Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-cyber-border text-white p-2 rounded border border-cyan-700 focus:outline-none focus:border-cyan-400 text-sm"
            >
              <option>python</option>
              <option>javascript</option>
              <option>typescript</option>
              <option>java</option>
              <option>php</option>
              <option>go</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleRunReview}
          disabled={running}
          className="flex items-center gap-2 bg-cyber-accent hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 px-6 rounded transition-all"
        >
          <Play className="w-4 h-4" />
          {running ? "Scanning..." : "Run Scan"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {results && scanResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-400 text-2xl font-bold">{criticalCount}</p>
              <p className="text-gray-400 text-sm">Critical</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <p className="text-orange-400 text-2xl font-bold">{highCount}</p>
              <p className="text-gray-400 text-sm">High</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-400 text-2xl font-bold">{mediumCount}</p>
              <p className="text-gray-400 text-sm">Medium</p>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
              <p className="text-cyan-400 text-2xl font-bold">{scanResults.vulnerabilities.length}</p>
              <p className="text-gray-400 text-sm">Total Issues</p>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Vulnerability Findings</h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scanResults.vulnerabilities.slice(0, 6).map((vuln, idx) => {
                const bgColor = vuln.severity === "critical" ? "border-l-red-500 bg-red-900/20" : vuln.severity === "high" ? "border-l-orange-500 bg-orange-900/20" : "border-l-yellow-500 bg-yellow-900/20";
                const textColor = vuln.severity === "critical" ? "text-red-500" : vuln.severity === "high" ? "text-orange-500" : "text-yellow-500";
                return (
                  <div key={idx} className={`${bgColor} border-l-4 rounded p-4`}>
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className={`w-4 h-4 ${textColor} mt-1 flex-shrink-0`} />
                      <div className="flex-1">
                        <p className="text-white font-semibold">{vuln.type}</p>
                        <p className="text-gray-400 text-xs">{vuln.file_path}:{vuln.line_number}</p>
                      </div>
                      <span className="text-gray-300 font-bold text-sm">{vuln.severity}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{vuln.description}</p>
                    <p className="text-gray-500 text-xs mt-1">{vuln.cwe} • {vuln.remediation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
