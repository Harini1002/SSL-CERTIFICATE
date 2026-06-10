/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScanResult {
  domain: string;
  issuer: string;
  expiryDate: string;
  validFrom: string;
  daysRemaining: number | null;
  protocol: string;
  serialNumber: string;
  version: string;
  sanList: string[];
  signatureAlgorithm: string;
  scanTimestamp: string;
  status: "success" | "ssl_error" | "timeout" | "dns_failed" | "connection_refused" | "unknown_error";
  riskLevel: "expired" | "critical" | "high" | "medium" | "low";
  sslGrade: string;
}

export interface RiskSummary {
  total: number;
  expired: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  securityScore: number;
}

export interface IncidentTicket {
  id: string;
  domain: string;
  ticketSubject: string;
  ticketBody: string;
  urgencyLabel: "P1" | "P2" | "P3" | "P4";
  remediationSteps: string[];
  prediction: string;
  createdAt: string;
}

export interface DashboardSession {
  id: string;
  totalDomains: number;
  criticalCount: number;
  highCount: number;
  securityScore: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface MailAlert {
  id: string;
  domain: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  status: "dispatched" | "failed" | "queued";
  sentAt: string;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: "CISO" | "SecOps Administrator" | "Guest Auditor";
  token?: string;
}
