# Port Cyber Experiments

Live demonstrations of production-grade cybersecurity tools and analysis engines.

## 🚀 Projects

### 1. Network Security Assessment

Automated network discovery and vulnerability scanning using Python with Nmap integration. Identifies open ports, services, and assesses risk severity across infrastructure.

- **Language:** Python
- **Technology:** Nmap, Network Scanning
- **Output:** HTML & JSON Reports
- **GitHub:** [port-cyber-network-security](https://github.com/willy-havertz/port-cyber-network-security)

### 2. Incident Response Orchestration

Automated incident response playbook execution with 5-phase orchestration: Triage, Containment, Investigation, Remediation, and Recovery. Handles malware, breaches, DDoS, and ransomware scenarios.

- **Language:** Python
- **Framework:** YAML Playbooks
- **Phases:** 5-Phase Response (Triage → Containment → Investigation → Remediation → Recovery)
- **GitHub:** [port-cyber-incident-response](https://github.com/willy-havertz/port-cyber-incident-response)

### 3. Threat Intelligence Platform

Multi-source threat intelligence aggregation with enrichment and correlation. Aggregates indicators from OSINT, CVE, malware, and phishing feeds with behavioral correlation and campaign attribution.

- **Language:** Python
- **Sources:** Multi-Feed OSINT
- **Analysis:** Enrichment & Correlation Engine
- **GitHub:** [port-cyber-threat-intel](https://github.com/willy-havertz/port-cyber-threat-intel)

### 4. Secure Code Review (SAST)

Static Application Security Testing (SAST) scanner supporting 8 programming languages. Detects 10+ vulnerability patterns including SQL injection, XSS, command injection, and hardcoded credentials with OWASP/CWE mappings.

- **Language:** Python
- **Coverage:** 8 Languages (Python, JS, TS, Java, PHP, Go, etc.)
- **Mappings:** OWASP Top 10 & CWE
- **GitHub:** [port-cyber-code-review](https://github.com/willy-havertz/port-cyber-code-review)

### 5. Phishing Detection Engine

ML-powered phishing and credential harvesting detection with 27+ behavioral features. Analyzes emails and URLs for homograph attacks, urgency patterns, spoofing attempts, and malicious infrastructure.

- **Language:** Python
- **Features:** 27+ ML Features
- **Detection:** Email & URL Analysis
- **GitHub:** [port-cyber-phishing-detection](https://github.com/willy-havertz/port-cyber-phishing-detection)

## 🌐 Live Demo

Visit the dashboard to see live demonstrations:

- Network scanning results
- Incident response timelines
- Threat intelligence feeds
- Code review findings
- Phishing analysis

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React

## 📦 Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the dashboard.

## 🚀 Build & Deploy

```bash
npm run build
npm run preview
```

## 📝 License

Built as part of Port Cyber security projects portfolio.

## 🔗 Resources

- [Port Cyber Scanner](https://github.com/willy-havertz/port-cyber-scanner) - FastAPI backend with SSRF protection and rate limiting
- [Port Cyber Portfolio](https://github.com/willy-havertz/port-cyber) - Main portfolio website

---

**All demonstrations use sample data for educational purposes.**
