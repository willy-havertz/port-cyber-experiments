import { useState } from "react";
import { Play } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { scanNetworkTarget, NetworkScanResult } from "../../lib/api-services";

export default function NetworkSecurityTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(false);
  const [targetHost, setTargetHost] = useState("h4cker.org");
  const [scanResults, setScanResults] = useState<NetworkScanResult | null>(
    null
  );
  const [error, setError] = useState("");

  const severityData = scanResults
    ? [
        {
          name: "Critical",
          value: scanResults.critical_count || 0,
          color: "#ff0055",
        },
        { name: "High", value: scanResults.high_count || 0, color: "#ffaa00" },
        {
          name: "Medium",
          value: scanResults.medium_count || 0,
          color: "#00ff88",
        },
      ]
    : [
        { name: "Critical", value: 1, color: "#ff0055" },
        { name: "High", value: 2, color: "#ffaa00" },
        { name: "Medium", value: 1, color: "#00ff88" },
      ];

  const handleRunScan = async () => {
    setRunning(true);
    setError("");
    try {
      const result = await scanNetworkTarget(targetHost);
      setScanResults(result);
      setResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
      setResults(true);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Network Security Assessment
        </h2>
        <p className="text-gray-400 mb-4">
          Automated network discovery and vulnerability scanning using Python
          with Nmap integration.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Language</p>
            <p className="text-white font-semibold">Python</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Technology</p>
            <p className="text-white font-semibold">Nmap, Network Scanning</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Output</p>
            <p className="text-white font-semibold">HTML & JSON Reports</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">
            Target Host
          </label>
          <input
            type="text"
            value={targetHost}
            onChange={(e) => setTargetHost(e.target.value)}
            placeholder="Enter hostname or IP"
            className="w-full bg-cyber-border text-white p-2 rounded border border-cyan-700 focus:outline-none focus:border-cyan-400 text-sm"
          />
        </div>

        <button
          onClick={handleRunScan}
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
            <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
              <p className="text-cyan-400 text-2xl font-bold">
                {scanResults.ports?.length || 0}
              </p>
              <p className="text-gray-400 text-sm">Open Ports</p>
            </div>
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-400 text-2xl font-bold">
                {scanResults.critical_count || 0}
              </p>
              <p className="text-gray-400 text-sm">Critical Issues</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <p className="text-orange-400 text-2xl font-bold">
                {scanResults.high_count || 0}
              </p>
              <p className="text-gray-400 text-sm">High Issues</p>
            </div>
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <p className="text-green-400 text-2xl font-bold">
                {(scanResults.critical_count || 0) +
                  (scanResults.high_count || 0) +
                  (scanResults.medium_count || 0)}
              </p>
              <p className="text-gray-400 text-sm">Total Issues</p>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Vulnerability Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#00f0ff"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {scanResults.ports && scanResults.ports.length > 0 && (
            <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Discovered Services
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {scanResults.ports.slice(0, 10).map((port, idx) => (
                  <div
                    key={idx}
                    className="bg-cyber-border rounded p-3 text-sm border border-cyan-700"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-cyan-400 font-semibold">
                          Port {port.port}/{port.protocol}
                        </p>
                        <p className="text-gray-300">{port.service}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          port.state === "open"
                            ? "bg-red-900/30 text-red-400"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {port.state}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
