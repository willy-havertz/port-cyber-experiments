import { useState } from "react";
import { Play, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { fetchRecentCVEs, CVEData } from "../../lib/api-services";

export default function ThreatIntelTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(false);
  const [cves, setCves] = useState<CVEData[]>([]);
  const [error, setError] = useState("");

  const handleRunAnalysis = async () => {
    const toastId = toast.loading("Aggregating latest CVEs...");
    setRunning(true);
    setError("");
    try {
      const data = await fetchRecentCVEs(10);
      toast.dismiss(toastId);

      const critical = data.filter((c) => c.severity === "critical").length;
      const high = data.filter((c) => c.severity === "high").length;

      if (critical > 0) {
        toast.error(`Critical CVEs: ${critical}`, {
          description: `${high} high severity entries found`,
        });
      } else if (high > 0) {
        toast.warning(`High severity CVEs: ${high}`, {
          description: "Monitor affected assets",
        });
      } else {
        toast.success("Threat feed updated", {
          description: "No critical/high CVEs detected",
        });
      }

      setCves(data);
      setResults(true);
    } catch (err) {
      toast.error("Threat intel fetch failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
      setError(err instanceof Error ? err.message : "Analysis failed");
      setResults(true);
    } finally {
      setRunning(false);
    }
  };

  const criticalCount = cves.filter((c) => c.severity === "critical").length;
  const highCount = cves.filter((c) => c.severity === "high").length;
  const mediumCount = cves.filter((c) => c.severity === "medium").length;

  return (
    <div className="space-y-6">
      <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Threat Intelligence Platform
        </h2>
        <p className="text-gray-400 mb-4">
          Multi-source threat intelligence aggregation with enrichment and
          correlation from NVD, CVE databases, and OSINT feeds.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Language</p>
            <p className="text-white font-semibold">Python</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Sources</p>
            <p className="text-white font-semibold">NVD, OSINT</p>
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
          {running ? "Analyzing..." : "Fetch CVEs"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-400 text-2xl font-bold">{criticalCount}</p>
              <p className="text-gray-400 text-sm">Critical Threats</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <p className="text-orange-400 text-2xl font-bold">{highCount}</p>
              <p className="text-gray-400 text-sm">High Severity</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-400 text-2xl font-bold">
                {cves.length}
              </p>
              <p className="text-gray-400 text-sm">Total CVEs</p>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
              <p className="text-cyan-400 text-2xl font-bold">{mediumCount}</p>
              <p className="text-gray-400 text-sm">Medium</p>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Recent CVE Threats
              </h3>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cves.slice(0, 5).map((cve, idx) => {
                const bgColor =
                  cve.severity === "critical"
                    ? "bg-red-900/20 border-red-700"
                    : cve.severity === "high"
                    ? "bg-orange-900/20 border-orange-700"
                    : "bg-yellow-900/20 border-yellow-700";
                const textColor =
                  cve.severity === "critical"
                    ? "text-red-400"
                    : cve.severity === "high"
                    ? "text-orange-400"
                    : "text-yellow-400";
                return (
                  <div key={idx} className={`${bgColor} border rounded p-4`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-semibold">{cve.id}</p>
                        <p className="text-gray-400 text-xs">
                          {cve.published_date}
                        </p>
                      </div>
                      <span className={`${textColor} font-bold text-sm`}>
                        {cve.severity}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      {cve.description.substring(0, 120)}...
                    </p>
                    <p className="text-gray-500 text-xs">
                      CVSS: {cve.cvss_score}
                    </p>
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
