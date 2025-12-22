import { useState } from "react";
import { Play, CheckCircle, AlertTriangle } from "lucide-react";

export default function PhishingDetectionTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(false);

  const handleRunAnalysis = () => {
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
          Phishing Detection Engine
        </h2>
        <p className="text-gray-400 mb-4">
          ML-powered phishing and credential harvesting detection with 27+
          behavioral features. Analyzes emails and URLs for homograph attacks,
          urgency patterns, spoofing attempts, and malicious infrastructure.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Language</p>
            <p className="text-white font-semibold">Python</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Features</p>
            <p className="text-white font-semibold">27+ ML Features</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Detection</p>
            <p className="text-white font-semibold">Email & URL Analysis</p>
          </div>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={running}
          className="flex items-center gap-2 bg-cyber-accent hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 px-6 rounded transition-all"
        >
          <Play className="w-4 h-4" />
          {running ? "Analyzing..." : "Run Demo"}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-400 text-2xl font-bold">3</p>
              <p className="text-gray-400 text-sm">Dangerous</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-400 text-2xl font-bold">1</p>
              <p className="text-gray-400 text-sm">Suspicious</p>
            </div>
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <p className="text-green-400 text-2xl font-bold">2</p>
              <p className="text-gray-400 text-sm">Safe</p>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
              <p className="text-cyan-400 text-2xl font-bold">6</p>
              <p className="text-gray-400 text-sm">Analyzed</p>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Analysis Results
            </h3>

            <div className="space-y-3">
              <div className="bg-red-900/20 border-l-4 border-l-red-500 rounded p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-semibold">
                      📧 Phishing Email
                    </p>
                    <p className="text-gray-400 text-xs font-mono">
                      urgent_account_verification@secure-paypal-verify.click
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="bg-red-500 text-black px-2 py-1 rounded text-xs font-bold">
                      94% Risk
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Spoofed PayPal domain, urgency language, suspicious attachment
                </p>
              </div>

              <div className="bg-red-900/20 border-l-4 border-l-red-500 rounded p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-semibold">🔗 Phishing URL</p>
                    <p className="text-gray-400 text-xs font-mono">
                      https://secure-paypal-verify.click/login
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="bg-red-500 text-black px-2 py-1 rounded text-xs font-bold">
                      96% Risk
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Homograph attack, recently registered domain, weak SSL cert
                </p>
              </div>

              <div className="bg-green-900/20 border-l-4 border-l-green-500 rounded p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-semibold">
                      📧 Legitimate Email
                    </p>
                    <p className="text-gray-400 text-xs font-mono">
                      support@github.com
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="bg-green-500 text-black px-2 py-1 rounded text-xs font-bold">
                        Safe
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  Valid SPF/DKIM/DMARC, legitimate GitHub support domain
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 text-sm">
            <p className="text-gray-300">
              <span className="text-cyan-400 font-semibold">
                Detection methods:
              </span>{" "}
              Domain analysis, SPF/DKIM/DMARC verification, NLP urgency
              detection, SSL/TLS validation, reputation scoring
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
