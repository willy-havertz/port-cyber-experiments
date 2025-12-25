import { useState } from "react";
import { Play, Download, Shield, Zap, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { scanTarget, ScanResult } from "../../lib/api-services";

export default function ScannerTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "scan" | "report">("overview");
  const [targetUrl, setTargetUrl] = useState("h4cker.org");
  const [scanType, setScanType] = useState<"basic" | "full" | "aggressive">("basic");
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunScan = async () => {
    if (!targetUrl.trim()) {
      setError("Please enter a valid target URL");
      return;
    }
    setRunning(true);
    setError(null);
    setResults(false);
    try {
      const result = await scanTarget({ target_url: targetUrl, scan_type: scanType });
      setScanResults(result);
      setResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setRunning(false);
    }
  };

  const formatReport = (scan: ScanResult): string => {
    const vulnList = scan.vulnerabilities
      .map((v, i) => `[${i + 1}] ${v.type} (${v.severity.toUpperCase()})\n    Description: ${v.description}\n${v.remediation ? `    Remediation: ${v.remediation}` : ""}`)
      .join("\n\n");
    return `=== Automated Vulnerability Scanner Report ===\nTarget: ${scan.target}\nScan Type: ${scan.scan_type}\nScan Date: ${scan.timestamp}\nDuration: ${scan.scan_duration || "N/A"}s\n\nVULNERABILITIES FOUND: ${scan.vulnerabilities.length}\n\n${vulnList}\n\nRECOMMENDATIONS:\n1. Review and remediate critical issues immediately\n2. Plan mitigation for high-severity findings\n3. Schedule regular scans\n4. Keep security headers up to date\n\nSecurity Score: ${100 - scan.vulnerabilities.length * 5}/100`;
  };

  const downloadReport = (reportText: string) => {
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scanner-report-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Automated Vulnerability Scanner</h2>
            <p className="text-gray-400 mb-4">Production-ready FastAPI scanner with SSRF-safe IP validation, security header audits, XSS/SQLi detection, CORS analysis, per-user rate limiting, and Docker deployment.</p>
          </div>
          <Shield className="w-12 h-12 text-cyan-500 flex-shrink-0" />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Language</p>
            <p className="text-white font-semibold">Python</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Framework</p>
            <p className="text-white font-semibold">FastAPI</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Deployment</p>
            <p className="text-white font-semibold">Docker</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Authentication</p>
            <p className="text-white font-semibold">JWT</p>
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <a href="https://github.com/willy-havertz/port-cyber-scanner" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition">
            <Zap className="w-4 h-4" />
            GitHub Repository
          </a>
          <a href="https://port-cyber-scanner.onrender.com/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition">
            <Lock className="w-4 h-4" />
            API Docs
          </a>
        </div>
      </div>

      <div className="flex gap-2 border-b border-cyber-border">
        {(["overview", "scan", "report"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveSubTab(tab)} className={`px-4 py-2 font-semibold transition ${activeSubTab === tab ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400 hover:text-cyan-400"}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeSubTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyber-border rounded p-4">
                <p className="text-cyan-400 font-semibold mb-2">🔒 SSRF Protection</p>
                <p className="text-gray-400 text-sm">Safe IP validation with whitelist support</p>
              </div>
              <div className="bg-cyber-border rounded p-4">
                <p className="text-cyan-400 font-semibold mb-2">📊 Header Audits</p>
                <p className="text-gray-400 text-sm">Checks for security headers (CSP, HSTS, etc)</p>
              </div>
              <div className="bg-cyber-border rounded p-4">
                <p className="text-cyan-400 font-semibold mb-2">⚡ XSS/SQLi Detection</p>
                <p className="text-gray-400 text-sm">Pattern matching & heuristic analysis</p>
              </div>
              <div className="bg-cyber-border rounded p-4">
                <p className="text-cyan-400 font-semibold mb-2">🌐 CORS Analysis</p>
                <p className="text-gray-400 text-sm">Identifies overly permissive CORS policies</p>
              </div>
              <div className="bg-cyber-border rounded p-4">
                <p className="text-cyan-400 font-semibold mb-2">⏱️ Rate Limiting</p>
                <p className="text-gray-400 text-sm">Per-user limits with Redis backend</p>
              </div>
              <div className="bg-cyber-border rounded p-4">
                <p className="text-cyan-400 font-semibold mb-2">🐳 Docker Ready</p>
                <p className="text-gray-400 text-sm">Full containerization for production</p>
              </div>
            </div>
          </div>
          {scanResults && scanResults.vulnerabilities.length > 0 && (
            <div className="bg-cyber-dark border border-cyan-400 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-2">Latest Scan Results</h3>
              <p className="text-gray-400 text-sm mb-4">{scanResults.target} ({scanResults.scan_type} scan)</p>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-xs">Critical</p>
                  <p className="text-red-400 text-2xl font-bold">{scanResults.vulnerabilities.filter((v) => v.severity === "critical").length}</p>
                </div>
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-xs">High</p>
                  <p className="text-orange-400 text-2xl font-bold">{scanResults.vulnerabilities.filter((v) => v.severity === "high").length}</p>
                </div>
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-xs">Medium</p>
                  <p className="text-yellow-400 text-2xl font-bold">{scanResults.vulnerabilities.filter((v) => v.severity === "medium").length}</p>
                </div>
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-xs">Total</p>
                  <p className="text-cyan-400 text-2xl font-bold">{scanResults.vulnerabilities.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "scan" && (
        <div className="space-y-6">
          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Run Real Security Scan</h3>
            {error && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-600 rounded text-red-400 flex gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Target URL</label>
                <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="h4cker.org or https://example.com" disabled={running} className="w-full bg-cyber-border text-white px-4 py-2 rounded border border-cyber-border focus:border-cyan-400 outline-none disabled:opacity-50" />
                <p className="text-gray-500 text-xs mt-1">Note: Only scan targets you own or have permission to test. Default: h4cker.org</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Scan Type</label>
                <select value={scanType} onChange={(e) => setScanType(e.target.value as any)} disabled={running} className="w-full bg-cyber-border text-white px-4 py-2 rounded border border-cyber-border focus:border-cyan-400 outline-none disabled:opacity-50">
                  <option value="basic">Basic Scan (Security Headers)</option>
                  <option value="full">Full Scan (Comprehensive)</option>
                  <option value="aggressive">Aggressive Scan (Deep)</option>
                </select>
              </div>
            </div>
            <button onClick={handleRunScan} disabled={running} className="flex items-center gap-2 w-full justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded transition">
              <Play className="w-4 h-4" />
              {running ? "Scanning..." : "Start Real Scan"}
            </button>
          </div>
          {running && (
            <div className="bg-cyber-dark border border-cyan-500 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-4">Scan Progress</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border border-cyan-400 border-t-transparent" />
                  <p className="text-cyan-400">Scanning {targetUrl}...</p>
                </div>
                <div className="w-full bg-cyber-border rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full animate-pulse" style={{ width: "45%" }} />
                </div>
              </div>
            </div>
          )}
          {results && scanResults && (
            <div className="bg-cyber-dark border border-cyan-400 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Scan Complete
              </h4>
              <p className="text-gray-400 text-sm mb-4">Target: {scanResults.target} | Duration: {scanResults.scan_duration}s</p>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-sm">Critical</p>
                  <p className="text-red-400 text-2xl font-bold">{scanResults.vulnerabilities.filter((v) => v.severity === "critical").length}</p>
                </div>
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-sm">High</p>
                  <p className="text-orange-400 text-2xl font-bold">{scanResults.vulnerabilities.filter((v) => v.severity === "high").length}</p>
                </div>
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-sm">Medium</p>
                  <p className="text-yellow-400 text-2xl font-bold">{scanResults.vulnerabilities.filter((v) => v.severity === "medium").length}</p>
                </div>
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-cyan-400 text-2xl font-bold">{scanResults.vulnerabilities.length}</p>
                </div>
              </div>
              <button onClick={() => downloadReport(formatReport(scanResults))} className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition">
                <Download className="w-4 h-4" />
                Download Full Report
              </button>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "report" && (
        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Vulnerability Report</h3>
          {scanResults ? (
            <div className="space-y-4">
              <pre className="bg-cyber-border text-green-400 p-4 rounded text-xs overflow-auto max-h-96 font-mono">{formatReport(scanResults)}</pre>
              <button onClick={() => downloadReport(formatReport(scanResults))} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition">
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          ) : (
            <p className="text-gray-400">Run a scan first to generate detailed report.</p>
          )}
        </div>
      )}
    </div>
  );
}
