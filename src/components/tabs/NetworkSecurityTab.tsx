import { useState } from "react";
import { Play } from "lucide-react";
import { toast } from "sonner";
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
    if (!targetHost.trim()) {
      toast.error("Target host required", {
        description: "Enter a hostname or IP to scan",
      });
      return;
    }

    setRunning(true);
    setError("");
    try {
      const toastId = toast.loading(`Scanning ${targetHost}...`);
      const result = await scanNetworkTarget(targetHost);
      toast.dismiss(toastId);

      const critical = result.critical_count || 0;
      const high = result.high_count || 0;

      if (critical > 0) {
        toast.error(`Critical exposures: ${critical}`, {
          description: `${high} high severity issues also detected`,
        });
      } else if (high > 0) {
        toast.warning(`High severity issues: ${high}`, {
          description: "Prioritize remediation",
        });
      } else {
        toast.success("Scan complete", {
          description: "No critical/high findings",
        });
      }

      setScanResults(result);
      setResults(true);
    } catch (err) {
      toast.error("Network scan failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
      setError(err instanceof Error ? err.message : "Scan failed");
      setResults(true);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
          Network Security Assessment
        </h2>
        <p className="text-slate-400 mb-4">
          Automated network discovery and vulnerability scanning using Python
          with Nmap integration.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
            <p className="text-slate-400">Language</p>
            <p className="text-white font-semibold">Python</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
            <p className="text-slate-400">Technology</p>
            <p className="text-white font-semibold">Nmap, Network Scanning</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
            <p className="text-slate-400">Output</p>
            <p className="text-white font-semibold">HTML & JSON Reports</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-slate-400 text-sm mb-2">
            Target Host
          </label>
          <input
            type="text"
            value={targetHost}
            onChange={(e) => setTargetHost(e.target.value)}
            placeholder="Enter hostname or IP"
            className="w-full bg-slate-700/50 text-white p-3 rounded-lg border border-slate-600/50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm transition-all"
          />
        </div>

        <button
          onClick={handleRunScan}
          disabled={running}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-green-500/25"
        >
          <Play className="w-4 h-4" />
          {running ? "Scanning..." : "Run Scan"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {results && scanResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4">
              <p className="text-green-400 text-2xl font-bold">
                {scanResults.ports?.length || 0}
              </p>
              <p className="text-slate-400 text-sm">Open Ports</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
              <p className="text-red-400 text-2xl font-bold">
                {scanResults.critical_count || 0}
              </p>
              <p className="text-slate-400 text-sm">Critical Issues</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/50 rounded-xl p-4">
              <p className="text-orange-400 text-2xl font-bold">
                {scanResults.high_count || 0}
              </p>
              <p className="text-slate-400 text-sm">High Issues</p>
            </div>
            <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-xl p-4">
              <p className="text-emerald-400 text-2xl font-bold">
                {(scanResults.critical_count || 0) +
                  (scanResults.high_count || 0) +
                  (scanResults.medium_count || 0)}
              </p>
              <p className="text-slate-400 text-sm">Total Issues</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
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
                  fill="#22c55e"
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
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Discovered Services
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {scanResults.ports.slice(0, 10).map((port, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/50 rounded-lg p-3 text-sm border border-slate-600/50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-green-400 font-semibold">
                          Port {port.port}/{port.protocol}
                        </p>
                        <p className="text-slate-300">{port.service}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md ${
                          port.state === "open"
                            ? "bg-red-900/30 text-red-400 border border-red-500/30"
                            : "bg-slate-600/30 text-slate-300 border border-slate-500/30"
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
