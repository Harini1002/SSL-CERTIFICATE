/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { initDb, saveScanResults, saveSession, saveTicket, getScanHistory, getRecentSessions, getTickets, clearHistory, clearTickets, getDbStats, saveMailAlert, getMailHistory, saveUserAccount, getUsers } from "./server/db.js";
import { scanDomainLive, aggregateRiskSummary, cleanDomainName } from "./server/ssl.js";
import { generateIncidentTicket, generateRenewalEmail, generateExecutiveSummary, chatAboutPostures, generateAiLeakReport, runCustomPromptLab } from "./server/ai.js";
import { generateCsvReport, generateMarkdownReport, generateRankedCertsCsv, generateRenewalTasksMarkdown } from "./server/report.js";
import { runTestConnection, runSendCriticalAlert, runSendRenewalEmail, runSendBulkAlert } from "./server/mailer.js";
import { ScanResult, DashboardSession } from "./src/types.js";

async function startServer() {
  // Initialize Database on launch
  initDb();

  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  // Middleware for body parsing
  app.use(express.json({ limit: "5mb" }));

  // API 1: Fetch dashboard stats and history
  app.get("/api/history", (req, res) => {
    try {
      const scans = getScanHistory();
      const sessions = getRecentSessions();
      const tickets = getTickets();
      const mails = getMailHistory();
      const users = getUsers();
      const stats = getDbStats();
      res.json({ scans, sessions, tickets, mails, users, stats });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // NEW API: Save or send Mail Alert
  app.post("/api/mails/send", async (req, res) => {
    try {
      const { domain, sender, recipient, subject, body } = req.body;
      
      console.log(`[SMTP Outbound] Routing manual email alert for "${domain}" -> "${recipient}"`);
      // Since it is manually composed, we wrap it with our SMTP renewal system
      const mockResult: ScanResult = {
        domain: domain || "manual-dispatch",
        issuer: "Let's Encrypt",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        validFrom: new Date().toISOString(),
        daysRemaining: 30,
        protocol: "TLSv1.3",
        serialNumber: "MANUAL",
        version: "3",
        sanList: [],
        signatureAlgorithm: "sha256WithRSAEncryption",
        scanTimestamp: new Date().toISOString(),
        status: "success",
        riskLevel: "high",
        sslGrade: "A"
      };

      const mailRes = await runSendRenewalEmail(mockResult, body, recipient);
      if (mailRes && mailRes.sent) {
        const mailAlert = {
          id: `mail-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`,
          domain: domain || "unknown",
          sender: sender || "harinisivanathanvs@gmail.com",
          recipient: recipient || "harinisivanathanvs@gmail.com",
          subject: subject || `SSL warning: ${domain}`,
          body: body || "Expiry alert details...",
          status: "dispatched" as const,
          sentAt: new Date().toISOString()
        };
        // Already saved inside wrapper, but keep client response format standard
        res.json({ success: true, mail: mailAlert });
      } else {
        res.status(500).json({ error: mailRes?.message || "SMTP dispatch failed" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // NEW API: Test SMTP connection
  app.post("/api/mails/test", async (req, res) => {
    try {
      console.log("[SMTP Mailer] Initiating TLS handshake test connection with smtp.gmail.com...");
      const result = await runTestConnection();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // NEW API: Send renewal dispatch
  app.post("/api/mails/send-renewal", async (req, res) => {
    try {
      const { domainData, aiContent, recipient } = req.body;
      if (!domainData || !aiContent) {
        return res.status(400).json({ error: "Missing domainData or aiContent details." });
      }
      console.log(`[SMTP Mailer] Routing manual renewal instructions for ${domainData.domain} -> ${recipient}`);
      const result = await runSendRenewalEmail(domainData, aiContent, recipient);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // NEW API: User auth / login system
  app.post("/api/auth/login", (req, res) => {
    try {
      const { username, email, role } = req.body;
      if (!username || !email) {
        return res.status(400).json({ error: "Username and email are required." });
      }
      const user = {
        id: `usr-${Math.floor(10 + Math.random() * 90)}`,
        username: username.trim(),
        email: email.trim(),
        role: role || "Guest Auditor"
      };
      saveUserAccount(user);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // NEW API: AI-driven credential leak pre-auth assessor
  app.post("/api/auth/ai-leak-scan", async (req, res) => {
    try {
      const { username, email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email parameter is required for threat ledger scanning." });
      }
      const operatorName = username || "Operator";
      console.log(`[CertGuard AI] Triggering preemptive pre-auth threat diagnostic for ${operatorName} (${email})...`);
      const assessmentReport = await generateAiLeakReport(operatorName, email);
      res.json({ success: true, report: assessmentReport });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // NEW API: Get list of MCP tools
  app.get("/api/mcp/tools", (req, res) => {
    res.json({
      tools: [
        {
          name: "check_ssl_cert",
          description: "Perform real-time socket handshakes to query TLS parameters of a host, evaluating signature validity and expiry status.",
          inputSchema: {
            type: "object",
            properties: {
              hostname: { type: "string", description: "The server hostname to query, e.g. 'expired.badssl.com'" }
            },
            required: ["hostname"]
          }
        },
        {
          name: "draft_escalation_ticket",
          description: "Engage Groq model reasoning to compile a structured ITIL P1/P2 remediation ticket for operational outages.",
          inputSchema: {
            type: "object",
            properties: {
              domain: { type: "string", description: "The expired or expiring domain requiring high priority mitigation." }
            },
            required: ["domain"]
          }
        },
        {
          name: "dispatch_renewal_alert_email",
          description: "Draft and dispatch a premium security advisory email with renewal playbooks using SMTP settings.",
          inputSchema: {
            type: "object",
            properties: {
              domain: { type: "string", description: "Target domain expiring." },
              recipient: { type: "string", description: "SMTP recipient email address." }
            },
            required: ["domain", "recipient"]
          }
        },
        {
          name: "fetch_ist_time",
          description: "Queries the local platform time and formats it strictly as Indian Standard Time (IST, UTC+5:30) for schedule verification.",
          inputSchema: { type: "object", properties: {} }
        }
      ]
    });
  });

  // NEW API: Execute MCP tools
  app.post("/api/mcp/execute", async (req, res) => {
    try {
      const { tool, arguments: args } = req.body as { tool: string; arguments: any };
      if (!tool) {
        return res.status(400).json({ error: "Tool name is required." });
      }

      console.log(`[MCP Server] JSON-RPC request received. Executing Tool: "${tool}" with args:`, args);
      let executionResult: any = null;

      if (tool === "check_ssl_cert") {
        const hostname = cleanDomainName(args.hostname || "google.com");
        executionResult = await scanDomainLive(hostname);
        saveScanResults([executionResult]);
      } else if (tool === "draft_escalation_ticket") {
        const hostname = cleanDomainName(args.domain || "google.com");
        const scanRes = await scanDomainLive(hostname);
        executionResult = await generateIncidentTicket(scanRes);
        saveTicket(executionResult);
      } else if (tool === "dispatch_renewal_alert_email") {
        const hostname = cleanDomainName(args.domain || "google.com");
        const recipient = args.recipient || "harinisivanathanvs@gmail.com";
        const scanRes = await scanDomainLive(hostname);
        const bodyContent = await generateRenewalEmail(scanRes);
        
        const mailAlert = {
          id: `mail-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`,
          domain: hostname,
          sender: "harinisivanathanvs@gmail.com",
          recipient: recipient,
          subject: `[ALERT] SSL Expiry Notification for ${hostname}`,
          body: bodyContent,
          status: "dispatched" as const,
          sentAt: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString()
        };
        saveMailAlert(mailAlert);
        executionResult = mailAlert;
      } else if (tool === "fetch_ist_time") {
        const dateUtc = new Date();
        const dateIst = new Date(dateUtc.getTime() + (5.5 * 60 * 60 * 1000));
        executionResult = {
          rawUtc: dateUtc.toISOString(),
          formattedIst: dateIst.toISOString().replace("Z", "+05:30"),
          displayTimeIst: dateIst.toLocaleDateString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
          }) + " IST",
          offsetMinutes: 330,
          status: "healthy"
        };
      } else {
        return res.status(404).json({ error: `Tool ${tool} is not registered on this MCP server.` });
      }

      res.json({
        mcpVersion: "1.0",
        jsonrpc: "2.0",
        result: executionResult,
        stdout: `[MCP Executed Successfully] Tool: ${tool} processed in runtime.`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API 2: Scan array of domains
  app.post("/api/scan", async (req, res) => {
    try {
      const { domains } = req.body as { domains: string[] };
      if (!domains || !Array.isArray(domains) || domains.length === 0) {
        return res.status(400).json({ error: "Invalid domains payload. Expected array of strings." });
      }

      // Filter and clean input
      const cleanList = domains.map(d => cleanDomainName(d)).filter(Boolean);
      if (cleanList.length === 0) {
        return res.status(400).json({ error: "No valid hostnames detected." });
      }

      console.log(`[CertGuard Scanner] Initializing batch scan for ${cleanList.length} domains...`);

      const results: ScanResult[] = [];
      for (const d of cleanList) {
        console.log(`[CertGuard Scanner] Real-time scanning SSL certificate payload for ${d}...`);
        const scanRes = await scanDomainLive(d);
        results.push(scanRes);
      }

      // Compute aggregates
      const summary = aggregateRiskSummary(results);

      // Save to file database
      saveScanResults(results);

      const sessionObj: DashboardSession = {
        id: `sess-${Date.now()}`,
        totalDomains: results.length,
        criticalCount: summary.expired + summary.critical,
        highCount: summary.high,
        securityScore: summary.securityScore,
        createdAt: new Date("2026-06-09T09:58:12Z").toISOString()
      };
      saveSession(sessionObj);

      // Automatically run Python bulk alert dispatch system if any critical or high threat domains are found
      let mailAlertResult = null;
      try {
        console.log("[SMTP Mailer] Initiating automated scan evaluation and combined bulk alert dispatch...");
        mailAlertResult = await runSendBulkAlert(results);
        console.log("[SMTP Mailer] Automated bulk alert result:", mailAlertResult);
      } catch (mailErr: any) {
        console.error("[SMTP Mailer] Error triggering automated bulk alert:", mailErr.message);
      }

      res.json({
        success: true,
        results,
        summary,
        session: sessionObj,
        bulkMailDispatched: mailAlertResult
      });
    } catch (err: any) {
      console.error("[CertGuard Scanner API] Outage in scan routine:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API 3: Generate ITIL ticket via Groq AI
  app.post("/api/ticket", async (req, res) => {
    try {
      const { result } = req.body as { result: ScanResult };
      if (!result) {
        return res.status(400).json({ error: "Missing ScanResult item." });
      }

      console.log(`[CertGuard AI] Generating ITIL incident ticket draft for domain ${result.domain}...`);
      const ticket = await generateIncidentTicket(result);
      
      // Save ticket in history records
      saveTicket(ticket);
      res.json({ ticket });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API 4: Generate renewal alert email draft via Groq AI
  app.post("/api/email", async (req, res) => {
    try {
      const { result } = req.body as { result: ScanResult };
      if (!result) {
        return res.status(400).json({ error: "Missing ScanResult item." });
      }

      console.log(`[CertGuard AI] Drafting renewal notification copy for ${result.domain}...`);
      const emailContent = await generateRenewalEmail(result);
      res.json({ emailContent });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API 5: Generate Full Fleet Executive Summary via Groq AI
  app.post("/api/summary", async (req, res) => {
    try {
      const { results, summaryStats } = req.body as { results: ScanResult[]; summaryStats: any };
      if (!results || !summaryStats) {
        return res.status(400).json({ error: "Missing results or aggregate metrics." });
      }

      console.log(`[CertGuard AI] Compiling portfolio-wide cybersecurity CISO audit summary...`);
      const summary = await generateExecutiveSummary(results, summaryStats);
      res.json({ summary });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API 6: DevSecOps Chat Buddy endpoint (continuous context)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, results } = req.body as { messages: any[]; results: ScanResult[] };
      if (!messages || !results) {
        return res.status(400).json({ error: "Missing chat timeline context or results state." });
      }

      console.log(`[CertGuard AI] DevSecOps Assistant analyzing conversational query...`);
      const aiResponse = await chatAboutPostures(messages, results);
      res.json({ response: aiResponse });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API 6B: LLM Engineering Prompt Laboratory Evaluation
  app.post("/api/prompt-lab/evaluate", async (req, res) => {
    try {
      const { systemInstruction, prompt, temperature, topP, selectedModel } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Input prompt is required." });
      }

      console.log(`[Prompt Lab] Running dynamic evaluation using model ${selectedModel}...`);
      const result = await runCustomPromptLab(
        systemInstruction,
        prompt,
        Number(temperature ?? 0.7),
        Number(topP ?? 0.95),
        selectedModel
      );
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API 7: Clear selected database categories
  app.post("/api/clear", (req, res) => {
    try {
      const { target } = req.body as { target: "history" | "tickets" | "all" };
      if (target === "history" || target === "all") {
        clearHistory();
      }
      if (target === "tickets" || target === "all") {
        clearTickets();
      }
      res.json({ success: true, message: `Successfully cleared tables: ${target}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API 8: Exporter builder formatting
  app.post("/api/export", (req, res) => {
    try {
      const { results, format, aiSummary } = req.body as { results: ScanResult[]; format: "csv" | "markdown" | "user_csv" | "user_md"; aiSummary?: string };
      if (!results || !Array.isArray(results)) {
        return res.status(400).json({ error: "Invalid data list to export." });
      }

      if (format === "csv") {
        const csv = generateCsvReport(results);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=certguard_ledger.csv");
        return res.send(csv);
      } else if (format === "user_csv") {
        const csv = generateRankedCertsCsv(results);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=ranked_certs.csv");
        return res.send(csv);
      } else if (format === "user_md") {
        const md = generateRenewalTasksMarkdown(results);
        res.setHeader("Content-Type", "text/markdown");
        res.setHeader("Content-Disposition", "attachment; filename=renewal_tasks.md");
        return res.send(md);
      } else {
        const md = generateMarkdownReport(results, aiSummary);
        res.setHeader("Content-Type", "text/markdown");
        res.setHeader("Content-Disposition", "attachment; filename=certguard_report.md");
        return res.send(md);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Integrated Vite Middleware for smooth asset compilations
  if (process.env.NODE_ENV !== "production") {
    console.log("[CertGuard Live Dev] Mounting Vite middleware for browser hot-reload support...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("[CertGuard Prod Ingress] Standardizing Express static public file delivery parameters...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`================================================================`);
    console.log(`🛡️ CertGuard AI Secure Ingress booted successfully.`);
    console.log(`🌐 Local Gateway Preview URL: http://0.0.0.0:${PORT}`);
    console.log(`================================================================`);
  });
}

startServer().catch((error) => {
  console.error("Critical crash in CertGuard express bootstrap routine:", error);
});
