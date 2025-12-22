import { useState } from "react";
import { Play, TrendingUp } from "lucide-react";

export default function ThreatIntelTab() {
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
          Threat Intelligence Platform
        </h2>
        <p className="text-gray-400 mb-4">
          Multi-source threat intelligence aggregation with enrichment and
          correlation. Aggregates indicators from OSINT, CVE, malware, and
          phishing feeds with behavioral correlation and campaign attribution.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Language</p>
            <p className="text-white font-semibold">Python</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Sources</p>
            <p className="text-white font-semibold">Multi-Feed OSINT</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Analysis</p>
            <p className="text-white font-semibold">Enrichment & Correlation</p>
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
              <p className="text-red-400 text-2xl font-bold">2</p>
              <p className="text-gray-400 text-sm">Critical Threats</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <p className="text-orange-400 text-2xl font-bold">3</p>
              <p className="text-gray-400 text-sm">High Severity</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-400 text-2xl font-bold">6</p>
              <p className="text-gray-400 text-sm">Total Indicators</p>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
              <p className="text-cyan-400 text-2xl font-bold">2</p>
              <p className="text-gray-400 text-sm">Campaigns Linked</p>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Top Threats Detected
              </h3>
            </div>

            <div className="space-y-3">
              <div className="bg-red-900/20 border border-red-700 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-semibold">
                      Malware Hash (Critical)
                    </p>
                    <p className="text-gray-400 text-xs font-mono">
                      sha256:8a9c7d8f9e1b...2a5b6
                    </p>
                  </div>
                  <span className="text-red-400 font-bold">99% Confidence</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Operation Stealth Shadow • Last seen: 2 hours ago
                </p>
              </div>

              <div className="bg-red-900/20 border border-red-700 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-semibold">
                      C2 IP Address (Critical)
                    </p>
                    <p className="text-gray-400 text-xs font-mono">
                      185.220.101.45
                    </p>
                  </div>
                  <span className="text-red-400 font-bold">99% Confidence</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Wizard Spider Campaign • Last seen: 1 day ago
                </p>
              </div>

              <div className="bg-orange-900/20 border border-orange-700 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-semibold">
                      Phishing Domain (High)
                    </p>
                    <p className="text-gray-400 text-xs font-mono">
                      secure-paypal-verify.click
                    </p>
                  </div>
                  <span className="text-orange-400 font-bold">
                    95% Confidence
                  </span>
                </div>
                <p className="text-gray-300 text-sm">
                  PayPal Credential Harvest • Last seen: Today
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              <span className="text-cyan-400 font-semibold">
                Recommendation:
              </span>{" "}
              Block C2 domains, update firewall rules, monitor for lateral
              movement
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
