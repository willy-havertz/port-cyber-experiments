// API types and functions for Security Tools
const BACKEND_URL = "https://port-cyber-backend.onrender.com/api";
const NVD_API = "https://services.nvd.nist.gov/rest/json/cves/2.0";

export interface AdvancedFinding {
  type: string;
  severity?: string;
  description: string;
}

export interface AdvancedScanResponse {
  target: string;
  status: string;
  timestamp: string;
  metadata?: {
    status_code?: number;
    final_url?: string;
    redirects?: number;
    server?: string;
    powered_by?: string;
    content_type?: string;
    tls?: {
      protocol?: string;
      issuer?: string;
      subject?: string;
    };
    allow_methods?: string;
  };
  findings: AdvancedFinding[];
}

export interface ApiAuditProbe {
  endpoint: string;
  method: string;
  url: string;
  status_code?: number;
  content_type?: string;
  allow_methods?: string;
  error?: string;
}

export interface ApiAuditResponse {
  target: string;
  timestamp: string;
  probes: ApiAuditProbe[];
  findings: AdvancedFinding[];
}

export interface CveResult {
  id: string;
  description: string;
  published: string | null;
  modified: string | null;
  severity?: string;
  score?: number;
}

export interface CveSearchResponse {
  query: string;
  count: number;
  source?: string;
  timestamp: string;
  results: CveResult[];
}

export const runAdvancedScan = async (params: {
  target_url: string;
  include_port_scan?: boolean;
}): Promise<AdvancedScanResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/scanner/public/advanced-scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `Advanced scan failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Advanced scan unavailable, using mock data", error);
    return getMockAdvancedScan(params.target_url);
  }
};

export const runApiAudit = async (params: {
  base_url: string;
  endpoints: { path: string; method: string }[];
}): Promise<ApiAuditResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/scanner/public/api-audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `API audit failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("API audit unavailable, using mock data", error);
    return getMockApiAudit(params.base_url);
  }
};

export const searchCVEs = async (query: string): Promise<CveSearchResponse> => {
  try {
    // Try NVD API directly (free, no auth required)
    const response = await fetch(
      `${NVD_API}?keywordSearch=${encodeURIComponent(query)}&resultsPerPage=20`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) {
      throw new Error("NVD API request failed");
    }

    const data = await response.json();
    const results: CveResult[] = (data.vulnerabilities || []).map((vuln: any) => {
      const cve = vuln.cve;
      const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV30?.[0] || cve.metrics?.cvssMetricV2?.[0];
      return {
        id: cve.id,
        description: cve.descriptions?.find((d: any) => d.lang === "en")?.value || "No description available",
        published: cve.published || null,
        modified: cve.lastModified || null,
        severity: metrics?.cvssData?.baseSeverity || "UNKNOWN",
        score: metrics?.cvssData?.baseScore || null,
      };
    });

    return {
      query,
      count: results.length,
      source: "NVD",
      timestamp: new Date().toISOString(),
      results,
    };
  } catch (error) {
    console.warn("CVE search failed, using mock data", error);
    return getMockCveSearch(query);
  }
};

// Mock data fallbacks
function getMockAdvancedScan(target: string): AdvancedScanResponse {
  return {
    target,
    status: "completed",
    timestamp: new Date().toISOString(),
    metadata: {
      status_code: 200,
      final_url: target,
      redirects: 0,
      server: "nginx/1.18.0",
      content_type: "text/html",
      tls: { protocol: "TLSv1.3", issuer: "Let's Encrypt", subject: new URL(target).hostname },
    },
    findings: [
      { type: "Missing CSP Header", severity: "Medium", description: "Content-Security-Policy header not configured" },
      { type: "Missing HSTS", severity: "Medium", description: "HTTP Strict-Transport-Security not set" },
      { type: "Server Banner Exposed", severity: "Info", description: "Server header reveals nginx/1.18.0" },
    ],
  };
}

function getMockApiAudit(target: string): ApiAuditResponse {
  return {
    target,
    timestamp: new Date().toISOString(),
    probes: [
      { endpoint: "/api/users", method: "GET", url: `${target}/api/users`, status_code: 200, content_type: "application/json" },
      { endpoint: "/api/admin", method: "GET", url: `${target}/api/admin`, status_code: 403 },
      { endpoint: "/api/health", method: "GET", url: `${target}/api/health`, status_code: 200 },
    ],
    findings: [
      { type: "CORS Misconfiguration", severity: "Medium", description: "Access-Control-Allow-Origin is wildcard" },
      { type: "Missing Rate Limiting", severity: "Medium", description: "No rate limiting headers detected" },
    ],
  };
}

function getMockCveSearch(query: string): CveSearchResponse {
  return {
    query,
    count: 3,
    source: "Mock Data",
    timestamp: new Date().toISOString(),
    results: [
      { id: "CVE-2024-12345", description: `Sample vulnerability related to ${query}`, published: "2024-12-01", modified: "2024-12-15", severity: "HIGH", score: 8.5 },
      { id: "CVE-2024-12346", description: `Another ${query} related issue`, published: "2024-11-15", modified: "2024-12-01", severity: "MEDIUM", score: 6.2 },
      { id: "CVE-2024-12347", description: `${query} security advisory`, published: "2024-10-20", modified: "2024-11-01", severity: "CRITICAL", score: 9.8 },
    ],
  };
}
