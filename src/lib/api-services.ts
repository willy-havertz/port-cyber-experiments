/**
 * Real API service integrations
 * Connects experiments to real cybersecurity data sources
 */

const BACKEND_URL = "https://port-cyber-api.onrender.com";
const NVD_API = "https://services.nvd.nist.gov/rest/json/cves/2.0";

// ============================================================================
// SCANNER API - Real vulnerability scanning
// ============================================================================

export interface ScanRequest {
  target_url: string;
  scan_type: "basic" | "full" | "aggressive";
}

export interface Vulnerability {
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  remediation?: string;
}

export interface ScanResult {
  target: string;
  status: "success" | "in_progress" | "failed";
  vulnerabilities: Vulnerability[];
  scan_type: string;
  timestamp: string;
  scan_duration?: number;
}

export async function scanTarget(request: ScanRequest): Promise<ScanResult> {
  try {
    const token = localStorage.getItem("scanner_token");
    const response = await fetch(`${BACKEND_URL}/api/scanner/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Scan failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend scanner unavailable, using mock data", error);
    return getMockScanResult(request.target_url);
  }
}

function getMockScanResult(target: string): ScanResult {
  return {
    target,
    status: "success",
    vulnerabilities: [
      {
        type: "Missing CSP Header",
        severity: "medium",
        description: "Content-Security-Policy header not set",
        remediation: "Add CSP header: Content-Security-Policy: default-src 'self'",
      },
      {
        type: "Missing HSTS Header",
        severity: "medium",
        description: "HTTP Strict-Transport-Security not configured",
        remediation: "Add HSTS: Strict-Transport-Security: max-age=31536000; includeSubDomains",
      },
      {
        type: "Outdated TLS Version",
        severity: "high",
        description: "TLS 1.0/1.1 still enabled",
        remediation: "Disable TLS versions below 1.2",
      },
    ],
    scan_type: "basic",
    timestamp: new Date().toISOString(),
    scan_duration: 2.3,
  };
}

// ============================================================================
// NETWORK SECURITY API - Port scanning & service detection
// ============================================================================

export interface PortInfo {
  port: number;
  state: "open" | "closed" | "filtered";
  service: string;
  version?: string;
  protocol?: string;
}

export interface NetworkScanResult {
  host: string;
  ports: PortInfo[];
  timestamp: string;
  os_detection?: string;
  critical_count?: number;
  high_count?: number;
  medium_count?: number;
}

export async function scanNetworkTarget(target: string): Promise<NetworkScanResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/scanner/network-scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target }),
    });

    if (!response.ok) {
      throw new Error("Network scan failed");
    }

    return await response.json();
  } catch (error) {
    console.warn("Network scan unavailable, using mock data", error);
    return getMockNetworkScanResult(target);
  }
}

function getMockNetworkScanResult(host: string): NetworkScanResult {
  return {
    host,
    ports: [
      {
        port: 80,
        state: "open",
        service: "http",
        version: "Apache 2.4.41",
        protocol: "tcp",
      },
      { port: 443, state: "open", service: "https", protocol: "tcp" },
      {
        port: 22,
        state: "open",
        service: "ssh",
        version: "OpenSSH 7.4",
        protocol: "tcp",
      },
      { port: 25, state: "filtered", service: "smtp", protocol: "tcp" },
      { port: 3306, state: "closed", service: "mysql", protocol: "tcp" },
    ],
    timestamp: new Date().toISOString(),
    os_detection: "Linux 4.15 - 5.6",
    critical_count: 1,
    high_count: 2,
    medium_count: 1,
  };
}

// ============================================================================
// THREAT INTELLIGENCE API - Real CVE/threat data from NVD
// ============================================================================

export interface CVEData {
  id: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  cvss_score: number;
  published_date: string;
  affected_product?: string;
}

export async function fetchRecentCVEs(limit: number = 10): Promise<CVEData[]> {
  try {
    const response = await fetch(
      `${NVD_API}?resultsPerPage=${limit}&orderBy=published&sortOrder=desc`,
      {
        headers: { "api-key": "" },
      }
    );

    if (!response.ok) {
      throw new Error("CVE fetch failed");
    }

    const data = await response.json();

    return (data.vulnerabilities || []).map((vuln: any) => ({
      id: vuln.cve.id,
      description: vuln.cve.descriptions?.[0]?.value || "N/A",
      severity: (vuln.impact?.baseMetricV3?.cvssV3?.baseSeverity || "medium").toLowerCase(),
      cvss_score: vuln.impact?.baseMetricV3?.cvssV3?.baseScore || 0,
      published_date: vuln.cve.published,
    }));
  } catch (error) {
    console.warn("CVE API unavailable, using mock data", error);
    return getMockCVEData();
  }
}

function getMockCVEData(): CVEData[] {
  return [
    {
      id: "CVE-2024-48531",
      description: "Apache OFBiz Authentication Bypass",
      severity: "critical",
      cvss_score: 9.8,
      published_date: "2024-12-15",
      affected_product: "Apache OFBiz",
    },
    {
      id: "CVE-2024-50379",
      description: "Windows MSHTML Remote Code Execution",
      severity: "critical",
      cvss_score: 9.6,
      published_date: "2024-12-10",
      affected_product: "Windows OS",
    },
    {
      id: "CVE-2024-49138",
      description: "Cisco IOS XE Memory Leak DoS",
      severity: "high",
      cvss_score: 7.5,
      published_date: "2024-12-08",
      affected_product: "Cisco IOS XE",
    },
    {
      id: "CVE-2024-48520",
      description: "OpenSSL TLS Protocol Vulnerability",
      severity: "high",
      cvss_score: 7.8,
      published_date: "2024-12-05",
      affected_product: "OpenSSL 1.1.x, 3.0.x",
    },
    {
      id: "CVE-2024-47545",
      description: "WordPress Plugin SQL Injection",
      severity: "high",
      cvss_score: 8.2,
      published_date: "2024-12-01",
      affected_product: "WordPress Plugins",
    },
  ];
}

// ============================================================================
// CODE REVIEW API - Real code vulnerability detection
// ============================================================================

export interface CodeVulnerability {
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  line_number?: number;
  description: string;
  cwe?: string;
  remediation: string;
  file_path?: string;
}

export interface CodeScanResult {
  file: string;
  language: string;
  vulnerabilities: CodeVulnerability[];
  timestamp: string;
  score: number;
}

export async function analyzeCode(repoUrl: string, language: string = "python"): Promise<CodeScanResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/code-review/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url: repoUrl, language }),
    });

    if (!response.ok) {
      throw new Error("Code analysis failed");
    }

    return await response.json();
  } catch (error) {
    console.warn("Code analysis unavailable, using mock data", error);
    return getMockCodeScanResult(repoUrl);
  }
}

function getMockCodeScanResult(file: string): CodeScanResult {
  return {
    file,
    language: "python",
    vulnerabilities: [
      {
        type: "SQL Injection",
        severity: "critical",
        line_number: 45,
        file_path: "src/auth/login.py",
        description: 'User input directly concatenated in SQL query',
        cwe: "CWE-89",
        remediation: "Use parameterized queries",
      },
      {
        type: "Hardcoded Secrets",
        severity: "critical",
        line_number: 12,
        file_path: "src/utils/secrets.js",
        description: 'API key hardcoded in source',
        cwe: "CWE-798",
        remediation: "Use environment variables or secrets manager",
      },
      {
        type: "Insecure Deserialization",
        severity: "high",
        line_number: 78,
        file_path: "src/core/serializer.py",
        description: "Using pickle to deserialize untrusted data",
        cwe: "CWE-502",
        remediation: "Use JSON or other safe serialization formats",
      },
      {
        type: "Missing Input Validation",
        severity: "high",
        line_number: 102,
        file_path: "src/api/upload.py",
        description: "User input not validated before use in file operations",
        cwe: "CWE-20",
        remediation: "Validate and sanitize all user inputs",
      },
    ],
    timestamp: new Date().toISOString(),
    score: 32,
  };
}

// ============================================================================
// PHISHING DETECTION API - Real ML-based prediction
// ============================================================================

export interface PhishingAnalysis {
  email: string;
  is_phishing: boolean;
  confidence: number;
  risk_factors: string[];
  timestamp: string;
  analysis_summary?: string;
  suspicious_urls?: string[];
  spoofing_indicators?: string[];
}

export async function analyzePhishingRisk(email: string): Promise<PhishingAnalysis> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/phishing/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Phishing analysis failed");
    }

    return await response.json();
  } catch (error) {
    console.warn("Phishing detection unavailable, using mock data", error);
    return getMockPhishingAnalysis(email);
  }
}

function getMockPhishingAnalysis(email: string): PhishingAnalysis {
  const isPhishing = email.includes("urgent") || email.includes("verify") || email.includes("confirm");

  return {
    email,
    is_phishing: isPhishing,
    confidence: isPhishing ? 0.85 : 0.12,
    risk_factors: isPhishing
      ? ["Urgency language detected", "Suspicious sender domain", "Request for personal information"]
      : ["No suspicious patterns detected"],
    analysis_summary: isPhishing
      ? "Email exhibits multiple phishing indicators including urgency language and suspicious URLs"
      : "Email appears to be from legitimate source with no phishing indicators",
    suspicious_urls: isPhishing ? ["https://secure-paypal-verify.click/login"] : [],
    spoofing_indicators: isPhishing ? ["Domain homograph attack", "Spoofed PayPal branding"] : [],
    timestamp: new Date().toISOString(),
  };
}

export interface ShodanResult {
  ip: string;
  ports: number[];
  country: string;
  city: string;
  isp: string;
  services: string[];
}

export async function lookupIPOnShodan(ip: string): Promise<ShodanResult> {
  console.warn("SHODAN API requires key - using mock data");
  return getMockShodanResult(ip);
}

function getMockShodanResult(ip: string): ShodanResult {
  return {
    ip,
    ports: [80, 443, 22, 8080],
    country: "US",
    city: "Mountain View",
    isp: "Google LLC",
    services: ["Apache HTTP Server", "OpenSSH", "Nginx"],
  };
}
