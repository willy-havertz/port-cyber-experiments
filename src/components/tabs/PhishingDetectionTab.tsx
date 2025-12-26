import { useState } from "react";
import { Play, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { analyzePhishingRisk, PhishingAnalysis } from "../../lib/api-services";

export default function PhishingDetectionTab() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(false);
  const [emailContent, setEmailContent] = useState("Your PayPal account has been locked. Verify immediately at secure-paypal-verify.click");
  const [phishingResults, setPhishingResults] = useState<PhishingAnalysis | null>(null);
  const [error, setError] = useState("");

  const handleRunAnalysis = async () => {
    setRunning(true);
    setError("");
    try {
      const toastId = toast.loading("Analyzing for phishing patterns...");
      const result = await analyzePhishingRisk(emailContent);
      
      toast.dismiss(toastId);
      
      if (result.is_phishing) {
        if (result.confidence > 0.8) {
          toast.error(`CRITICAL - Highly likely phishing (${(result.confidence * 100).toFixed(0)}%)`, {
            description: "Do not click links or provide information"
          });
        } else if (result.confidence > 0.5) {
          toast.warning(`SUSPICIOUS - Possible phishing (${(result.confidence * 100).toFixed(0)}%)`, {
            description: "Review carefully before interacting"
          });
        }
      } else {
        toast.success(`LOW RISK - Appears legitimate`, {
          description: `Confidence: ${(result.confidence * 100).toFixed(0)}%`
        });
      }
      
      setPhishingResults(result);
      setResults(true);
    } catch (err) {
      toast.error("Analysis failed", {
        description: err instanceof Error ? err.message : "Unknown error"
      });
      setError(err instanceof Error ? err.message : "Analysis failed");
      setResults(true);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Phishing Detection Engine
        </h2>
        <p className="text-gray-400 mb-4">
          ML-powered phishing and credential harvesting detection with 27+ behavioral features. Analyzes emails for homograph attacks, urgency patterns, spoofing, and malicious infrastructure.
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

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">Email Content</label>
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Paste email content for phishing analysis..."
            rows={4}
            className="w-full bg-cyber-border text-white p-2 rounded border border-cyan-700 focus:outline-none focus:border-cyan-400 text-sm"
          />
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={running}
          className="flex items-center gap-2 bg-cyber-accent hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 px-6 rounded transition-all"
        >
          <Play className="w-4 h-4" />
          {running ? "Analyzing..." : "Analyze Email"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {results && phishingResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`${phishingResults.is_phishing ? "bg-red-900/20 border-red-700" : "bg-green-900/20 border-green-700"} border rounded-lg p-4`}>
              <p className={`text-2xl font-bold ${phishingResults.is_phishing ? "text-red-400" : "text-green-400"}`}>
                {Math.round(phishingResults.confidence * 100)}%
              </p>
              <p className="text-gray-400 text-sm">Confidence</p>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
              <p className="text-cyan-400 text-2xl font-bold">{phishingResults.risk_factors.length}</p>
              <p className="text-gray-400 text-sm">Risk Factors</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-400 text-2xl font-bold">{phishingResults.suspicious_urls?.length || 0}</p>
              <p className="text-gray-400 text-sm">Suspicious URLs</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <p className="text-orange-400 text-2xl font-bold">{phishingResults.spoofing_indicators?.length || 0}</p>
              <p className="text-gray-400 text-sm">Spoofing Signs</p>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Analysis Results</h3>

            <div className={`${phishingResults.is_phishing ? "bg-red-900/20 border-red-700" : "bg-green-900/20 border-green-700"} border-l-4 rounded p-4`}>
              <div className="flex items-center gap-2 mb-2">
                {phishingResults.is_phishing ? (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">⚠</div>
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                <p className={`font-semibold ${phishingResults.is_phishing ? "text-red-400" : "text-green-400"}`}>
                  {phishingResults.is_phishing ? "Phishing Detected" : "Legitimate Email"}
                </p>
              </div>
              <p className="text-gray-300 text-sm">{phishingResults.analysis_summary}</p>
            </div>

            {phishingResults.risk_factors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-semibold text-sm">Risk Factors Detected:</h4>
                <div className="space-y-1">
                  {phishingResults.risk_factors.slice(0, 5).map((factor, idx) => (
                    <p key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      {factor}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {(phishingResults.suspicious_urls ?? []).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-semibold text-sm">Suspicious URLs:</h4>
                <div className="space-y-1">
                  {(phishingResults.suspicious_urls ?? []).slice(0, 3).map((url: string, idx: number) => (
                    <p key={idx} className="text-red-400 text-xs font-mono break-all bg-red-900/20 p-2 rounded">
                      {url}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 text-sm">
            <p className="text-gray-300">
              <span className="text-cyan-400 font-semibold">Detection Methods:</span> Domain analysis, SPF/DKIM/DMARC verification, NLP urgency detection, SSL/TLS validation, reputation scoring
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
