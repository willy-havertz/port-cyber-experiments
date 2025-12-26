// API types and functions for Security Tools
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

export const runAdvancedScan = async (_params: {
  target_url: string;
  include_port_scan?: boolean;
}): Promise<AdvancedScanResponse> => {
  // Mock implementation - would call backend API in production
  throw new Error("Backend API not configured");
};

export const runApiAudit = async (_params: {
  base_url: string;
  endpoints: { path: string; method: string }[];
}): Promise<ApiAuditResponse> => {
  // Mock implementation - would call backend API in production
  throw new Error("Backend API not configured");
};

export const searchCVEs = async (_query: string): Promise<CveSearchResponse> => {
  // Mock implementation - would call backend API in production
  throw new Error("Backend API not configured");
};
