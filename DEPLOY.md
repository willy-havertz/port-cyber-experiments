# Port Cyber Experiments - Deployment Guide

## Quick Deploy to Render

### Option 1: One-Click Deploy (Recommended)

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Paste: `https://github.com/willy-havertz/port-cyber-experiments.git`
5. Configure:
   - **Name:** port-cyber-experiments
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`
   - **Plan:** Free (or Paid for better performance)
6. Click "Create Web Service"
7. Done! Your site will be live at `https://port-cyber-experiments.onrender.com`

### Option 2: Manual Push to Deploy

After pushing to GitHub, Render will automatically detect and deploy changes.

---

## Project Info

- **Live Demo:** Run `npm run dev` locally at `http://localhost:5173`
- **Build for Production:** `npm run build`
- **Preview Production Build:** `npm run preview`

### Technologies
- React 19 + TypeScript
- Vite (blazing fast bundler)
- Tailwind CSS
- Recharts for visualizations

### Features
- Landing page showcasing all projects
- 5 interactive project demonstrations
- Network Security Assessment
- Incident Response Orchestration
- Threat Intelligence Platform
- Secure Code Review (SAST)
- Phishing Detection Engine

---

## Environment Variables

If needed, add to Render dashboard:
```
NODE_ENV=production
```

---

## Support

All projects are live and available on GitHub:
- [Network Security](https://github.com/willy-havertz/port-cyber-network-security)
- [Incident Response](https://github.com/willy-havertz/port-cyber-incident-response)
- [Threat Intelligence](https://github.com/willy-havertz/port-cyber-threat-intel)
- [Code Review](https://github.com/willy-havertz/port-cyber-code-review)
- [Phishing Detection](https://github.com/willy-havertz/port-cyber-phishing-detection)
