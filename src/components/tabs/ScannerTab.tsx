import { useState } from "react";
import { Play, Download, Shield, Zap, Lock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function ScannerTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "scan" | "report">("overview");

  const vulnerabilityData = [
    { name: "SSRF", severity: 9, color: "#ff0055" },
    { name: "XSS", severity: 7, color: "#ffaa00" },
    { name: "SQLi", severity: 8, color: "#ff0055" },
    { name: "CORS", severity: 5, color: "#00ff88" },
    { name: "Headers", severity: 4, color: "#00ffff" },
  ];

  const scanTimeline = [
    { time: "0s", progress: 0 },
    { time: "5s", progress: 20 },
    { time: "10s", progress: 45 },
    { time: "15s", progress: 70 },
    { time: "20s", progress: 95 },
    { time: "25s", progress: 100 },
  ];

  const handleRunScan = () => {
    setRunning(true);
    setResults(false);
    setTimeout(() => {
      setResults(true);
      setRunning(false);
    }, 2000);
  };

  const downloadReport = () => {
    const report = `
Automated Vulnerability Scanner Report
=====================================
Scan Date: ${new Date().toISOString()}

FINDINGS:
- SSRF Vulnerabilities: 1 Critical
- XSS Vulnerabilities: 3 High
- SQL Injection: 2 High
- CORS Misconfigurations: 2 Medium
- Missing Security Headers: 4 Low

RECOMMENDATIONS:
1. Implement SSRF-safe IP validation
2. Use Content Security Policy (CSP)
3. Parameterized queries for SQL
4. Configure CORS properly
5. Add security headers

Remediation Time Estimate: 2-3 days
    `;
    
    const blob = new Blob([report], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scanner-report-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Automated Vulnerability Scanner
            </h2>
            <p className="text-gray-400 mb-4">
              Production-ready FastAPI scanner with SSRF-safe IP validation, security header audits, 
              XSS/SQLi detection, CORS analysis, per-user rate limiting, and Docker deployment.
            </p>
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
          <a 
            href="https://github.com/willy-havertz/port-cyber-scanner"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition"
          >
            <Zap className="w-4 h-4" />
            GitHub Repository
          </a>
          <a 
            href="https://port-cyber-scanner.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
          >
            <Lock className="w-4 h-4" />
            Live Demo
          </a>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-cyber-border">
        {(["overview", "scan", "report"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 font-semibold transition ${
              activeSubTab === tab
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-cyan-400"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
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

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Vulnerability Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vulnerabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #0ff", color: "#fff" }}
                  cursor={{ fill: "rgba(0, 255, 255, 0.1)" }}
                />
                <Bar dataKey="severity" fill="#ff0055" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Scan Tab */}
      {activeSubTab === "scan" && (
        <div className="space-y-6">
          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Run Security Scan</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Target URL</label>
                <input 
                  type="url" 
                  placeholder="https://example.com" 
                  disabled={running}
                  className="w-full bg-cyber-border text-white px-4 py-2 rounded border border-cyber-border focus:border-cyan-400 outline-none disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Scan Type</label>
                <select disabled={running} className="w-full bg-cyber-border text-white px-4 py-2 rounded border border-cyber-border focus:border-cyan-400 outline-none disabled:opacity-50">
                  <option>Full Scan (XSS, SQLi, CORS, Headers)</option>
                  <option>Quick Scan (Headers only)</option>
                  <option>SSRF Detection Only</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunScan}
              disabled={running}
              className="flex items-center gap-2 w-full justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded transition"
            >
              <Play className="w-4 h-4" />
              {running ? "Scanning..." : "Start Scan"}
            </button>
          </div>

          {running && (
            <div className="bg-cyber-dark border border-cyan-500 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-4">Scan Progress</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={scanTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#999" />
                  <YAxis stroke="#999" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #0ff", color: "#fff" }}
                    cursor={{ fill: "rgba(0, 255, 255, 0.1)" }}
                  />
                  <Line type="monotone" dataKey="progress" stroke="#00ff88" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {results && (
            <div className="bg-cyber-dark border border-cyan-400 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-4">✅ Scan Complete</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-sm">Critical Issues</p>
                  <p className="text-red-400 text-2xl font-bold">1</p>
                </div>
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-sm">High Severity</p>
                  <p className="text-orange-400 text-2xl font-bold">3</p>
                </div>
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-sm">Medium Severity</p>
                  <p className="text-yellow-400 text-2xl font-bold">2</p>
                </div>
                <div className="bg-cyber-border rounded p-4">
                  <p className="text-gray-400 text-sm">Scan Time</p>
                  <p className="text-cyan-400 text-2xl font-bold">2.3s</p>
                </div>
              </div>
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          )}
        </div>
      )}

      {/* Report Tab */}
      {activeSubTab === "report" && (
        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Sample Vulnerability Report</h3>
          <pre className="bg-cyber-border text-green-400 p-4 rounded text-xs overflow-auto max-h-96 font-mono">
{`=== Automated Vulnerability Scanner Report ===
Scan Date: 2024-12-26T10:30:00Z
Target: https://example.com

CRITICAL FINDINGS:
[1] SSRF Vulnerability (CWE-918)
    Location: /api/fetch-url endpoint
    Severity: CRITICAL
    Description: User-controlled URL parameter not validated
    Recommendation: Implement IP whitelist validation

HIGH FINDINGS:
[2] Reflected XSS (CWE-79)
    Location: /search?q= parameter
    Severity: HIGH
    
[3] SQL Injection (CWE-89)
    Location: /user?id= parameter
    Severity: HIGH
    
[4] Insecure CORS Policy (CWE-346)
    Location: Access-Control-Allow-Origin: *
    Severity: HIGH

MEDIUM FINDINGS:
[5] Missing CSP Header
    Severity: MEDIUM
    
[6] Missing HSTS Header
    Severity: MEDIUM

SECURITY SCORE: 32/100
Remediation Estimate: 2-3 days
Priority: URGENT`}
          </pre>
        </div>
      )}
    </div>
  );
}
