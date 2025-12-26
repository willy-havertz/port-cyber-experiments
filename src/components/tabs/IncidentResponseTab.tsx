import { useState } from "react";
import { Play, Clock } from "lucide-react";
import { toast } from "sonner";

export default function IncidentResponseTab() {
  const [running, setRunning] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const handleRunScenario = () => {
    const toastId = toast.loading("Executing incident response playbook...");
    setRunning(true);
    setTimeout(() => {
      setShowTimeline(true);
      setRunning(false);
      toast.dismiss(toastId);
      toast.success("Playbook executed", {
        description: "Review timeline for phase outcomes",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Incident Response Orchestration
        </h2>
        <p className="text-gray-400 mb-4">
          Automated incident response playbook execution with 5-phase
          orchestration: Triage, Containment, Investigation, Remediation, and
          Recovery. Handles malware, breaches, DDoS, and ransomware scenarios.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Language</p>
            <p className="text-white font-semibold">Python</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Framework</p>
            <p className="text-white font-semibold">YAML Playbooks</p>
          </div>
          <div className="bg-cyber-border rounded p-3">
            <p className="text-gray-400">Phases</p>
            <p className="text-white font-semibold">5-Phase Response</p>
          </div>
        </div>

        <button
          onClick={handleRunScenario}
          disabled={running}
          className="flex items-center gap-2 bg-cyber-accent hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 px-6 rounded transition-all"
        >
          <Play className="w-4 h-4" />
          {running ? "Executing..." : "Run Demo"}
        </button>
      </div>

      {showTimeline && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 text-center">
              <p className="text-green-400 font-bold">✓</p>
              <p className="text-gray-400 text-xs">Triage</p>
            </div>
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 text-center">
              <p className="text-green-400 font-bold">✓</p>
              <p className="text-gray-400 text-xs">Containment</p>
            </div>
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 text-center">
              <p className="text-green-400 font-bold">✓</p>
              <p className="text-gray-400 text-xs">Investigation</p>
            </div>
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 text-center">
              <p className="text-green-400 font-bold">✓</p>
              <p className="text-gray-400 text-xs">Remediation</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 text-center">
              <p className="text-yellow-400 font-bold">⟳</p>
              <p className="text-gray-400 text-xs">Recovery</p>
            </div>
          </div>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Response Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-cyber-border">
                <Clock className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">14:32:15 — TRIAGE</p>
                  <p className="text-white">
                    Incident detected: Suspicious login from unknown IP
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-cyber-border">
                <Clock className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">
                    14:35:20 — CONTAINMENT
                  </p>
                  <p className="text-white">
                    User account locked, session terminated, MFA reset
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-cyber-border">
                <Clock className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">
                    14:40:12 — INVESTIGATION
                  </p>
                  <p className="text-white">
                    Analysis complete: 3 unauthorized file accesses detected
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-cyber-border">
                <Clock className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">
                    14:45:15 — REMEDIATION
                  </p>
                  <p className="text-white">
                    Security patches applied, credentials reset, backups
                    verified
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs">14:52:30 — RECOVERY</p>
                  <p className="text-white">
                    Systems restored, monitoring enabled, post-incident review
                    pending
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
