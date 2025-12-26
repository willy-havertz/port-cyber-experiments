import { ArrowRight, Github } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  features: string[];
  repo: string;
}

export default function LandingPage({
  onSelectProject,
}: {
  onSelectProject: (id: string) => void;
}) {
  const projects: Project[] = [
    {
      id: "network",
      name: "Network Security Assessment",
      description:
        "Automated network discovery and vulnerability scanning using Python with Nmap integration. Identifies open ports, services, and assesses risk severity across infrastructure.",
      language: "Python",
      features: [
        "Nmap Integration",
        "Port Scanning",
        "Service Detection",
        "Risk Severity Scoring",
        "HTML/JSON Reports",
      ],
      repo: "https://github.com/willy-havertz/port-cyber-network-security",
    },
    {
      id: "incident",
      name: "Incident Response Orchestration",
      description:
        "Automated incident response playbook execution with 5-phase orchestration. Handles malware, breaches, DDoS, and ransomware scenarios with full response automation.",
      language: "Python",
      features: [
        "5-Phase Response",
        "Playbook Automation",
        "Multiple Handlers",
        "Timeline Tracking",
        "Remediation Steps",
      ],
      repo: "https://github.com/willy-havertz/port-cyber-incident-response",
    },
    {
      id: "threat",
      name: "CVE Intelligence Dashboard",
      description:
        "Multi-source threat intelligence aggregation with enrichment and correlation. Aggregates indicators from OSINT, CVE, malware, and phishing feeds.",
      language: "Python",
      features: [
        "Feed Aggregation",
        "Threat Enrichment",
        "Correlation Engine",
        "Campaign Detection",
        "Multi-Format Reports",
      ],
      repo: "https://github.com/willy-havertz/port-cyber-threat-intel",
    },
    {
      id: "code",
      name: "Secure Code Review (SAST)",
      description:
        "Static Application Security Testing scanner supporting 8 programming languages. Detects 10+ vulnerability patterns with OWASP/CWE mappings.",
      language: "Python",
      features: [
        "8 Language Support",
        "10+ Vulnerability Types",
        "OWASP Mapping",
        "CWE Mapping",
        "Multi-Format Reports",
      ],
      repo: "https://github.com/willy-havertz/port-cyber-code-review",
    },
    {
      id: "phishing",
      name: "Phishing Detection Engine",
      description:
        "ML-powered phishing and credential harvesting detection with 27+ behavioral features. Analyzes emails and URLs for homograph attacks and spoofing.",
      language: "Python",
      features: [
        "27+ ML Features",
        "Email Analysis",
        "URL Analysis",
        "Risk Scoring",
        "Pattern Detection",
      ],
      repo: "https://github.com/willy-havertz/port-cyber-phishing-detection",
    },
    {
      id: "scanner",
      name: "Automated Vulnerability Scanner",
      description:
        "Production-ready FastAPI scanner with SSRF-safe IP validation, security header audits, XSS/SQLi detection, CORS analysis, per-user rate limiting, and Docker deployment.",
      language: "Python",
      features: [
        "SSRF Protection",
        "Header Audits",
        "XSS/SQLi Detection",
        "CORS Analysis",
        "Rate Limiting",
      ],
      repo: "https://github.com/willy-havertz/port-cyber-scanner",
    },
    {
      id: "api-audit",
      name: "API Security Audit Tool",
      description:
        "Comprehensive API security testing platform. Tests endpoint authentication, HTTP/HTTPS enforcement, CORS configuration, excessive HTTP methods, rate limiting headers, and stack trace leakage detection.",
      language: "TypeScript",
      features: [
        "CORS Testing",
        "HTTP Methods",
        "Auth Validation",
        "Rate Limiting",
        "Endpoint Probing",
      ],
      repo: "https://github.com/willy-havertz/port-cyber-experiments",
    },

    {
      id: "password",
      name: "Password Strength Analyzer",
      description:
        "Real-world password security analysis using HaveIBeenPwned breach database. Calculates entropy, detects patterns, estimates crack time, and supports batch analysis with CSV export.",
      language: "TypeScript",
      features: [
        "Breach Database",
        "Entropy Calculation",
        "Pattern Detection",
        "Batch Analysis",
        "CSV Export",
      ],
      repo: "https://github.com/willy-havertz/port-cyber-experiments",
    },
    {
      id: "certificate",
      name: "SSL/TLS Certificate Analyzer",
      description:
        "Comprehensive SSL/TLS security scanner using SSL Labs API. Validates certificates, checks chains, detects weak ciphers (RC4, 3DES), identifies vulnerabilities (BEAST, POODLE), and provides PCI-DSS compliance indicators.",
      language: "TypeScript",
      features: [
        "SSL Labs API",
        "Chain Validation",
        "Weak Cipher Detection",
        "Vulnerability Scanning",
        "Compliance Checks",
      ],
      repo: "https://github.com/willy-havertz/port-cyber-experiments",
    },
    {
      id: "security-tools",
      name: "Security Tools Suite",
      description:
        "Comprehensive 3-in-1 suite: Advanced Web Scan (TLS/headers/cookies), API Audit (endpoint testing), CVE Intelligence (NVD). All with fallback sample data.",
      language: "Python",
      features: [
        "Web Scan (TLS/Headers)",
        "API Endpoint Audit",
        "CVE Database Search",
        "Mock Data Fallback",
        "JSON Export",
      ],
      repo: "https://github.com/willy-havertz/port-cyber",
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-darker flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-darker py-20 border-b border-cyber-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-4">
              Cybersecurity
              <span className="text-cyber-accent"> Projects</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Interactive dashboards showcasing real-world security
              implementations
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects
              .slice()
              .reverse()
              .map((project) => (
                <div
                  key={project.id}
                  className="bg-cyber-dark border border-cyber-border rounded-lg p-6 hover:border-cyber-accent transition-all group"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-accent transition-colors">
                      {project.name}
                    </h3>
                    <span className="inline-block bg-cyber-border text-cyan-400 text-xs font-semibold px-2 py-1 rounded">
                      {project.language}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">
                    {project.description}
                  </p>

                  <div className="mb-6">
                    <p className="text-gray-500 text-xs font-semibold mb-2">
                      Features:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.features.map((feature) => (
                        <span
                          key={feature}
                          className="bg-cyber-border text-gray-300 text-xs px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectProject(project.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-cyber-accent hover:bg-cyan-400 text-black font-bold py-2 rounded transition-all"
                    >
                      View Demo
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-cyber-border hover:bg-cyber-border/80 text-gray-300 rounded transition-all flex items-center"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cyber-border bg-cyber-dark">
        <div className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>Cybersecurity Projects © 2025 | wiltord</p>
          <p className="mt-2">
            All demonstrations use sample data for educational purposes
          </p>
        </div>
      </footer>
    </div>
  );
}
