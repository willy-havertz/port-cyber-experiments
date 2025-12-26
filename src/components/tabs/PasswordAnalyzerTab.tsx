import { useState } from "react";
import { Shield, Lock, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";

interface PasswordResult {
  password: string;
  score: number;
  strength: "very-weak" | "weak" | "medium" | "strong" | "very-strong";
  entropy: number;
  breached: boolean;
  breachCount?: number;
  feedback: string[];
  crackTime: string;
  patterns: string[];
}

export default function PasswordAnalyzerTab() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<PasswordResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [batchResults, setBatchResults] = useState<PasswordResult[]>([]);

  const analyzePassword = async (pwd: string): Promise<PasswordResult> => {
    // Real entropy calculation
    const entropy = calculateEntropy(pwd);
    
    // Check breach database (HaveIBeenPwned API)
    const breachInfo = await checkBreachDatabase(pwd);
    
    // Pattern detection
    const patterns = detectPatterns(pwd);
    
    // Strength scoring (0-4)
    const score = calculateStrength(pwd, entropy, patterns);
    const strength = getStrengthLabel(score);
    
    // Crack time estimation
    const crackTime = estimateCrackTime(entropy);
    
    // Generate feedback
    const feedback = generateFeedback(pwd, score, patterns, breachInfo.breached);
    
    return {
      password: pwd,
      score,
      strength,
      entropy,
      breached: breachInfo.breached,
      breachCount: breachInfo.count,
      feedback,
      crackTime,
      patterns,
    };
  };

  const calculateEntropy = (pwd: string): number => {
    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) charsetSize += 32;
    
    return Math.log2(Math.pow(charsetSize, pwd.length));
  };

  const checkBreachDatabase = async (pwd: string): Promise<{ breached: boolean; count: number }> => {
    try {
      // SHA-1 hash of password
      const encoder = new TextEncoder();
      const pwdData = encoder.encode(pwd);
      const hashBuffer = await crypto.subtle.digest('SHA-1', pwdData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      // HaveIBeenPwned k-anonymity API
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);
      
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!response.ok) return { breached: false, count: 0 };
      
      const responseText = await response.text();
      const lines = responseText.split('\n');
      
      for (const line of lines) {
        const [hashSuffix, count] = line.split(':');
        if (hashSuffix === suffix) {
          return { breached: true, count: parseInt(count) };
        }
      }
      
      return { breached: false, count: 0 };
    } catch (error) {
      console.error('Breach check failed:', error);
      return { breached: false, count: 0 };
    }
  };

  const detectPatterns = (pwd: string): string[] => {
    const patterns: string[] = [];
    
    // Common patterns
    if (/^[a-z]+$/.test(pwd)) patterns.push("Only lowercase");
    if (/^[A-Z]+$/.test(pwd)) patterns.push("Only uppercase");
    if (/^[0-9]+$/.test(pwd)) patterns.push("Only numbers");
    if (/^(.)\1+$/.test(pwd)) patterns.push("Repeated characters");
    if (/012|123|234|345|456|567|678|789|890/.test(pwd)) patterns.push("Sequential numbers");
    if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(pwd)) patterns.push("Sequential letters");
    if (/qwerty|asdfgh|zxcvbn/i.test(pwd)) patterns.push("Keyboard pattern");
    if (/password|admin|user|login|welcome|letmein|monkey|dragon|master|sunshine/i.test(pwd)) patterns.push("Common word");
    if (/^(.+)\1+$/.test(pwd)) patterns.push("Repeated pattern");
    if (/\d{4}/.test(pwd) && parseInt(pwd.match(/\d{4}/)?.[0] || "0") >= 1900 && parseInt(pwd.match(/\d{4}/)?.[0] || "0") <= 2030) patterns.push("Possible year");
    
    return patterns;
  };

  const calculateStrength = (pwd: string, entropy: number, patterns: string[]): number => {
    let score = 0;
    
    // Length scoring
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    
    // Character variety
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
    
    // Entropy threshold
    if (entropy > 50) score += 1;
    if (entropy > 75) score += 1;
    
    // Penalize patterns
    score -= Math.min(patterns.length, 3);
    
    return Math.max(0, Math.min(4, score));
  };

  const getStrengthLabel = (score: number): PasswordResult["strength"] => {
    if (score === 0) return "very-weak";
    if (score === 1) return "weak";
    if (score === 2) return "medium";
    if (score === 3) return "strong";
    return "very-strong";
  };

  const estimateCrackTime = (entropy: number): string => {
    // Assuming 1 billion guesses per second
    const guesses = Math.pow(2, entropy);
    const seconds = guesses / 1e9;
    
    if (seconds < 1) return "Instant";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
    return "Centuries";
  };

  const generateFeedback = (pwd: string, score: number, patterns: string[], breached: boolean): string[] => {
    const feedback: string[] = [];
    
    if (breached) feedback.push("⚠️ This password has been found in data breaches");
    if (pwd.length < 8) feedback.push("Use at least 8 characters");
    if (pwd.length < 12) feedback.push("Consider using 12+ characters for better security");
    if (!/[A-Z]/.test(pwd)) feedback.push("Add uppercase letters");
    if (!/[a-z]/.test(pwd)) feedback.push("Add lowercase letters");
    if (!/[0-9]/.test(pwd)) feedback.push("Add numbers");
    if (!/[^a-zA-Z0-9]/.test(pwd)) feedback.push("Add special characters (!@#$%^&*)");
    if (patterns.length > 0) feedback.push(`Avoid: ${patterns.join(", ")}`);
    if (score >= 3) feedback.push("✓ Good password strength");
    
    return feedback;
  };

  const handleAnalyze = async () => {
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzePassword(password);
      setResult(analysis);
      if (analysis.breached) {
        toast.error(`Password Compromised! ${analysis.breachCount} breaches found`, { 
          description: "Change immediately!" 
        });
      } else {
        toast.success(`${analysis.strength} - Entropy: ${analysis.entropy.toFixed(1)} bits`, {
          description: "Password meets security standards"
        });
      }
      if (analysis.breached) {
        toast.error(`Password Compromised - ${analysis.breachCount} breaches`, { description: "Change immediately!" });
      } else {
        toast.success(`Analysis: ${analysis.strength}`, { description: `Entropy: ${analysis.entropy.toFixed(1)} bits` });
      }
    } catch (err: any) {
      setError(err.message || "Analysis failed");
      toast.error("Analysis failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchAnalysis = async (file: File) => {
    setLoading(true);
    setError(null);
    setBatchResults([]);
    
    try {
      const text = await file.text();
      const passwords = text.split('\n').filter(p => p.trim());
      
      if (passwords.length > 100) {
        setError("Maximum 100 passwords for batch analysis");
        setLoading(false);
        return;
      }
      
      const results: PasswordResult[] = [];
      for (const pwd of passwords) {
        if (pwd.trim()) {
          const analysis = await analyzePassword(pwd.trim());
          results.push(analysis);
        }
      }
      
      setBatchResults(results);
    } catch (err: any) {
      setError(err.message || "Batch analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    const data = batchMode ? batchResults : result ? [result] : [];
    const csv = [
      "Password,Score,Strength,Entropy,Breached,Breach Count,Crack Time,Patterns",
      ...data.map(r => 
        `"${r.password}",${r.score},${r.strength},${r.entropy.toFixed(2)},${r.breached},${r.breachCount || 0},"${r.crackTime}","${r.patterns.join('; ')}"`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password-analysis-${Date.now()}.csv`;
    a.click();
  };

  const getStrengthColor = (strength: PasswordResult["strength"]) => {
    switch (strength) {
      case "very-weak": return "text-red-600 dark:text-red-400";
      case "weak": return "text-orange-600 dark:text-orange-400";
      case "medium": return "text-yellow-600 dark:text-yellow-400";
      case "strong": return "text-green-600 dark:text-green-400";
      case "very-strong": return "text-emerald-600 dark:text-emerald-400";
    }
  };

  const getStrengthBg = (strength: PasswordResult["strength"]) => {
    switch (strength) {
      case "very-weak": return "bg-red-100 dark:bg-red-900/20";
      case "weak": return "bg-orange-100 dark:bg-orange-900/20";
      case "medium": return "bg-yellow-100 dark:bg-yellow-900/20";
      case "strong": return "bg-green-100 dark:bg-green-900/20";
      case "very-strong": return "bg-emerald-100 dark:bg-emerald-900/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-6 h-6" />
            Password Strength Analyzer
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time password analysis with breach database checking
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setBatchMode(!batchMode)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {batchMode ? "Single" : "Batch"} Mode
          </button>
        </div>
      </div>

      {/* Single Password Analysis */}
      {!batchMode && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Password
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  placeholder="Enter password to analyze..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !password.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  {loading ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-4 mt-6">
                {/* Strength Badge */}
                <div className={`p-4 rounded-lg ${getStrengthBg(result.strength)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-lg font-semibold ${getStrengthColor(result.strength)}`}>
                        {result.strength.replace("-", " ").toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Score: {result.score}/4 | Entropy: {result.entropy.toFixed(2)} bits
                      </p>
                    </div>
                    {result.breached && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Breached ({result.breachCount?.toLocaleString()} times)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Crack Time</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {result.crackTime}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Password Length</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      {result.password.length} characters
                    </div>
                  </div>
                </div>

                {/* Patterns Detected */}
                {result.patterns.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                      Patterns Detected
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.patterns.map((pattern, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-yellow-200 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 text-xs rounded"
                        >
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {result.feedback.map((fb, idx) => (
                      <li key={idx} className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
                        {fb.startsWith("✓") ? (
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : fb.startsWith("⚠️") ? (
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : (
                          <span className="w-4 h-4 mt-0.5 flex-shrink-0">•</span>
                        )}
                        {fb.replace(/^[✓⚠️]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Batch Mode */}
      {batchMode && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Password List (TXT file, one per line)
              </label>
              <input
                type="file"
                accept=".txt"
                onChange={(e) => e.target.files?.[0] && handleBatchAnalysis(e.target.files[0])}
                className="block w-full text-sm text-gray-900 dark:text-white
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  dark:file:bg-blue-900/20 dark:file:text-blue-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum 100 passwords
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-4">Analyzing passwords...</p>
              </div>
            )}

            {batchResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Analysis Results ({batchResults.length})
                  </h3>
                  <button
                    onClick={exportResults}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Password
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Strength
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Entropy
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Breached
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Crack Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {batchResults.map((r, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {r.password}
                          </td>
                          <td className={`px-4 py-3 text-sm font-medium ${getStrengthColor(r.strength)}`}>
                            {r.strength}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {r.entropy.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {r.breached ? (
                              <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4" />
                                Yes ({r.breachCount?.toLocaleString()})
                              </span>
                            ) : (
                              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {r.crackTime}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
          How It Works
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Entropy calculation measures password randomness</li>
          <li>• Breach database check using HaveIBeenPwned API (secure, k-anonymity)</li>
          <li>• Pattern detection identifies common weaknesses</li>
          <li>• Crack time estimation assumes 1 billion guesses/second</li>
          <li>• No passwords are stored or transmitted except for breach checking</li>
        </ul>
      </div>
    </div>
  );
}
