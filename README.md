---
title: CertGuard AI
emoji: 🛡️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# 🛡️ CertGuard AI — Intelligent SSL Certificate Expiry Monitoring & DevSecOps Automation Platform

CertGuard AI is a comprehensive, state-of-the-art **AI-powered DevSecOps automation suite** designed to actively monitor, scan, analyze, and remediate SSL/TLS certificate portfolios. Built with Node.js, Express, React, Vite, and powered by Gemini AI, CertGuard AI automatically flags expiring certificates, drafts corporate advisory playbooks, generates ITIL-compliant P1/P2 incident tickets, and routes bulk SMTP email alerts using an integrated Python socket/mailer module.

---

## 🚀 Key Features

*   **🔍 High-Performance Expiry Watcher**: Batch scan multiple domains simultaneously. Features a custom sorting engine to rank domains by expiration urgency, offering instant visibility into imminent security lapses.
*   **📡 Real-Time SSL/TLS Handshake Diagnostic**: Performs true live network handshakes (TCP on port 443) to extract server certificate metadata, signature algorithms, CA issuers, version schemas, and SAN (Subject Alternative Name) arrays.
*   **🧠 Gemini AI DevSecOps Co-Pilot**:
    *   **Preemptive Threat Diagnostics**: Assesses operator credentials against simulated data leak ledgers before authentication.
    *   **ITIL Incident Ticketing**: Automatically converts certificate failures or warnings into structured, compliance-ready JSON-RPC incident tickets (P1–P4 urgency levels) with actionable remediation steps.
    *   **AI Email Drafting**: Generates context-aware security advisories and migration guides for CISO operations.
    *   **Portfolio Audit Summary**: Reviews global threat postures and compiles CISO-level executive summary dashboards.
*   **🛠️ Model Context Protocol (MCP) Server**: Exposes integrated tools (`check_ssl_cert`, `draft_escalation_ticket`, `dispatch_renewal_alert_email`, `fetch_ist_time`) so other AI agents can programmatically inspect TLS endpoints and execute tasks.
*   **📬 Python SMTP Mail Alert System**: Integrates seamlessly with an automated Python backend (`mailer.py`) to dispatch TLS-encrypted critical warnings, bulk status audits, and manual advisory alerts.
*   **🧪 LLM Prompt Engineering Laboratory**: Allows operators to test, profile, and optimize prompt constructs, system instructions, temperature, and model parameters (`gemini-3.5-flash`) with live execution latency telemetry.
*   **📊 Multi-Format Exporters**: Instantly compiles and downloads security ledgers as ranked CSVs or Markdown task lists.

---

## 🏗️ Architecture & Technology Stack

The application is structured as a full-stack JavaScript repository integrated with a Python micro-utility:

*   **Frontend**: React 19, TypeScript, Lucide Icons, Tailwind CSS, Motion animations, and Markdown parsers.
*   **Backend Server**: Express.js serving REST APIs and hosting the Model Context Protocol (MCP) JSON-RPC endpoints.
*   **Dev Ingress**: Integrated Vite development middleware for hot module replacement (HMR) and real-time asset compilation.
*   **Mailer Utility**: Python 3 script (`mailer.py`) employing `smtplib` and `ssl` for direct secure SMTP routing.
*   **Database**: JSON-based local database (`data/certguard.json`) initialized automatically at runtime to preserve session states, scan histories, generated tickets, and outbound mail logs.

---

## 📦 File Structure

```
├── .env.example              # Environment variables template
├── .gitignore                # Git paths to ignore (data/, node_modules/, etc.)
├── package.json              # Script shortcuts and project dependencies
├── server.ts                 # Main Express server entry point
├── mailer.py                 # Python SMTP secure mailing engine
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite middleware & asset resolution configs
├── data/
│   └── certguard.json        # Auto-created JSON database (ignored by git)
├── server/                   # Backend routes & business logic
│   ├── ai.ts                 # Gemini AI integration, prompts & models
│   ├── db.ts                 # JSON database read/write utilities
│   ├── mailer.ts             # Node-to-Python subprocess execution bridge
│   ├── report.ts             # CSV and Markdown document exporters
│   └── ssl.ts                # Raw TLS/TCP socket network scanner
├── src/                      # React frontend codebase
│   ├── App.tsx               # Primary dashboard layout & state machine
│   ├── main.tsx              # React entry mount
│   ├── index.css             # Tailwind imports & CSS theme vars
│   └── types.ts              # Global TypeScript interfaces
└── public/                   # Public static assets & UI illustrations
```

---

## 🔧 Prerequisites

*   **Node.js**: `v18.x` or later recommended
*   **npm**: `v9.x` or later
*   **Python**: `v3.x` with `smtplib` support (for SMTP email dispatching)
*   **Google Gemini API Key**: Acquired via [Google AI Studio](https://ai.google.dev/)

---

## 🖥️ Local Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Harini1002/SSL-CERTIFICATE.git
    cd SSL-CERTIFICATE
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Copy the example configuration to your local environment file:
    ```bash
    cp .env.example .env.local
    ```
    Open `.env.local` and specify your credentials:
    ```env
    GEMINI_API_KEY="AIzaSyYourGeminiAPIKeyHere"
    APP_URL="http://localhost:3000"
    ```

4.  **Run in Development Mode**:
    ```bash
    npm run dev
    ```
    The server will spin up on [http://localhost:3000](http://localhost:3000).

5.  **Compile & Run in Production Mode**:
    To bundle React assets using Vite and build the server using esbuild:
    ```bash
    npm run build
    npm start
    ```

---

## ☁️ Deployment Guide

### Deploying to Render.com (Web Service)

1.  Log in to [Render](https://render.com/) and click **New +** -> **Web Service**.
2.  Connect your GitHub account and select your `SSL-CERTIFICATE` repository.
3.  Set the following configuration parameters:
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
4.  Navigate to the **Environment** settings panel and define the following variables:
    *   `GEMINI_API_KEY` = *[Your Gemini API Key]*
    *   `NODE_ENV` = `production`
5.  Click **Deploy Web Service**. Render will dynamically bind to a port and launch the application.

### Deploying to Railway.app

1.  Log in to [Railway](https://railway.app/) and select **New Project** -> **Deploy from GitHub repo**.
2.  Choose the `SSL-CERTIFICATE` repository.
3.  Go to the service's **Variables** tab and add:
    *   `GEMINI_API_KEY` = *[Your Gemini API Key]*
    *   `NODE_ENV` = `production`
4.  Railway automatically detects the `npm run build` and `npm start` commands and deploys the container.

---

## 🛡️ License

This project is licensed under the Apache-2.0 License. See the header notices in source files for copyright detail.
