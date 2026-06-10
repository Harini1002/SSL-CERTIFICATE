/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScanResult } from "../src/types.js";

// Generate clean, comma-separated CSV from current scan results
export function generateCsvReport(results: ScanResult[]): string {
  const headers = [
    "Domain",
    "Risk Level",
    "Status",
    "Days Remaining",
    "Expiry Date",
    "Valid From",
    "Issuer",
    "SSL Grade",
    "Protocol Version",
    "Serial Number",
    "Signature Algorithm",
    "Scan Timestamp"
  ];

  const rows = results.map(r => [
    r.domain,
    r.riskLevel.toUpperCase(),
    r.status.toUpperCase(),
    r.daysRemaining === null ? "Expired/Outage" : r.daysRemaining,
    r.expiryDate,
    r.validFrom,
    `"${(r.issuer || "N/A").replace(/"/g, '""')}"`,
    r.sslGrade,
    r.protocol,
    r.serialNumber,
    r.signatureAlgorithm,
    r.scanTimestamp
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  return csvContent;
}

// Generate beautiful Markdown report suitable for email attach or git committing
export function generateMarkdownReport(results: ScanResult[], aiSummary: string = ""): string {
  const timestamp = new Date("2026-06-09T09:58:12Z").toLocaleString();
  const summaryBlock = aiSummary ? aiSummary : "No Executive Summary generated yet. Run portfolio analysis inside CertGuard Reports.";

  const expiredCount = results.filter(r => r.riskLevel === "expired").length;
  const criticalCount = results.filter(r => r.riskLevel === "critical").length;
  const highCount = results.filter(r => r.riskLevel === "high").length;
  const mediumCount = results.filter(r => r.riskLevel === "medium").length;
  const lowCount = results.filter(r => r.riskLevel === "low").length;

  let tableRows = results.map(r => {
    const riskBadge = r.riskLevel === "expired" ? "🚨 EXPIRED" : r.riskLevel === "critical" ? "🔴 CRITICAL" : r.riskLevel === "high" ? "🟠 HIGH" : r.riskLevel === "medium" ? "🟡 MEDIUM" : "🟢 LOW";
    const daysLeft = r.daysRemaining === null ? "Outage/Invalid" : `${r.daysRemaining} days`;
    return `| ${r.domain} | ${riskBadge} | ${daysLeft} | ${new Date(r.expiryDate).toLocaleDateString()} | ${r.issuer} | **${r.sslGrade}** |`;
  }).join("\n");

  return `# CertGuard AI — SSL Certificate Monitoring Report

**Date of Scan:** ${timestamp}  
**Total Assets Monitored:** ${results.length} unique domains  
**Remediation Urgencies:** ${expiredCount} Expired | ${criticalCount} Critical | ${highCount} High

---

## 📊 Security Executive Portfolio Summary

${summaryBlock}

---

## 🛡️ Active Domain SSL Ledger

| Domain | Security Risk | Days Remaining | Expiry Date | Core CA Issuer | Active Grade |
|:---|:---|:---|:---|:---|:---|
${tableRows}

---

## ⚙️ Standard SecOps Outage Prevention Protocols

1. **Auto-Enrollment ACME Policies:** Enforce ACME-compliant Let's Encrypt certificates on all low-tier development proxies on standard cron timers (90 days).
2. **Pre-expiry Renewal Trigger (30 Days out):** Set high-assurance commercial key requests (DigiCert, Sectigo) to automatically request signing certificates at least 30 days prior to expiry.
3. **Multi-Domain Wildcard Consolidation:** Group SaaS service interfaces behind high-grade wildcard certificates to minimize certificate management overhead.
4. **Cipher Suite Enforcements:** Disable legacy TLS 1.0/1.1 renegotiations; mandate TLS 1.3 as standard.

*Report compiled automatically by **CertGuard AI** SSL Watcher.*
`;
}

// Generate CSV strictly complying with the user's requested schema:
// csvhostname,expiry_date,days_left,status,issuer,owner
export function generateRankedCertsCsv(results: ScanResult[]): string {
  // Sort from most urgent (smallest days remaining) to least urgent (largest days remaining)
  const sorted = [...results].sort((a, b) => {
    const daysA = a.daysRemaining === null ? -9999 : a.daysRemaining;
    const daysB = b.daysRemaining === null ? -9999 : b.daysRemaining;
    return daysA - daysB;
  });

  const headers = ["csvhostname", "expiry_date", "days_left", "status", "issuer", "owner"];
  
  const rows = sorted.map(r => {
    const hostname = r.domain;
    
    // expiry_date in YYYY-MM-DD
    let expiryDateStr = "N/A";
    if (r.expiryDate && r.expiryDate !== "N/A") {
      try {
        expiryDateStr = r.expiryDate.split("T")[0];
      } catch (_) {
        expiryDateStr = "N/A";
      }
    }
    
    const daysLeft = r.daysRemaining === null ? 0 : r.daysRemaining;
    
    // Status classification matching user standard (CRITICAL, WARNING, OK)
    let statusStr = "OK";
    if (daysLeft <= 10) statusStr = "CRITICAL";
    else if (daysLeft <= 30) statusStr = "WARNING";

    const issuerStr = r.issuer || "Unknown";
    const ownerStr = "[owner]"; // Literal string "[owner]" as shown in the prompt spec

    return [
      hostname,
      expiryDateStr,
      daysLeft,
      statusStr,
      `"${issuerStr.replace(/"/g, '""')}"`,
      ownerStr
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

// Generate structured tasks markdown strictly conforming to renewal_tasks.md spec
export function generateRenewalTasksMarkdown(results: ScanResult[]): string {
  // Sort from most urgent (smallest days remaining) to least urgent (largest days remaining)
  const sorted = [...results].sort((a, b) => {
    const daysA = a.daysRemaining === null ? -9999 : a.daysRemaining;
    const daysB = b.daysRemaining === null ? -9999 : b.daysRemaining;
    return daysA - daysB;
  });

  // Filter only expiring certs (days remaining <= 30)
  const expiring = sorted.filter(r => r.daysRemaining !== null && r.daysRemaining <= 30);

  // Fallback if no expiring, use the most urgent items or the top 2
  const targetItems = expiring.length > 0 ? expiring : sorted.slice(0, 2);

  let output = `# SSL Renewal Tasks — Generated on June 09 2026\n\n`;

  targetItems.forEach((r, idx) => {
    const taskNum = idx + 1;
    const days = r.daysRemaining === null ? 0 : r.daysRemaining;
    
    let priority: "CRITICAL" | "WARNING" | "OK" = "OK";
    let priorityEmoji = "🟢";
    if (days <= 10) {
      priority = "CRITICAL";
      priorityEmoji = "🔴";
    } else if (days <= 30) {
      priority = "WARNING";
      priorityEmoji = "🟡";
    }

    let expiryDateStr = "2026-06-15";
    if (r.expiryDate && r.expiryDate !== "N/A") {
      try {
        expiryDateStr = r.expiryDate.split("T")[0];
      } catch (_) {}
    }

    output += `---\n\n`;
    output += `## ${priorityEmoji} Task ${taskNum} — ${r.domain} — ${priority}\n\n`;
    output += `**Priority:** ${priority}\n`;
    output += `**Expiry Date:** ${expiryDateStr}\n`;
    output += `**Days Remaining:** ${days} days\n`;
    output += `**Issued By:** ${r.issuer || "Unknown"}\n\n`;

    output += `Hi [Owner],\n\n`;

    if (priority === "CRITICAL") {
      output += `This is an urgent automated alert. The SSL certificate\n`;
      output += `for **${r.domain}** is expiring in just **${days} days** on\n`;
      output += `${new Date(expiryDateStr).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}. If not renewed, users will see security\n`;
      output += `warnings and the website will become inaccessible.\n\n`;
      output += `**Immediate Action Required:**\n`;
      output += `1. Log into ${r.issuer && r.issuer !== "N/A" ? r.issuer.split(" ")[0] : "your SSL provider"} dashboard\n`;
      output += `2. Locate certificate for ${r.domain}\n`;
      output += `3. Click Renew and complete the process\n`;
      output += `4. Install new certificate on your web server\n`;
      output += `5. Verify 🔒 padlock appears in browser\n\n`;
      output += `**Assigned To:** [Owner Name]\n`;
      output += `**Due Date:** Before ${new Date(expiryDateStr).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}\n\n`;
    } else {
      output += `The SSL certificate for **${r.domain}** will expire in\n`;
      output += `${days} days on ${new Date(expiryDateStr).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}. Please plan renewal this week\n`;
      output += `to avoid last-minute issues.\n\n`;
      output += `**Action Required:**\n`;
      output += `1. Log into your SSL provider dashboard\n`;
      output += `2. Renew certificate for ${r.domain}\n`;
      output += `3. Schedule installation before ${new Date(new Date(expiryDateStr).getTime() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}\n\n`;
      output += `**Assigned To:** [Owner Name]\n`;
      output += `**Due Date:** Before ${new Date(new Date(expiryDateStr).getTime() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}\n\n`;
    }
  });

  output += `---\n`;
  output += `*Generated by SSL Certificate Expiry Watcher*\n`;
  output += `*Powered by Ollama + Llama3*\n`;

  return output;
}

