import { useState } from "react";
import { Play, X, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface ApiEndpoint {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
}

interface ApiFinding {
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Info";
  description: string;
  endpoint?: string;
}

export default function APIAuditTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(false);
  const [baseUrl, setBaseUrl] = useState("https://api.github.com");
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    { id: "1", path: "/", method: "GET" },
    { id: "2", path: "/users", method: "GET" },
    { id: "3", path: "/repos", method: "GET" },
  ]);
  const [auditResults, setAuditResults] = useState<any>(null);
  const [error, setError] = useState("");
  const [newPath, setNewPath] = useState("");
  const [newMethod, setNewMethod] = useState<ApiEndpoint["method"]>("GET");

  const severityData = auditResults
    ? [
        {
          name: "Critical",
          value: auditResults.findings?.filter((f: ApiFinding) => f.severity === "Critical").length || 0,
          fill: "#ff0055",
        },
        {
          name: "High",
          value: auditResults.findings?.filter((f: ApiFinding) => f.severity === "High").length || 0,
          fill: "#ffaa00",
        },
        {
          name: "Medium",
          value: auditResults.findings?.filter((f: ApiFinding) => f.severity === "Medium").length || 0,
          fill: "#00ff88",
        },
        {
          name: "Low",
          value: auditResults.findings?.filter((f: ApiFinding) => f.severity === "Low").length || 0,
          fill: "#0088ff",
        },
        {
          name: "Info",
          value: auditResults.findings?.filter((f: ApiFinding) => f.severity === "Info").length || 0,
          fill: "#888888",
        },
      ]
    : [
        { name: "Critical", value: 1, fill: "#ff0055" },
        { name: "High", value: 2, fill: "#ffaa00" },
        { name: "Medium", value: 3, fill: "#00ff88" },
        { name: "Low", value: 1, fill: "#0088ff" },
        { name: "Info", value: 2, fill: "#888888" },
      ];

  const handleAddEndpoint = () => {
    if (newPath.trim()) {
      setEndpoints([
        ...endpoints,
        {
          id: Date.now().toString(),
          path: newPath,
          method: newMethod,
        },
      ]);
      setNewPath("");
      setNewMethod("GET");
      toast.success(`Endpoint ${newPath} added successfully`, {
        description: `Added ${newMethod} ${newPath}`,
        duration: 2000,
      });
    }
  };

  const handleRemoveEndpoint = (id: string) => {
    const removed = endpoints.find((e) => e.id === id);
    setEndpoints(endpoints.filter((e) => e.id !== id));
    if (removed) {
      toast.success(`Endpoint removed`, {
        description: `Removed ${removed.method} ${removed.path}`,
        duration: 2000,
      });
    }
  };

  const handleRunAudit = async () => {
    if (!baseUrl.trim()) {
      toast.error("Invalid configuration", {
        description: "Please enter a base URL",
        duration: 3000,
      });
      return;
    }

    setRunning(true);
    setError("");
    const loadingToast = toast.loading("Running API security audit...", {
      description: `Testing ${endpoints.length} endpoint(s)`,
    });

    try {
      // Mock API audit results
      const mockFindings: ApiFinding[] = [
        {
          type: "Missing Authentication",
          severity: "High",
          description: "Public endpoints lack API key or JWT authentication",
          endpoint: "/",
        },
        {
          type: "No Rate Limiting",
          severity: "Medium",
          description: "API does not implement rate limiting headers (X-RateLimit-*)",
          endpoint: "/users",
        },
        {
          type: "CORS Allow All",
          severity: "High",
          description: "Access-Control-Allow-Origin is set to *",
          endpoint: "/repos",
        },
        {
          type: "Verbose Error Messages",
          severity: "Medium",
          description: "Stack traces exposed in error responses",
          endpoint: "/users",
        },
        {
          type: "Missing HTTPS Enforcement",
          severity: "High",
          description: "HSTS header not set; upgrade to HTTPS only",
          endpoint: "/",
        },
        {
          type: "Excessive HTTP Methods",
          severity: "Medium",
          description: "DELETE method exposed on read-only endpoint",
          endpoint: "/repos",
        },
        {
          type: "No API Versioning",
          severity: "Low",
          description: "API lacks version in URL or headers",
          endpoint: "/",
        },
        {
          type: "Deprecated TLS",
          severity: "High",
          description: "TLS 1.1 or earlier detected",
          endpoint: "/",
        },
      ];

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAuditResults({
        base_url: baseUrl,
        endpoints_tested: endpoints.length,
        total_findings: mockFindings.length,
        findings: mockFindings,
        timestamp: new Date().toISOString(),
      });
      setResults(true);

      toast.dismiss(loadingToast);
      toast.success("API audit completed", {
        icon: <CheckCircle2 className="w-5 h-5" />,
        description: `Found ${mockFindings.length} security findings across ${endpoints.length} endpoints`,
        duration: 4000,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Audit failed";
      setError(errorMsg);
      setResults(true);
      toast.dismiss(loadingToast);
      toast.error("Audit failed", {
        icon: <AlertCircle className="w-5 h-5" />,
        description: errorMsg,
        duration: 4000,
      });
    } finally {
      setRunning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-900/30 border-red-500 text-red-200";
      case "High":
        return "bg-orange-900/30 border-orange-500 text-orange-200";
      case "Medium":
        return "bg-yellow-900/30 border-yellow-500 text-yellow-200";
      case "Low":
        return "bg-blue-900/30 border-blue-500 text-blue-200";
      default:
        return "bg-gray-900/30 border-gray-500 text-gray-200";
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/20 text-red-300";
      case "High":
        return "bg-orange-500/20 text-orange-300";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-300";
      case "Low":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">API Configuration</h2>

        {/* Base URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Base URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.example.com"
            disabled={running}
            className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/30 rounded text-white placeholder-gray-500 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-1">Enter the API base URL to audit</p>
        </div>

        {/* Endpoints */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Endpoints ({endpoints.length})
          </label>
          <div className="space-y-2 mb-3">
            {endpoints.map((endpoint) => (
              <div key={endpoint.id} className="flex items-center gap-2 bg-slate-700/50 p-2 rounded">
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-mono rounded min-w-12">
                  {endpoint.method}
                </span>
                <span className="flex-1 text-sm text-gray-300 font-mono">{endpoint.path}</span>
                <button
                  onClick={() => handleRemoveEndpoint(endpoint.id)}
                  disabled={running}
                  className="p-1 hover:bg-red-500/20 rounded disabled:opacity-50"
                >
                  <X size={16} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Endpoint */}
          <div className="flex gap-2">
            <select
              value={newMethod}
              onChange={(e) => setNewMethod(e.target.value as ApiEndpoint["method"])}
              disabled={running}
              className="px-3 py-2 bg-slate-700 border border-cyan-500/30 rounded text-white text-sm disabled:opacity-50"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>PATCH</option>
              <option>HEAD</option>
              <option>OPTIONS</option>
            </select>
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="/api/endpoint"
              disabled={running}
              className="flex-1 px-4 py-2 bg-slate-700 border border-cyan-500/30 rounded text-white placeholder-gray-500 text-sm disabled:opacity-50"
              onKeyPress={(e) => e.key === "Enter" && handleAddEndpoint()}
            />
            <button
              onClick={handleAddEndpoint}
              disabled={running || !newPath.trim()}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded flex items-center gap-1 text-sm font-medium"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* Audit Button */}
        <button
          onClick={handleRunAudit}
          disabled={running || !baseUrl.trim()}
          className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <Play size={20} />
          {running ? "Auditing API..." : "Start API Audit"}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {error ? (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          ) : auditResults ? (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Base URL</div>
                  <div className="text-white font-mono text-sm truncate">{auditResults.base_url}</div>
                </div>
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Endpoints Tested</div>
                  <div className="text-white font-bold text-2xl">{auditResults.endpoints_tested}</div>
                </div>
                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Total Findings</div>
                  <div className="text-white font-bold text-2xl">{auditResults.total_findings}</div>
                </div>
              </div>

              {/* Severity Chart */}
              <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Findings by Severity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={severityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #0891b2",
                        borderRadius: "8px",
                      }}
                      cursor={{ fill: "rgba(6, 182, 212, 0.1)" }}
                    />
                    <Bar dataKey="value" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Findings List */}
              <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Security Findings</h3>
                <div className="space-y-3">
                  {auditResults.findings.map((finding: ApiFinding, idx: number) => (
                    <div
                      key={idx}
                      className={`border rounded-lg p-4 ${getSeverityColor(finding.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{finding.type}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getSeverityBadgeColor(
                            finding.severity
                          )}`}
                        >
                          {finding.severity}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{finding.description}</p>
                      {finding.endpoint && (
                        <p className="text-xs font-mono opacity-75">Endpoint: {finding.endpoint}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
