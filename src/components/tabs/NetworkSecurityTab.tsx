import { useState } from "react";
import { Play, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function NetworkSecurityTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(false);

  const severityData = [
    { name: "Critical", value: 1, color: "#ff0055" },
    { name: "High", value: 2, color: "#ffaa00" },
    { name: "Medium", value: 1, color: "#00ff88" },
  ];

  const handleRunScan = () => {
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
          Network Security Assessment
        </h2>
        <p className="text-gray-400 mb-4">
          Automated network discovery and vulnerability scanning using Python
          with Nmap integration. Identifies open ports, services, and assesses
          risk severity across infrastructure.
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

        <button
          onClick={handleRunScan}
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
            <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
              <p className="text-cyan-400 text-2xl font-bold">4</p>
              <p className="text-gray-400 text-sm">Hosts Discovered</p>
            </div>
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-400 text-2xl font-bold">7</p>
              <p className="text-gray-400 text-sm">Critical Issues</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <p className="text-orange-400 text-2xl font-bold">9</p>
              <p className="text-gray-400 text-sm">High Issues</p>
            </div>
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <p className="text-green-400 text-2xl font-bold">11</p>
              <p className="text-gray-400 text-sm">Total Vulnerabilities</p>
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

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 flex items-center justify-between">
            <p className="text-gray-300">
              Full assessment with remediation recommendations
            </p>
            <button className="flex items-center gap-2 bg-cyber-accent hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded text-sm">
              <Download className="w-4 h-4" />
              View Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
