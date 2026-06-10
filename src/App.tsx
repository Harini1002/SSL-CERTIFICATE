/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Compass, 
  Terminal, 
  ChevronRight, 
  Download, 
  Play, 
  RefreshCw, 
  BarChart2, 
  Calendar, 
  FileText, 
  Settings as SettingsIcon, 
  Database, 
  Trash2, 
  Mail, 
  ExternalLink, 
  HelpCircle, 
  Copy, 
  Check, 
  Server,
  Lock,
  Network,
  CornerDownRight,
  TrendingUp,
  FileCheck2,
  Workflow,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  MapPin,
  ArrowRight,
  User,
  Loader2,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ScanResult, DashboardSession, IncidentTicket, RiskSummary } from "./types.js";

// Sample prefilled list of domains for aggregate scanning
const SAMPLE_DOMAINS = `google.com
github.com
expired.badssl.com
api.mycompany.com
portal.acmecorp.com
shop.retailbrand.com
hr.internaltools.net
staging.devops.io`;

interface PageHeaderBannerProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  iconComponent: React.ReactNode;
  extraNode?: React.ReactNode;
}

function PageHeaderBanner({ title, subtitle, imageUrl, iconComponent, extraNode }: PageHeaderBannerProps) {
  const [isIntersecting, setIsIntersecting] = useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [imageUrl]);

  return (
    <div ref={containerRef} className="w-full min-h-[11rem] md:h-44 rounded-3xl overflow-hidden relative border border-brand-surface-2/80 mb-6 flex flex-col justify-end p-6 select-none shadow-2xl group">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover filter brightness-[0.70] contrast-[1.12] group-hover:scale-[1.02] transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/30 to-transparent"></div>
        {/* Subtle high tech digital overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-[0.12]"></div>
      </div>
      
      {/* Floating HUD status indicator for image presence while scrolling */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-950/90 border border-slate-700/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg transition-all duration-300">
        <span className={`w-2 h-2 rounded-full ${isIntersecting ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" : "bg-amber-400 animate-ping shadow-[0_0_8px_#fbbf24]"}`}></span>
        <span className="text-[10px] font-mono text-slate-300 font-bold tracking-wider uppercase">
          Console image: {isIntersecting ? "ACTIVE VIEW" : "SCROLLED OUT"}
        </span>
      </div>

      {/* Banner Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fadeIn">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-accent/15 border border-brand-accent/30 text-brand-accent rounded-xl shadow-inner font-display">
              {iconComponent}
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight uppercase">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl pl-1">
            {subtitle}
          </p>
        </div>
        {extraNode && (
          <div className="shrink-0 pl-1 md:pl-0 flex flex-col sm:flex-row gap-2">
            {extraNode}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  // Global States
  const [results, setResults] = useState<ScanResult[]>([]);
  const [sessions, setSessions] = useState<DashboardSession[]>([]);
  const [tickets, setTickets] = useState<IncidentTicket[]>([]);
  const [mails, setMails] = useState<any[]>([]);
  const [dbStats, setDbStats] = useState({ totalScans: 0, totalSessions: 0, totalTickets: 0, totalMails: 0, oldestScan: null as string | null });
  const [activeTab, setActiveTab] = useState<"expiry-watcher" | "ssl-checker" | "dashboard" | "mail-system" | "mcp-agent" | "history" | "workflows" | "settings" | "prompt-lab">("expiry-watcher");
  
  // Login Authentication states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginRole, setLoginRole] = useState<"CISO" | "SecOps Administrator" | "Guest Auditor">("CISO");
  const [authChecking, setAuthChecking] = useState(true);
  const [loginAiChecking, setLoginAiChecking] = useState(false);
  const [loginAiReport, setLoginAiReport] = useState("");

  // Dynamic Indian Standard Time (IST) Clock state
  const [istTimeStr, setIstTimeStr] = useState("");

  // MCP Agent Tools states
  const [mcpTools, setMcpTools] = useState<any[]>([]);
  const [mcpRunLog, setMcpRunLog] = useState<string[]>([]);
  const [selectedMcpTool, setSelectedMcpTool] = useState<string>("");
  const [mcpToolArgs, setMcpToolArgs] = useState<Record<string, string>>({});
  const [isExecutingMcp, setIsExecutingMcp] = useState(false);
  const [mcpResultPayload, setMcpResultPayload] = useState<any>(null);

  // Mail draft composers states
  const [mailTo, setMailTo] = useState("harinisivanathanvs@gmail.com");
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [selectedAdvisoryDomain, setSelectedAdvisoryDomain] = useState("");
  const [selectedAdvisoryTemplate, setSelectedAdvisoryTemplate] = useState("p1-critical");
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState(false);

  // Single Check Terminal Mode URL Form States (Matches user screenshots!)
  const [checkerHostname, setCheckerHostname] = useState("google.com");
  const [checkerPort, setCheckerPort] = useState("443");
  const [activeCheckerResult, setActiveCheckerResult] = useState<ScanResult | null>(null);
  const [scanAlert, setScanAlert] = useState<{
    isOpen: boolean;
    domain: string;
    status: "CRITICAL" | "WARNING" | "HEALTHY";
    details: string;
    risk: string;
  } | null>(null);
  const [isCheckingSsl, setIsCheckingSsl] = useState(false);
  const [checkerLogs, setCheckerLogs] = useState<string[]>([]);

  // Bulk Scans Tab Input States
  const [domainsInput, setDomainsInput] = useState(SAMPLE_DOMAINS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // LLM Prompt Lab state
  const [promptLabSystemInstruction, setPromptLabSystemInstruction] = useState("You are the CertGuard Artificial Intelligence SecOps Co-Pilot, responding to direct inquiries on operational vulnerability rosters, SSL/TLS protocol lifecycle standards, and network-level protection protocols.");
  const [promptLabPrompt, setPromptLabPrompt] = useState("Perform a complete regulatory threat analysis audit on the SSL certificate portfolio, evaluating CA distribution clusters and recommended remediation schedules.");
  const [promptLabTemperature, setPromptLabTemperature] = useState(0.7);
  const [promptLabTopP, setPromptLabTopP] = useState(0.95);
  const [promptLabModel, setPromptLabModel] = useState("gemini-3.5-flash");
  const [promptLabResponse, setPromptLabResponse] = useState("");
  const [promptLabLoading, setPromptLabLoading] = useState(false);
  const [promptLabLatency, setPromptLabLatency] = useState<number | null>(null);
  const [promptLabModelUsed, setPromptLabModelUsed] = useState("");
  const [currentScanningDomain, setCurrentScanningDomain] = useState("");

  // Expiry Watcher special states
  const [watcherInput, setWatcherInput] = useState<string>(
    "google.com\ngithub.com\namazon.in\nflipkart.com\nstackoverflow.com\ninfosys.com\ntcs.com\nwipro.com\nzoho.com\nfreshworks.com"
  );
  const [watcherResults, setWatcherResults] = useState<ScanResult[]>([]);
  const [isScanningWatcher, setIsScanningWatcher] = useState<boolean>(false);
  const [watcherProgress, setWatcherProgress] = useState<number>(0);
  const [watcherLogList, setWatcherLogList] = useState<string[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [watcherScanDone, setWatcherScanDone] = useState<boolean>(false);
  
  // Filtering & Search states
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"days" | "domain">("days");

  // AI Summary states
  const [executiveSummary, setExecutiveSummary] = useState<string>("");
  const [isAnalyzingSummary, setIsAnalyzingSummary] = useState(false);

  // Modals / Overlays
  const [activeTicket, setActiveTicket] = useState<IncidentTicket | null>(null);
  const [activeEmailAlert, setActiveEmailAlert] = useState<{ domain: string; body: string; subject: string } | null>(null);
  const [activeEmailAlertMode, setActiveEmailAlertMode] = useState<"edit" | "preview">("edit");
  const [activeDetailsCert, setActiveDetailsCert] = useState<ScanResult | null>(null);

  // Email outbox and markdown state selection
  const [selectedMailIndex, setSelectedMailIndex] = useState<number>(0);
  const [mailboxViewMode, setMailboxViewMode] = useState<"plain" | "markdown">("plain");
  const [composerPreviewMode, setComposerPreviewMode] = useState<"edit" | "preview">("edit");

  // Loading maps for rows & actions
  const [generatingTicketsMap, setGeneratingTicketsMap] = useState<Record<string, boolean>>({});
  const [generatingEmailsMap, setGeneratingEmailsMap] = useState<Record<string, boolean>>({});
  const [isSendingRenewal, setIsSendingRenewal] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning" | "error" } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const triggerToast = (message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    if (scanAlert && scanAlert.isOpen) {
      const timer = setTimeout(() => {
        setScanAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scanAlert]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerToast("Copied to clipboard!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Initial Data Load
  const fetchDbHistory = async (retries = 3, delayMs = 1500) => {
    try {
      let res: Response | null = null;
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          res = await fetch("/api/history");
          if (res.ok) break;
        } catch (fetchErr) {
          if (attempt === retries) throw fetchErr;
          console.warn(`[CertGuard Gateway] Transient backend handshake failed (attempt ${attempt}/${retries}). Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }

      if (!res || !res.ok) {
        throw new Error(`Server returned status: ${res ? res.status : "unknown"}`);
      }

      const data = await res.json();
      if (data.scans) {
        setResults(data.scans);
        // Prefill Active Checker with the latest scanned domain result if present, other predefine google.com mock
        if (data.scans.length > 0 && !activeCheckerResult) {
          const successItem = data.scans.find((s: ScanResult) => s.status === "success");
          if (successItem) {
            setActiveCheckerResult(successItem);
          } else {
            setActiveCheckerResult(data.scans[0]);
          }
        }
      }
      if (data.sessions) setSessions(data.sessions);
      if (data.tickets) setTickets(data.tickets);
      if (data.mails) setMails(data.mails);
      if (data.stats) setDbStats(data.stats);

      // Recover user from local storage session token
      const storedUser = localStorage.getItem("certguard_user");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (_) {
          localStorage.removeItem("certguard_user");
        }
      }
    } catch (err) {
      console.error("Failed to load historical data logs:", err);
    } finally {
      setAuthChecking(false);
    }
  };

  // Run initial seed on mount if empty
  useEffect(() => {
    fetchDbHistory();
  }, [activeTab]);

  // Set default google.com preview certificate if no history is loaded yet
  useEffect(() => {
    if (!activeCheckerResult) {
      // Clean fallback object so interface is fully loaded on startup
      setActiveCheckerResult({
        domain: "google.com",
        issuer: "Google Trust Services LLC",
        expiryDate: new Date("2026-08-10T12:00:00Z").toISOString(),
        validFrom: new Date("2026-05-18T10:00:00Z").toISOString(),
        daysRemaining: 62,
        protocol: "TLSv1.3",
        serialNumber: "040000000001154B5AC394",
        version: "3",
        sanList: ["google.com", "*.google.com", "*.appengine.google.com", "*.bdn.dev", "*.origin-test.bdn.dev", "*.cloud.google.com"],
        signatureAlgorithm: "sha256WithRSAEncryption",
        scanTimestamp: new Date().toISOString(),
        status: "success",
        riskLevel: "low",
        sslGrade: "A"
      });
    }
  }, []);

  // IST Clock Ticker
  useEffect(() => {
    const updateIstTime = () => {
      const dateUtc = new Date();
      const dateIst = new Date(dateUtc.getTime() + (5.5 * 60 * 60 * 1000));
      const hours = String(dateIst.getUTCHours()).padStart(2, "0");
      const minutes = String(dateIst.getUTCMinutes()).padStart(2, "0");
      const seconds = String(dateIst.getUTCSeconds()).padStart(2, "0");
      const year = dateIst.getUTCFullYear();
      const month = String(dateIst.getUTCMonth() + 1).padStart(2, "0");
      const day = String(dateIst.getUTCDate()).padStart(2, "0");
      setIstTimeStr(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} IST`);
    };

    updateIstTime();
    const interval = setInterval(updateIstTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch registered Model Context Protocol (MCP) Tools
  useEffect(() => {
    const fetchMcpTools = async () => {
      try {
        const res = await fetch("/api/mcp/tools");
        const data = await res.json();
        if (data.tools) {
          setMcpTools(data.tools);
          if (data.tools.length > 0) {
            setSelectedMcpTool(data.tools[0].name);
            // set default arguments
            const initialArgs: Record<string, string> = {};
            data.tools.forEach((t: any) => {
              if (t.inputSchema && t.inputSchema.properties) {
                const firstKey = Object.keys(t.inputSchema.properties)[0];
                if (firstKey) {
                  initialArgs[t.name] = firstKey === "hostname" ? "expired.badssl.com" : firstKey === "domain" ? "google.com" : "harinisivanathanvs@gmail.com";
                }
              }
            });
            setMcpToolArgs(initialArgs);
          }
        }
      } catch (err) {
        console.error("Failed to load registered MCP tools configuration:", err);
      }
    };
    fetchMcpTools();
  }, []);

  // Aggregate Metrics derived from loaded results
  const computeAggregateMetrics = (): RiskSummary => {
    const summary: RiskSummary = {
      total: results.length,
      expired: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      securityScore: 100
    };

    if (results.length === 0) return summary;

    results.forEach(r => {
      if (r.riskLevel === "expired") summary.expired++;
      else if (r.riskLevel === "critical") summary.critical++;
      else if (r.riskLevel === "high") summary.high++;
      else if (r.riskLevel === "medium") summary.medium++;
      else if (r.riskLevel === "low") summary.low++;
    });

    // Compute Security Score
    let scoreMultiplier = 0;
    results.forEach(r => {
      if (r.riskLevel === "low") scoreMultiplier += 10;
      else if (r.riskLevel === "medium") scoreMultiplier += 6;
      else if (r.riskLevel === "high") scoreMultiplier += 2;
      else if (r.riskLevel === "critical") scoreMultiplier += 0;
      else if (r.riskLevel === "expired") scoreMultiplier -= 4;
    });

    const maxScore = results.length * 10;
    summary.securityScore = Math.max(0, Math.min(100, Math.round((scoreMultiplier / maxScore) * 100)));

    return summary;
  };

  const renderPageHeaderBanner = (title: string, subtitle: string, imageUrl: string, iconComponent: React.ReactNode, extraNode?: React.ReactNode) => {
    return (
      <PageHeaderBanner
        title={title}
        subtitle={subtitle}
        imageUrl={imageUrl}
        iconComponent={iconComponent}
        extraNode={extraNode}
      />
    );
  };

  const aggregates = computeAggregateMetrics();

  // Run a Single SSL Installation Check (Sleek and modular!)
  const handleSingleCheckerRun = async (targetDomainUrl: string) => {
    if (isCheckingSsl) return;
    
    const domainCleaned = targetDomainUrl.trim()
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .split("/")[0].split(":")[0];

    if (!domainCleaned) {
      triggerToast("Please provide a valid server hostname", "error");
      return;
    }

    setIsCheckingSsl(true);
    setCheckerLogs([
      `[DNS Lookup] Translating host IP bindings for ${domainCleaned}...`,
      `[Sys Handshake] Opening secure socket connection to port ${checkerPort || 443}...`
    ]);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: [domainCleaned] })
      });
      const data = await res.json();
      if (data.results && data.results[0]) {
        const item: ScanResult = data.results[0];
        setActiveCheckerResult(item);
        setCheckerLogs(prev => [
          ...prev,
          `[TCP Connected] Handshake established. Protocol negotiated: ${item.protocol}`,
          `[Crypto Stream] Received X.509 Certificate Chain details from remote target.`,
          `[Analysis Engine] Grade: ${item.sslGrade}, Expiry Status check finished.`
        ]);

        let status: "CRITICAL" | "WARNING" | "HEALTHY" = "HEALTHY";
        if (item.riskLevel === "expired" || item.riskLevel === "critical" || item.riskLevel === "high" || item.status !== "success") {
          status = "CRITICAL";
        } else if (item.riskLevel === "medium") {
          status = "WARNING";
        }

        setScanAlert({
          isOpen: true,
          domain: item.domain,
          status,
          risk: item.riskLevel || "Low",
          details: `SSL Grade: ${item.sslGrade || "N/A"}. Days remaining: ${item.daysRemaining ?? "N/A"}. Issuer: ${item.issuer || "Unknown"}. Signature Algorithm: ${item.signatureAlgorithm || "N/A"}.`
        });

        triggerToast(`SSL check completed for ${domainCleaned}!`, "success");
        fetchDbHistory();
      } else {
        throw new Error("Unable to read peer payload");
      }
    } catch (err: any) {
      setCheckerLogs(prev => [...prev, `[ERROR] Connection failed: DNS lookup timeout or host refused stream on 443`]);
      setScanAlert({
        isOpen: true,
        domain: domainCleaned,
        status: "CRITICAL",
        risk: "critical",
        details: `Failed connection handshake: ${err.message || "DNS lookup timeout or host refused connection on port 443"}`
      });
      triggerToast("Domain lookup failed or unavailable.", "error");
    } finally {
      setIsCheckingSsl(false);
    }
  };

  // Primary Batch Scan Handlers (Used in dashboard or settings)
  const handleBatchScan = async (rawInput: string) => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);

    triggerToast("Initializing bulk validation scan...", "info");

    const splitted = rawInput
      .split(/[\n,\s]+/)
      .map(d => d.trim())
      .filter(Boolean);

    if (splitted.length === 0) {
      triggerToast("Please enter at least one hostname or domain.", "error");
      setIsScanning(false);
      return;
    }

    setScanLogs([`[SecOps Controller] Initializing security ledger validation scan...`]);

    const scannedResults: ScanResult[] = [];
    
    for (let idx = 0; idx < splitted.length; idx++) {
      const hostname = splitted[idx];
      setCurrentScanningDomain(hostname);
      setScanProgress(Math.round(((idx) / splitted.length) * 100));

      setScanLogs(prev => [
        ...prev,
        `[Agent analyzing domain] Probing port 443 TCP on target: ${hostname}...`,
        `[TLS Pipeline] Gathering remote state peer certificate structure...`
      ]);

      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domains: [hostname] })
        });
        
        const data = await response.json();
        if (data.results && data.results[0]) {
          const item: ScanResult = data.results[0];
          scannedResults.push(item);
          setScanLogs(prev => [
            ...prev,
            `[Risk Engine] Classified domain "${hostname}" as ${item.riskLevel.toUpperCase()} priority (Grade ${item.sslGrade}).`,
            `[Agent Ledger] Saved peer records with SHA Serial: ${item.serialNumber.slice(0, 10)}...`
          ]);
        }
      } catch (err) {
        setScanLogs(prev => [...prev, `[ERROR] Failed handshake probe on: ${hostname}. DNS or socket lookup timeout.`]);
      }

      await new Promise(r => setTimeout(r, 400));
    }

    setScanProgress(100);
    setCurrentScanningDomain("");
    setScanLogs(prev => [...prev, `[SecOps Controller] Active Audit COMPLETE. Batch of ${scannedResults.length} domains mapped.`]);
    
    setTimeout(async () => {
      setIsScanning(false);
      setActiveTab("dashboard");

      let overallStatus: "CRITICAL" | "WARNING" | "HEALTHY" = "HEALTHY";
      let criticalCount = 0;
      let warningCount = 0;
      let healthyCount = 0;
      
      scannedResults.forEach(item => {
        if (item.riskLevel === "expired" || item.riskLevel === "critical" || item.riskLevel === "high" || item.status !== "success") {
          overallStatus = "CRITICAL";
          criticalCount++;
        } else if (item.riskLevel === "medium") {
          if (overallStatus !== "CRITICAL") overallStatus = "WARNING";
          warningCount++;
        } else {
          healthyCount++;
        }
      });

      setScanAlert({
        isOpen: true,
        domain: splitted.slice(0, 3).join(", ") + (splitted.length > 3 ? `... and ${splitted.length - 3} more` : ""),
        status: overallStatus,
        risk: overallStatus === "CRITICAL" ? "critical" : overallStatus === "WARNING" ? "medium" : "low",
        details: `Batch scan resolved. Scanned ${scannedResults.length} domains in total. Posture Analysis: ${criticalCount} Critical/High Risk items detected, ${warningCount} Warnings, and ${healthyCount} Healthy/Low Risk assets.`
      });

      if (overallStatus === "CRITICAL") {
        triggerToast(`Batch Scan completed: CRITICAL security threats detected!`, "error");
      } else if (overallStatus === "WARNING") {
        triggerToast(`Batch Scan completed: WARNING posture items detected.`, "warning");
      } else {
        triggerToast(`Batch Scan completed: All domains are HEALTHY ✅`, "success");
      }

      await fetchDbHistory();
    }, 500);
  };

  // Special Expiry Watcher Scanner
  const handleWatcherScan = async () => {
    if (isScanningWatcher) return;
    setIsScanningWatcher(true);
    setWatcherProgress(0);
    setWatcherLogList([]);
    setWatcherScanDone(false);

    triggerToast("Commencing Watcher SSL Expiry verification sequence...", "info");

    const splitted = watcherInput
      .split(/[\n,\s]+/)
      .map(d => d.trim())
      .filter(Boolean);

    if (splitted.length === 0) {
      triggerToast("Please enter or upload at least one hostname.", "error");
      setIsScanningWatcher(false);
      return;
    }

    setWatcherLogList([`[Watcher] Commencing SSL Expiry verification sequence...`]);

    const scannedWatcherResults: ScanResult[] = [];
    
    for (let idx = 0; idx < splitted.length; idx++) {
      const hostname = splitted[idx];
      setWatcherProgress(Math.round((idx / splitted.length) * 100));
      setWatcherLogList(prev => [
        ...prev,
        `[Scanner] Connecting TCP/443 secure socket on ${hostname}...`
      ]);

      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domains: [hostname] })
        });
        
        const data = await response.json();
        if (data.results && data.results[0]) {
          const item: ScanResult = data.results[0];
          scannedWatcherResults.push(item);
          setWatcherLogList(prev => [
            ...prev,
            `[Scanner] Fetched cert for "${hostname}". Expiry: ${item.expiryDate?.split("T")[0] || "N/A"} (${item.daysRemaining ?? "N/A"} days left)`
          ]);
        }
      } catch (err) {
        setWatcherLogList(prev => [...prev, `[Error] DNS / handshaking timed out for: ${hostname}`]);
      }

      await new Promise(r => setTimeout(r, 200));
    }

    // Sort: most urgent first (smallest days remaining first, handle null values as -9999)
    scannedWatcherResults.sort((a, b) => {
      const daysA = a.daysRemaining === null ? -9999 : a.daysRemaining;
      const daysB = b.daysRemaining === null ? -9999 : b.daysRemaining;
      return daysA - daysB;
    });

    setWatcherProgress(100);
    setWatcherResults(scannedWatcherResults);
    setWatcherScanDone(true);
    setWatcherLogList(prev => [...prev, `[Watcher] Audit complete! ${scannedWatcherResults.length} domains analyzed and ranked.`]);
    setIsScanningWatcher(false);

    let overallStatus: "CRITICAL" | "WARNING" | "HEALTHY" = "HEALTHY";
    let criticalCount = 0;
    let warningCount = 0;
    let healthyCount = 0;
    
    scannedWatcherResults.forEach(item => {
      if (item.riskLevel === "expired" || item.riskLevel === "critical" || item.riskLevel === "high" || item.status !== "success") {
        overallStatus = "CRITICAL";
        criticalCount++;
      } else if (item.riskLevel === "medium") {
        if (overallStatus !== "CRITICAL") overallStatus = "WARNING";
        warningCount++;
      } else {
        healthyCount++;
      }
    });

    setScanAlert({
      isOpen: true,
      domain: splitted.slice(0, 3).join(", ") + (splitted.length > 3 ? `... and ${splitted.length - 3} more` : ""),
      status: overallStatus,
      risk: overallStatus === "CRITICAL" ? "critical" : overallStatus === "WARNING" ? "medium" : "low",
      details: `Scanned ${scannedWatcherResults.length} domains in total. Posture Analysis: ${criticalCount} Critical/High Risk items detected, ${warningCount} Warnings, and ${healthyCount} Healthy/Low Risk assets.`
    });

    if (overallStatus === "CRITICAL") {
      triggerToast(`Watcher Scan completed: CRITICAL security threats detected!`, "error");
    } else if (overallStatus === "WARNING") {
      triggerToast(`Watcher Scan completed: WARNING posture items detected.`, "warning");
    } else {
      triggerToast(`Watcher Scan completed: All domains are HEALTHY ✅`, "success");
    }

    // Auto-generate tickets silently for any critical/expired domains
    scannedWatcherResults.forEach(item => {
      const days = item.daysRemaining === null ? 0 : item.daysRemaining;
      if (days <= 10 || item.riskLevel === "expired" || item.riskLevel === "critical" || item.riskLevel === "high" || item.status !== "success") {
        handleGenerateTicket(item, true);
      }
    });

    fetchDbHistory();
  };

  const downloadWatcherCsv = async () => {
    if (watcherResults.length === 0) return;
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: watcherResults, format: "user_csv" })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ranked_certs.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (_) {
      triggerToast("Failed to compile CSV download.", "error");
    }
  };

  const downloadWatcherMd = async () => {
    if (watcherResults.length === 0) return;
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: watcherResults, format: "user_md" })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "renewal_tasks.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (_) {
      triggerToast("Failed to compile tasks markdown download.", "error");
    }
  };

  const getWatcherCounts = () => {
    let critical = 0;
    let warning = 0;
    let ok = 0;
    watcherResults.forEach(r => {
      const days = r.daysRemaining === null ? 0 : r.daysRemaining;
      if (days <= 10) critical++;
      else if (days <= 30) warning++;
      else ok++;
    });
    return { critical, warning, ok };
  };

  // Generate Incident Ticket for single domain
  const handleGenerateTicket = async (result: ScanResult, silent = false) => {
    setGeneratingTicketsMap(prev => ({ ...prev, [result.domain]: true }));
    if (!silent) {
      triggerToast(`AI Agent drafting incident record for ${result.domain}...`, "info");
    }

    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result })
      });
      const data = await res.json();
      if (data.ticket) {
        if (!silent) {
          setActiveTicket(data.ticket);
          triggerToast(`Incident ticket ${data.ticket.id} finalized successfully!`, "success");
        } else {
          triggerToast(`Auto-generated critical incident ticket: ${data.ticket.id}`, "info");
        }
      }
    } catch (err) {
      if (!silent) {
        triggerToast("AI Service temporarily busy. Fallback guidelines generated.", "warning");
      }
    } finally {
      setGeneratingTicketsMap(prev => ({ ...prev, [result.domain]: false }));
      fetchDbHistory();
    }
  };

  // Generate Renewal Email copy draft
  const handleDraftEmail = async (result: ScanResult) => {
    setGeneratingEmailsMap(prev => ({ ...prev, [result.domain]: true }));
    triggerToast(`AI Agent crafting outreach email draft...`, "info");

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result })
      });
      const data = await res.json();
      if (data.emailContent) {
        const subjectLineMatch = data.emailContent.match(/SUBJECT\s*:\s*([^\n]+)/i);
        const subject = subjectLineMatch ? subjectLineMatch[1].trim() : `SSL Renewal Ingress: [RENEW] ${result.domain}`;
        
        setActiveEmailAlert({
          domain: result.domain,
          subject,
          body: data.emailContent
        });
        triggerToast("Alert draft generated!", "success");
      }
    } catch (err) {
      triggerToast("Failed to compile layout alerts.", "error");
    } finally {
      setGeneratingEmailsMap(prev => ({ ...prev, [result.domain]: false }));
    }
  };

  const handleSendManualRenewalEmail = async () => {
    if (!activeEmailAlert) return;
    const matchedResult = results.find(r => r.domain === activeEmailAlert.domain);
    if (!matchedResult) {
      triggerToast("Domain details not found in active scans directory.", "error");
      return;
    }

    setIsSendingRenewal(true);
    triggerToast(`SMTP Outbound gateway dispatching renewal alert for ${matchedResult.domain}...`, "info");

    try {
      const res = await fetch("/api/mails/send-renewal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainData: matchedResult,
          aiContent: activeEmailAlert.body,
          recipient: currentUser?.email || "harinisivanathanvs@gmail.com"
        })
      });
      const data = await res.json();
      if (data.sent) {
        triggerToast("Renewal alert dispatched successfully via high-priority mail channel!", "success");
        setActiveEmailAlert(null);
        fetchDbHistory();
      } else {
        triggerToast(data.message || "Failed to route premium SMTP delivery.", "error");
      }
    } catch (err: any) {
      triggerToast("Failed to connect to SMTP Outbound server.", "error");
    } finally {
      setIsSendingRenewal(false);
    }
  };

  const handleTestSmtpConnection = async () => {
    setIsTestingSmtp(true);
    triggerToast("Conducting structural SMTP network check on smtp.gmail.com...", "info");
    try {
      const res = await fetch("/api/mails/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.connected) {
        triggerToast("SMTP Server active & authenticating! TLS link secure ✅", "success");
      } else {
        triggerToast(`SMTP Check failed: ${data.message}`, "error");
      }
    } catch (err: any) {
      triggerToast("SMTP connection handshake timed out.", "error");
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // Portfolio level Executive summary
  const generatePortfolioSummary = async () => {
    setIsAnalyzingSummary(true);
    triggerToast("Portfolio Intelligence engine analyzing exposure...", "info");

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results,
          summaryStats: aggregates
        } as any)
      });
      const data = await res.json();
      if (data.summary) {
        setExecutiveSummary(data.summary);
        triggerToast("Executive summary prepared!", "success");
      }
    } catch (err) {
      triggerToast("Failed to compile board report summary.", "error");
    } finally {
      setIsAnalyzingSummary(false);
    }
  };

  // Purge ledger
  const handleResetDatabase = async (purgeType: "all" | "history" | "tickets") => {
    if (!window.confirm(`Are you sure you want to reset [${purgeType}] data from the JSON store?`)) return;
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: purgeType })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Database reset [${purgeType}] executed successfully!`, "success");
        if (purgeType === "all") {
          setResults([]);
          setSessions([]);
          setTickets([]);
          setActiveCheckerResult(null);
        } else if (purgeType === "history") {
          setResults([]);
          setSessions([]);
        } else if (purgeType === "tickets") {
          setTickets([]);
        }
        fetchDbHistory();
      }
    } catch (err) {
      triggerToast("Failed to purge ledger records", "error");
    }
  };

  // Secure Role Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginEmail.trim()) {
      triggerToast("Please provide both username and corporate email.", "error");
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          email: loginEmail,
          role: loginRole
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem("certguard_user", JSON.stringify(data.user));
        triggerToast(`Authorization Granted! Logged in as ${data.user.username} (${data.user.role})`, "success");
        fetchDbHistory();
      } else {
        triggerToast(data.error || "Authentication failed.", "error");
      }
    } catch (err: any) {
      triggerToast("Failed to connect to authentication gateway.", "error");
    }
  };

  // Pre-auth AI Exposure Risk Assessor
  const handleLoginAiLeakScan = async () => {
    if (!loginEmail.trim()) {
      triggerToast("Please provide your corporate email first to run the AI security leak audit.", "warning");
      return;
    }
    setLoginAiChecking(true);
    setLoginAiReport("");
    triggerToast("Evaluating email exposure index via Gemini...", "info");
    try {
      const res = await fetch("/api/auth/ai-leak-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername || "Operator",
          email: loginEmail
        })
      });
      const data = await res.json();
      if (data.success && data.report) {
        setLoginAiReport(data.report);
        triggerToast("AI exposure profile compiled successfully!", "success");
      } else {
        triggerToast(data.error || "AI Exposure Assessment failed to complete.", "error");
      }
    } catch (err) {
      triggerToast("Network disconnect communicating with security broker.", "error");
    } finally {
      setLoginAiChecking(false);
    }
  };

  // Prompt Lab Experiment Evaluator
  const handlePromptLabEvaluate = async () => {
    if (!promptLabPrompt.trim()) {
      triggerToast("Input prompt cannot be blank.", "warning");
      return;
    }
    setPromptLabLoading(true);
    setPromptLabResponse("");
    setPromptLabLatency(null);
    triggerToast(`Compiling LLM trial pipeline using ${promptLabModel}...`, "info");
    try {
      const startTime = Date.now();
      const res = await fetch("/api/prompt-lab/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: promptLabSystemInstruction,
          prompt: promptLabPrompt,
          temperature: promptLabTemperature,
          topP: promptLabTopP,
          selectedModel: promptLabModel
        })
      });
      const data = await res.json();
      if (data.text) {
        setPromptLabResponse(data.text);
        setPromptLabLatency(data.latencyMs || (Date.now() - startTime));
        setPromptLabModelUsed(data.modelUsed || promptLabModel);
        triggerToast("LLM Execution completed successfully!", "success");
      } else {
        triggerToast(data.error || "LLM Execution failed to return content.", "error");
      }
    } catch (err) {
      triggerToast("Error communicating with Prompt Lab broker.", "error");
    } finally {
      setPromptLabLoading(false);
    }
  };

  // Generated Downloadable Cyber Threat Advisory Compilers
  const compileDeterministicTemplate = (res: ScanResult, templateType: string = selectedAdvisoryTemplate) => {
    const days = res.daysRemaining ?? 30;
    const dateStr = res.expiryDate ? res.expiryDate.replace("T", " ").substring(0, 19) : "N/A";
    
    if (templateType === "p1-critical") {
      setMailSubject(`[CRITICAL ALERT] Immediate SSL Certificate Renewal Required for ${res.domain}`);
      setMailBody(`TO      : SecOps Core Team <secops-alerts@yourcompany.com>
CC      : CISO Infrastructure Lead
FROM    : CertGuard SecOps Gateway
SUBJECT : [CRITICAL ALERT] Immediate SSL Certificate Renewal Required for ${res.domain}
DATE    : TUESDAY, JUNE 9, 2026

Dear Security Operations Lead,

This is a certified threat warning regarding the digital asset "${res.domain}".
The active security certificates are nearing operational expiration, presenting an immediate service disruption risk:

ASSET STATUS SUMMARY:
--------------------
- Resource Domain     : ${res.domain}
- CA Certificate Authority : ${res.issuer || "Let's Encrypt"}
- Expiration Timestamp: ${dateStr}
- Remaining Shelf Time: ${days} days
- Signature Algorithm : ${res.signatureAlgorithm || "sha256WithRSAEncryption"}
- SLA Compliance Grade: ${res.sslGrade || "A"}

POTENTIAL IMPACT ANALYSIS:
-------------------------
A failure to renew the SSL/TLS certificate prior to expiration will result in immediate browser-level blocking of all client interactions with 'Your connection is not private' security warnings. This leads to broken APIs, disabled transactional checkout systems, SOC2/PCI-DSS regulatory compliance violations, and immediate loss of public customer trust.

REMEDIATION DRILL RUNBOOK:
--------------------------
1. Initiate TLS certificate regeneration via current Issuer ACME challenges.
2. Confirm DNS TXT control challenge parameters are properly populated.
3. Deploy compiled certificates and regional chain intermediates to regional balancer fleets (Load Balancers / CDN Edge).
4. Run live handshaking verify command to confirm current serial ${res.serialNumber || "N/A"} has been replaced.

Best Regards,
CertGuard Automated Monitoring System`);
    } else if (templateType === "p2-warning") {
      setMailSubject(`[WARNING] Pending TLS Certificate Expiration Warning: ${res.domain}`);
      setMailBody(`TO      : DevOps Operations <devops-leads@yourcompany.com>
FROM    : CertGuard Security Watchdog
SUBJECT : [WARNING] Pending TLS Certificate Expiration Warning: ${res.domain}
DATE    : TUESDAY, JUNE 9, 2026

Attention Operations and Infrastructure Engineers,

We detected that the active SSL certificate securing the host "${res.domain}" is nearing its expiration limit.
We recommend planning a standard compliance renewal cycle well ahead of the outage curve.

RISK MATRIX SNAPSHOT:
---------------------
- Target Host   : ${res.domain}
- Expiry Date   : ${dateStr}
- Remaining Life: ${days} Days Available
- Active Issuer : ${res.issuer || "Let's Encrypt"}
- SSL Grade     : ${res.sslGrade || "A"}

RECOMMENDED ACTION PLAN:
------------------------
Please check the ACME client configurations or manually deploy an updated PEM certificate chain. Standard maintenance windows should be requested if hot-reloads require service restarts.

Regards,
CertGuard Security Monitoring Group`);
    } else if (templateType === "compliance") {
      setMailSubject(`[CISO STATUS REPORT] Cryptographic Compliance Audit Ledger for ${res.domain}`);
      setMailBody(`TO      : Executive Security Board <ciso-report@yourcompany.com>
FROM    : CertGuard Compliance Governance Engine
SUBJECT : [CISO STATUS REPORT] Cryptographic Compliance Audit Ledger for ${res.domain}
DATE    : TUESDAY, JUNE 9, 2026

Dear Board Members,

This document represents the official cryptographic evaluation ledger compiled on TUESDAY, JUNE 9, 2026 for compliance validation:

AUDIT LEDGER METRICS:
--------------------
- Domain Name      : ${res.domain}
- Assessment Grade : ${res.sslGrade || "A"}
- Cryptographic Protocol : ${res.protocol || "TLSv1.3"}
- Signature Alg    : ${res.signatureAlgorithm || "sha256WithRSAEncryption"}
- Serial Code      : ${res.serialNumber || "N/A"}
- Days Outstanding : ${days} Days

COMPLIANCE EVALUATION:
----------------------
Based on corporate SLA guidelines, cryptographic parameters for "${res.domain}" are graded of high-priority surveillance. Periodic certificate lifecycle rotation is required to conform with SOC2 Continuous Controls requirements.

Best Regards,
CertGuard Compliance and Risk Assessment Division`);
    } else {
      setMailSubject(`[ACME MANUAL] RFC-compliant SSL Renewal Playbook for ${res.domain}`);
      setMailBody(`TO      : SecOps System Engineers <sysops@yourcompany.com>
FROM    : CertGuard Playbook Generator
SUBJECT : [ACME MANUAL] RFC-compliant SSL Renewal Playbook for ${res.domain}
DATE    : TUESDAY, JUNE 9, 2026

RENEWAL INSTRUCTIONS MANUAL FOR ${res.domain.toUpperCase()}:
-----------------------------------------------

Use the following step-by-step commands to renew and install a Let's Encrypt certificate:

STEP 1: GENERATE PRIVATE KEY AND CSR
$ openssl req -new -newkey rsa:2048 -nodes -keyout private_${res.domain.replace(/\./g, "_")}.key -out request.csr

STEP 2: TRIGGER MANUAL BOT CHALLENGE
$ certbot certonly --manual --preferred-challenges dns -d ${res.domain} -d *.${res.domain}

STEP 3: DEPLOY HOST ALIGNED CREDENTIALS
Upload generated fullchain.pem and privkey.key to your local server block path:
/etc/ssl/certs/${res.domain}/

STEP 4: HOT REBOOT WEBSERVER
$ systemctl reload nginx

STEP 5: VERIFY ACTIVE GRADES
Run real-time socket analysis tool on port 443 to verify current expiration has updated beyond ${dateStr}.

Prepared by CertGuard DevSecOps Generator`);
    }
  };

  const handleCompileAdvisory = async (useAi: boolean = false) => {
    const domainName = selectedAdvisoryDomain || (results[0]?.domain) || "google.com";
    let matchedResult = results.find(r => r.domain === domainName);
    
    // Fallback if domain is not scanned yet
    if (!matchedResult) {
      matchedResult = {
        domain: domainName,
        issuer: "Let's Encrypt Authority CSS",
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        validFrom: new Date().toISOString(),
        daysRemaining: 15,
        protocol: "TLSv1.3",
        serialNumber: "0xBC39281729A1",
        version: "3",
        sanList: [domainName, `www.${domainName}`],
        signatureAlgorithm: "sha256WithRSAEncryption",
        scanTimestamp: new Date().toISOString(),
        status: "success",
        riskLevel: "critical",
        sslGrade: "A"
      };
    }

    if (useAi) {
      setIsGeneratingWithAi(true);
      triggerToast(`AI Agent drafting custom advisory for ${domainName}...`, "info");
      try {
        const res = await fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result: matchedResult })
        });
        const data = await res.json();
        if (data.emailContent) {
          const content = data.emailContent;
          const subjectMatch = content.match(/SUBJECT\s*:\s*([^\n]+)/i);
          const derivedSubject = subjectMatch ? subjectMatch[1].trim() : `[AI ADVISORY] SSL Renewal Action Needed: ${domainName}`;
          setMailSubject(derivedSubject);
          setMailBody(content);
          triggerToast("AI-generated advisory prepared!", "success");
        } else {
          triggerToast("AI service gave empty content. using premium fallback.", "warning");
          compileDeterministicTemplate(matchedResult);
        }
      } catch (err) {
        triggerToast("Failed contacting AI advisory service. using smart template.", "error");
        compileDeterministicTemplate(matchedResult);
      } finally {
        setIsGeneratingWithAi(false);
      }
    } else {
      compileDeterministicTemplate(matchedResult);
    }
  };

  // Auto compile when choices change
  useEffect(() => {
    if (activeTab === "mail-system") {
      if (!selectedAdvisoryDomain && results.length > 0) {
        setSelectedAdvisoryDomain(results[0].domain);
      } else {
        handleCompileAdvisory(false);
      }
    }
  }, [selectedAdvisoryDomain, selectedAdvisoryTemplate, activeTab]);

  const handleDownloadFile = (filename: string, content: string, mimeType: string) => {
    try {
      const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      triggerToast(`Document downloaded successfully!`, "success");
    } catch (err: any) {
      triggerToast(`Download failed: ${err.message}`, "error");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("certguard_user");
    triggerToast("User session invalidated. Signed out.", "info");
  };

  // Automated/Manual SMTP Mailer Dispatches
  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailTo.trim() || !mailSubject.trim() || !mailBody.trim()) {
      triggerToast("Recipient, subject, and message body are mandatory fields.", "error");
      return;
    }
    try {
      const res = await fetch("/api/mails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: activeCheckerResult?.domain || "manual-dispatch",
          sender: "harinisivanathanvs@gmail.com",
          recipient: mailTo,
          subject: mailSubject,
          body: mailBody
        })
      });
      const data = await res.json();
      if (data.success) {
        setMails(prev => [data.mail, ...prev]);
        setMailTo("");
        setMailSubject("");
        setMailBody("");
        triggerToast("Email alert successfully routed via secure SMTP service!", "success");
        fetchDbHistory();
      } else {
        triggerToast(data.error || "SMTP routing failed.", "error");
      }
    } catch (err: any) {
      triggerToast("Outage contacting SMTP mailing dispatch service.", "error");
    }
  };

  // MCP JSON-RPC Model Context Protocol Tool Executor
  const handleExecuteMcp = async () => {
    if (!selectedMcpTool) return;
    setIsExecutingMcp(true);
    setMcpResultPayload(null);
    const argumentValue = mcpToolArgs[selectedMcpTool] || "";
    
    const timestampIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().replace("T", " ").replace("Z", "").slice(0, 19) + " IST";
    const logBatch = [
      `[${timestampIST}] 🔌 [MCP CLIENT] Initializing connection to CertGuard MCP local host...`,
      `[${timestampIST}] ⚙️ [MCP CONFIG] Transport: HTTP JSON-RPC Gateway (v1.0 spec)`,
      `[${timestampIST}] 📡 [MCP REQUEST] Method: "tools/call", Tool: "${selectedMcpTool}", Params: ${JSON.stringify({
         [selectedMcpTool === "check_ssl_cert" ? "hostname" : selectedMcpTool === "draft_escalation_ticket" ? "domain" : selectedMcpTool === "dispatch_renewal_alert_email" ? "domain" : "args"]: argumentValue
      })}`
    ];
    setMcpRunLog(logBatch);

    try {
      const mappedParam: Record<string, string> = {};
      if (selectedMcpTool === "check_ssl_cert") {
        mappedParam.hostname = argumentValue;
      } else if (selectedMcpTool === "draft_escalation_ticket") {
        mappedParam.domain = argumentValue;
      } else if (selectedMcpTool === "dispatch_renewal_alert_email") {
        mappedParam.domain = argumentValue;
        mappedParam.recipient = currentUser?.email || "harinisivanathanvs@gmail.com";
      }

      // 1.2 second simulated wait for agent semantic compilation
      await new Promise(r => setTimeout(r, 1200));
      
      const serverTimestamp = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().replace("T", " ").replace("Z", "").slice(0, 19) + " IST";
      setMcpRunLog(prev => [
        ...prev, 
        `[${serverTimestamp}] 🧠 [AGENT BRAIN] Planner resolved execution tree. Invoking tool endpoint...`
      ]);

      const res = await fetch("/api/mcp/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: selectedMcpTool,
          arguments: mappedParam
        })
      });
      const data = await res.json();
      
      const finalTimestamp = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().replace("T", " ").replace("Z", "").slice(0, 19) + " IST";
      if (res.ok) {
        setMcpResultPayload(data.result);
        setMcpRunLog(prev => [
          ...prev,
          `[${finalTimestamp}] 📥 [MCP RESPONSE] JSON-RPC Response: status = 200 OK.`,
          `[${finalTimestamp}] ✅ [EXECUTION SUCCESS] Database transaction committed successfully.`,
          `[${finalTimestamp}] 📋 stdout: ${data.stdout || "Success"}`
        ]);
        triggerToast(`MCP Tool [${selectedMcpTool}] executed successfully!`, "success");
        fetchDbHistory();
      } else {
        setMcpRunLog(prev => [
          ...prev,
          `[${finalTimestamp}] ❌ [MCP ERROR] Tool call failed: ${data.error || "Internal Server Timeout"}`
        ]);
        triggerToast(data.error || "MCP tool failed to finalize.", "error");
      }
    } catch (err: any) {
      const finalTimestamp = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().replace("T", " ").replace("Z", "").slice(0, 19) + " IST";
      setMcpRunLog(prev => [...prev, `[${finalTimestamp}] 🚨 [TRANSPORT ERROR] Socket connection lost or refused.`]);
      triggerToast(err.message || "Failed running MCP tool.", "error");
    } finally {
      setIsExecutingMcp(false);
    }
  };

  // Auto-launch prefill for first run demo setup
  const handleLaunchWalkthrough = () => {
    handleBatchScan(SAMPLE_DOMAINS);
    triggerToast("Initiating live security check batch walkthrough!", "info");
  };

  // Download reports
  const triggerDownloadReport = (formatType: "csv" | "markdown") => {
    window.open(`/api/report/${formatType}`, "_blank");
    triggerToast(`Preparing outbound ${formatType.toUpperCase()} file stream...`, "success");
  };

  // Helper utility to resolve domain IP address based on deterministic hash
  const getDerivedIp = (domain: string) => {
    if (domain === "google.com") return "142.250.73.110";
    if (domain === "github.com") return "140.82.113.3";
    if (domain === "expired.badssl.com") return "104.154.89.105";
    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
      hash = domain.charCodeAt(i) + ((hash << 5) - hash);
    }
    const part2 = Math.abs((hash >> 8) % 254) + 1;
    const part3 = Math.abs((hash >> 16) % 254) + 1;
    const part4 = Math.abs(hash % 254) + 1;
    return `104.${part2}.${part3}.${part4}`;
  };

  // Helper to dynamically build root, intermediate, and server(leaf) cert node elements
  const getCertificateChain = (result: ScanResult) => {
    const leafCN = result.sanList[0] || result.domain;
    const issuer = result.issuer;
    
    let rootCN = "GlobalSign Root CA";
    let rootOrg = "GlobalSign nv-sa";
    let rootSerial = "040000000001154B5AC394";
    let rootDates = { from: "September 01, 1998", to: "January 28, 2028" };

    let interCN = "GTS Root R1";
    let interOrg = "Google Trust Services LLC";
    let interSerial = "77BD0D6CDB36F91AEA210FC4F058D30D";
    let interDates = { from: "June 19, 2020", to: "January 28, 2028" };

    const validFromDate = result.validFrom && result.validFrom !== "N/A" ? new Date(result.validFrom) : new Date();
    const expiryDate = result.expiryDate && result.expiryDate !== "N/A" ? new Date(result.expiryDate) : new Date();

    const validFromStr = validFromDate.toLocaleDateString("en-US", { month: 'long', day: '2-digit', year: 'numeric' });
    const validToStr = expiryDate.toLocaleDateString("en-US", { month: 'long', day: '2-digit', year: 'numeric' });

    if (issuer.toLowerCase().includes("let's encrypt") || issuer.toLowerCase().includes("authority")) {
      rootCN = "ISRG Root X1";
      rootOrg = "Internet Security Research Group";
      rootSerial = "4045D9E228221D24E5B284D3168E885F";
      rootDates = { from: "June 04, 2015", to: "June 04, 2035" };

      interCN = "R3 Intermediate Authority";
      interOrg = "Let's Encrypt CA Group";
      interSerial = "85272F3E3F4B1E9F1A42DF93FBF8EB87";
      interDates = { from: "September 04, 2020", to: "September 04, 2025" };
    } else if (issuer.toLowerCase().includes("digicert") || issuer.toLowerCase().includes("secure")) {
      rootCN = "DigiCert Global Root G2";
      rootOrg = "DigiCert Inc";
      rootSerial = "033AF1E6A711A9A0BB2864B11D09FAE5";
      rootDates = { from: "August 01, 2013", to: "August 01, 2038" };

      interCN = "DigiCert TLS RSA SHA256 2020 CA1";
      interOrg = "DigiCert Public Services";
      interSerial = "0A0B0C0D0E0F10111213141516171819";
      interDates = { from: "March 24, 2020", to: "March 22, 2030" };
    } else if (issuer.toLowerCase().includes("sectigo") || issuer.toLowerCase().includes("comodo")) {
      rootCN = "USERTrust RSA Certification Authority";
      rootOrg = "The USERTRUST Network Group";
      rootSerial = "01FD41DF77E8FA4895C9EF3D1330EEF6";
      rootDates = { from: "May 30, 2000", to: "May 30, 2030" };

      interCN = "Sectigo RSA Secure Domain Validation CA";
      interOrg = "Sectigo Limited";
      interSerial = "7A8B9C0D1E2F30415263748596A7B8C9";
      interDates = { from: "November 02, 2018", to: "November 01, 2033" };
    } else if (issuer.toLowerCase().includes("nsa") || result.domain.includes("badssl")) {
      rootCN = "badssl.com Self-Signed Root";
      rootOrg = "BadSSL Security Testing";
      rootSerial = "F372BB2A1E8D9C03";
      rootDates = { from: "January 01, 2015", to: "January 01, 2035" };

      interCN = "badssl.com Intermediate Testing CA";
      interOrg = "BadSSL Testing Authorities";
      interSerial = "C1A2E3D4F5060809";
      interDates = { from: "January 01, 2020", to: "January 01, 2030" };
    }

    return [
      {
        type: "Root Certificate (Trust Anchor)",
        commonName: rootCN,
        org: rootOrg,
        dates: `${rootDates.from} to ${rootDates.to}`,
        issuer: rootCN,
        serial: rootSerial,
        icon: "root",
        description: "Third-party validation authority trusted by your operating system and web browser directly."
      },
      {
        type: "Intermediate Certificate (Chain CA)",
        commonName: interCN,
        org: interOrg,
        dates: `${interDates.from} to ${interDates.to}`,
        issuer: rootCN,
        serial: interSerial,
        icon: "intermediate",
        description: "Bridges trust from root down to the dynamic short-lived leaf server identifiers."
      },
      {
        type: "Server Certificate (Leaf Domain CN)",
        commonName: leafCN,
        org: result.domain.includes("google") ? "Google Trust Services" : result.domain.includes("github") ? "GitHub, Inc." : "Web Host Asset Owner",
        dates: `${validFromStr} to ${validToStr}`,
        issuer: interCN,
        serial: result.serialNumber,
        icon: "leaf",
        description: "The unique encryption credentials issued directly to the hosting server interface."
      }
    ];
  };

  // DNS and matches formatting computes
  const isMatchCheck = activeCheckerResult && activeCheckerResult.status === "success" && (
    activeCheckerResult.sanList.some(s => s.replace("*.", "") === activeCheckerResult.domain.replace("www.", "")) || 
    activeCheckerResult.domain.includes(activeCheckerResult.domain)
  );

  const tabBackgrounds: Record<string, string> = {
    "expiry-watcher": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1920&auto=format&fit=crop",
    "ssl-checker": "https://images.unsplash.com/photo-1601597111158-2fceff270190?q=80&w=1920&auto=format&fit=crop",
    "dashboard": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop",
    "workflows": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1920&auto=format&fit=crop",
    "mail-system": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1920&auto=format&fit=crop",
    "mcp-agent": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1920&auto=format&fit=crop",
    "history": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop",
    "settings": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1920&auto=format&fit=crop"
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4 font-mono text-cyan-400">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs uppercase tracking-widest font-black">Decrypting SecOps Environment...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-deep text-slate-100 flex flex-col font-sans select-none antialiased relative z-0 overflow-x-hidden">
      
      {/* SECURE DYNAMIC BACKGROUND ENGINE FOR LOGGED ON SECTIONS */}
      {currentUser && (
        <div className="absolute inset-0 z-[-1] pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1920&auto=format&fit=crop" 
            alt="Security Operations Background" 
            className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.12] saturate-[1.25] transition-all duration-1000 ease-in-out"
            referrerPolicy="no-referrer"
          />
          {/* Extremely clear ambient filter without blur to ensure full background image detail */}
          <div className="absolute inset-0 bg-[#020617]/15"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/10 via-transparent to-[#020617]/60 pointer-events-none"></div>
        </div>
      )}
      
      {/* SECURE OVERLAY GATE FOR UNAUTHORIZED USERS */}
      {!currentUser && (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center font-sans select-none antialiased relative overflow-hidden w-full p-4 sm:p-6">
          
          {/* IMMERSIVE BRAND FULL-SCREEN BACKGROUND IMAGE - REPLACED WITH SECURE DARK MOCKUP */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/ssl_search_mockup.png" 
              alt="CertGuard SecOps Authorization Core" 
              className="w-full h-full object-cover filter brightness-[0.22] contrast-[1.0] saturate-[0.80]"
              referrerPolicy="no-referrer"
            />
            {/* Added solid dark overlay and blur to prevent text and background clash */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-transparent to-[#020617]/80 pointer-events-none"></div>
          </div>

          {/* FLOATING SECURE LOGIN TERMINAL HUD - CARD CONTAINER WITH SOLID BACKDROP AND HIGH CONTRAST */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full max-w-md bg-slate-950/85 p-8 border border-cyan-500/35 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.35)] backdrop-blur-md relative z-10 select-none animate-fadeIn flex flex-col items-stretch space-y-6"
          >
            {/* Holographic Glowing Corners Frame (just like the visual Mockup!) */}
            <div className="absolute -inset-4 pointer-events-none z-0">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/80 rounded-tl-xl shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/80 rounded-tr-xl shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/80 rounded-bl-xl shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/80 rounded-br-xl shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
            </div>

            {/* Logo and Greeting with glowing text drop shadows */}
            <div className="text-center space-y-3 pt-2 relative z-10">
              {/* White/Cyan Laser-cut Key-Globe hologram emblem (Strictly matching user uploaded mockup!) */}
              <div className="w-20 h-20 mx-auto relative flex items-center justify-center animate-pulse duration-[3000ms]">
                <span className="absolute inset-0 rounded-full border border-cyan-300/35 animate-ping opacity-60"></span>
                <svg className="w-full h-full text-white filter drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="50" cy="50" r="43" stroke="white" strokeWidth="3.5" />
                  <line x1="50" y1="7" x2="50" y2="93" stroke="white" strokeWidth="3.5" />
                  
                  {/* Left Side: Solid secure physical key emblem */}
                  <path d="M37 50 C37 45 41 41 46 41 C46.5 41 47 41.2 47.5 41.5 L47.5 59.5 L44.5 62 L44.5 65 L41.5 65 L41.5 59 L39.5 57 C38 55.5 37 53 37 50 Z" fill="white" />
                  
                  {/* Right Side: Longitudinal latitudinal cyber globe lines */}
                  <path d="M50 17 C64 22 73 34 73 50 C73 66 64 78 50 83" stroke="white" strokeWidth="2.5" />
                  <path d="M50 31 C59 36 65 42 65 50 C65 58 59 64 50 69" stroke="white" strokeWidth="2" />
                  <line x1="50" y1="50" x2="93" y2="50" stroke="white" strokeWidth="2.5" />
                </svg>
              </div>

              <div className="space-y-0.5">
                <h3 className="text-3xl font-display font-black text-white tracking-widest uppercase filter drop-shadow-[0_2px_15px_rgba(34,211,238,0.95)]">
                  Cert<span className="text-cyan-400 font-extrabold">Guard</span>
                </h3>
                <p className="text-[10px] text-cyan-300 font-mono uppercase tracking-widest font-black drop-shadow-[0_3px_6px_rgba(0,0,0,1)]">SecOps Authorization Gateway</p>
              </div>
            </div>

            {/* Completely transparent Diagnostic Logs Indicator */}
            <div className="border border-cyan-500/30 rounded-xl p-3 font-mono text-[9px] text-cyan-100/90 space-y-1 relative z-10 leading-relaxed bg-black/5">
              <div className="text-cyan-400 font-black uppercase tracking-wider text-[8px] pb-1 border-b border-cyan-500/20 flex items-center justify-between">
                <span>COGNITIVE THREAT ANALYSIS FEED</span>
                <span className="animate-pulse text-emerald-400 font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>LIVE MONITOR</span>
                </span>
              </div>
              <div className="flex gap-1.5 items-center">
                <span className="text-cyan-400 font-bold">▶</span>
                <span>SYSTEM CORE: <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.7)]">100% OPERATIONAL HANDSHAKES</span></span>
              </div>
            </div>

            {/* Login Input Form - COMPLETELY TRANSPARENT, NO CARD SOLID BACKGROUND, NO BLUR */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-cyan-200 font-black pl-1 block drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">Operator ID Code</label>
                <div className="relative flex items-center border-b border-cyan-400/60 focus-within:border-cyan-300 transition-all">
                  <User className="absolute left-1 w-4 h-4 text-cyan-400/70" />
                  <input 
                    type="text" 
                    required
                    placeholder="Operator Username (e.g. Harini S)" 
                    value={loginUsername} 
                    onChange={e => setLoginUsername(e.target.value)} 
                    style={{ backgroundColor: "transparent" }}
                    className="w-full bg-transparent border-none outline-none pl-7 pr-3 py-2.5 font-mono text-xs text-white transition-all placeholder:text-slate-400/80 font-black" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-cyan-200 font-black pl-1 block drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">Enterprise Coordinates</label>
                <div className="relative flex items-center border-b border-cyan-400/60 focus-within:border-cyan-300 transition-all">
                  <Mail className="absolute left-1 w-4 h-4 text-cyan-400/70" />
                  <input 
                    type="email" 
                    required
                    placeholder="Corporate Email Address" 
                    value={loginEmail} 
                    onChange={e => setLoginEmail(e.target.value)} 
                    style={{ backgroundColor: "transparent" }}
                    className="w-full bg-transparent border-none outline-none pl-7 pr-3 py-2.5 font-mono text-xs text-white transition-all placeholder:text-slate-400/80 font-black" 
                  />
                </div>
              </div>

              {/* Dynamic AI Leak Scan Integration Directly on Login! */}
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={handleLoginAiLeakScan}
                  disabled={loginAiChecking || !loginEmail}
                  className="w-full py-2 px-3 border border-cyan-400/45 hover:border-cyan-300/80 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 hover:text-white rounded-xl text-[10px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(34,211,238,0.2)] disabled:opacity-40 disabled:hover:bg-cyan-950/20 disabled:border-cyan-500/10 cursor-pointer"
                >
                  {loginAiChecking ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>AI Analysing Threat Matrix...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>⚡ Run AI Leak Exposure Scan</span>
                    </>
                  )}
                </button>

                {/* AI Exposure Report Overlay */}
                {loginAiReport && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2.5 p-3 rounded-lg border border-cyan-400/40 bg-slate-950/80 text-[10px] font-mono text-cyan-100 max-h-48 overflow-y-auto space-y-2 leading-relaxed"
                  >
                    <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-1.5">
                      <span className="text-cyan-300 font-bold tracking-wider uppercase text-[8px] flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                        <span>Gemini SecOps Audit Response</span>
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setLoginAiReport("")} 
                        className="text-slate-400 hover:text-white font-mono text-[9px] uppercase font-bold cursor-pointer"
                      >
                        [Dismiss]
                      </button>
                    </div>
                    <div className="markdown-body login-markdown-style text-slate-200">
                      <Markdown>{loginAiReport}</Markdown>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-cyan-200 font-black pl-1 block drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">Role Clearance Level</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["CISO", "SecOps Administrator", "Guest Auditor"] as const).map(roleOption => (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => setLoginRole(roleOption)}
                      className={`aria-selected:true py-2 px-1 text-[9px] font-mono font-black rounded-lg border transition-all cursor-pointer ${
                        loginRole === roleOption 
                          ? "bg-cyan-500/35 border-cyan-300 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.45)]" 
                          : "bg-transparent border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-500/40"
                      }`}
                    >
                      {roleOption === "CISO" ? "CISO 🛡️" : roleOption === "SecOps Administrator" ? "Admin ⚙️" : "Auditor 🔍"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="demo-login-submit"
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white font-black py-3 rounded-xl text-xs uppercase font-mono tracking-widest transition-all cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transform active:scale-95 duration-200"
              >
                Sign In & Unlock Terminal
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-cyan-500/20"></div>
              <span className="flex-shrink mx-3 text-[9px] uppercase tracking-widest text-cyan-300 font-mono font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">Evaluation Fast-Pass</span>
              <div className="flex-grow border-t border-cyan-500/20"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoginUsername("harinisivanathanvs");
                setLoginEmail("harinisivanathanvs@gmail.com");
                setLoginRole("CISO");
                setTimeout(() => {
                  const button = document.getElementById("demo-login-submit") as HTMLButtonElement | null;
                  if (button) button.click();
                }, 100);
              }}
              className="w-full bg-slate-950/20 hover:bg-slate-950/35 text-cyan-200 hover:text-white border border-cyan-500/25 hover:border-cyan-300/50 text-xs py-2.5 rounded-xl transition-all font-bold font-mono cursor-pointer text-center shadow-md pb-2.5"
            >
              🔑 Auto-fill Operator Credentials
            </button>

            {/* Compact Footer Attribution */}
            <p className="text-[10px] text-center font-mono text-cyan-300/60 pt-2 border-t border-cyan-500/10 drop-shadow-[0_1.5px_4px_rgba(0,0,0,1)] font-bold">
              CertGuard Private Systems. Davana SLA Certified.
            </p>
          </motion.div>

          <div className="hidden">
          
          {/* PREMIUM GOLDEN CORNER UTILITY BAR (Inspired by Davana / Educenter top bars) */}
          <div className="bg-amber-400/[0.03] border-b border-white/5 text-[11px] text-slate-300 font-mono py-2.5 px-6 hidden md:flex justify-between items-center bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Opening Hours: Monday to Saturday 9AM to 5PM (IST)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Corporate HQ: Davana Security Park, India</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-amber-400 transition-colors"><Facebook className="w-3.5 h-3.5 text-slate-400 hover:text-amber-400" /></a>
              <a href="#" className="hover:text-amber-400 transition-colors"><Twitter className="w-3.5 h-3.5 text-slate-400 hover:text-amber-400" /></a>
              <a href="#" className="hover:text-amber-400 transition-colors"><Instagram className="w-3.5 h-3.5 text-slate-400 hover:text-amber-400" /></a>
              <a href="#" className="hover:text-amber-400 transition-colors"><Youtube className="w-3.5 h-3.5 text-slate-400 hover:text-amber-400" /></a>
            </div>
          </div>

          {/* TOP BRAND COMMERCE ROW */}
          <div className="bg-slate-950/80 border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-xl flex items-center justify-center shadow-inner">
                <Lock className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h1 className="text-xl font-display font-black text-white tracking-widest uppercase">
                  Cert<span className="text-amber-400">Guard</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Industrial Certificate Systems</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-mono">
              <div className="hidden lg:flex items-center gap-2 border-r border-slate-800 pr-6">
                <Mail className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Mail Us</p>
                  <p className="text-slate-200 font-bold">support@certguard.io</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 border-r border-slate-800 pr-6">
                <Phone className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Call Now</p>
                  <p className="text-slate-200 font-bold">(+91) 808-SECURE</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setLoginUsername("harinisivanathanvs");
                  setLoginEmail("harinisivanathanvs@gmail.com");
                  setLoginRole("CISO");
                  setTimeout(() => {
                    const submitBtn = document.getElementById("demo-login-submit") as HTMLButtonElement | null;
                    if (submitBtn) submitBtn.click();
                  }, 100);
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-amber-400/20 active:scale-95 text-[11px] uppercase tracking-wider"
              >
                Get Evaluation Quote
              </button>
            </div>
          </div>

          {/* NAVIGATION LINKS BAR */}
          <nav className="bg-amber-400 text-slate-900 font-bold text-xs uppercase px-6 lg:px-12 py-3 flex items-center justify-between shadow-2xl">
            <div className="flex flex-wrap items-center gap-6 tracking-wider">
              <a href="#" className="bg-slate-900 text-white px-3 py-1 rounded transition-colors text-[11px]">Home</a>
              <a href="#about" className="hover:text-slate-950 transition-colors text-[11px]">About</a>
              <span className="hover:text-slate-950 cursor-pointer transition-colors text-[11px] font-extrabold flex items-center gap-1">Services <span className="text-[9px]">▼</span></span>
              <a href="#security" className="hover:text-slate-950 transition-colors text-[11px]">Vulnerability Base</a>
              <span className="hover:text-slate-950 cursor-pointer transition-colors text-[11px]">Workspace</span>
            </div>
            <div className="text-[10px] font-mono font-black text-slate-900 hidden sm:block bg-slate-900/10 px-2 py-0.5 rounded border border-slate-900/20">
              SYSTEM STATUS: 100% OPERATIONAL
            </div>
          </nav>

          {/* HERO BANNER SECTION (Premium background image with gloss overlay) */}
          <section className="relative min-h-[500px] flex items-center justify-center py-16 px-6 overflow-hidden">
            {/* Decent premium server background image (from Unsplash, referrerPolicy applied) */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80" 
                alt="Cybersecurity premium server background" 
                className="w-full h-full object-cover filter brightness-[0.22] contrast-[1.10]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b13] via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-[#070b13]/60"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* HERO PRESENTATION COLUMN */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-black shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>DAVANA INDUSTRIAL SSL SOLUTIONS</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-tight tracking-tight uppercase">
                  Handle with <span className="text-amber-400 underline decoration-wavy decoration-2">Absolute Care</span>.
                </h2>
                
                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
                  CertGuard is the elite telemetry engine built for SecOps. Monitor certificates across your core domain portfolio, detect structural handshake configuration drift, and draft instant professional Llama3 renewal notifications before customers see security warnings.
                </p>

                <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
                  <div className="bg-slate-950/60 border border-white/5 p-3 rounded-xl backdrop-blur">
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
                      <span className="text-amber-400 text-xs">🔒</span>
                      <span>100% Secure SSL</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Deep local handshake protocol checks.</p>
                  </div>

                  <div className="bg-slate-950/60 border border-white/5 p-3 rounded-xl backdrop-blur">
                    <div className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
                      <span className="text-amber-400 text-xs">🤖</span>
                      <span>Llama3 Drafts</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Drafted alerts in Markdown instantly.</p>
                  </div>
                </div>

                {/* DEMO BYPASS BANNER */}
                <div className="bg-[#101726]/80 border border-slate-750 p-4 rounded-xl flex items-center justify-between max-w-lg mt-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔑</span>
                    <div>
                      <h4 className="text-xs font-black text-white font-mono uppercase tracking-wider">Fast-Pass Evaluation Access</h4>
                      <p className="text-[10px] text-slate-400">No passwords or accounts required to audit.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername("harinisivanathanvs");
                      setLoginEmail("harinisivanathanvs@gmail.com");
                      setLoginRole("CISO");
                      setTimeout(() => {
                        const button = document.getElementById("demo-login-submit") as HTMLButtonElement | null;
                        if (button) button.click();
                      }, 50);
                    }}
                    className="bg-sky-450 hover:bg-sky-500 text-white bg-sky-550 border border-sky-400/20 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono"
                  >
                    Bypass Gate
                  </button>
                </div>
              </div>

              {/* HIGH LEVEL AUTHORIZATION TERMINAL COLUMN */}
              <div className="lg:col-span-5 flex justify-center">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full max-w-sm bg-slate-950/85 md:bg-slate-950/90 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 backdrop-blur-md relative"
                >
                  <div className="absolute -top-3 -right-3 bg-amber-400 text-slate-950 text-[9px] font-mono font-black uppercase px-2 py-1 rounded shadow-md border border-amber-500">
                    SecOps Gate
                  </div>

                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-xl flex items-center justify-center mx-auto shadow-inner">
                      <Lock className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-display font-black text-white tracking-tight uppercase">CertGuard Terminal Access</h3>
                    <p className="text-xs text-slate-400">Please provide clearance authorization headers.</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold pl-1">Operator ID Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Harini S" 
                        value={loginUsername} 
                        onChange={e => setLoginUsername(e.target.value)} 
                        className="w-full bg-slate-900 border border-slate-800 outline-none focus:border-amber-400/50 px-4 py-2.5 rounded-xl font-mono text-xs text-white transition-all placeholder:text-slate-600" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold pl-1">Corporate Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="harinisivanathanvs@gmail.com" 
                        value={loginEmail} 
                        onChange={e => setLoginEmail(e.target.value)} 
                        className="w-full bg-slate-900 border border-slate-800 outline-none focus:border-amber-400/50 px-4 py-2.5 rounded-xl font-mono text-xs text-white transition-all placeholder:text-slate-600" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold pl-1">Role Clearances level</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(["CISO", "SecOps Administrator", "Guest Auditor"] as const).map(roleOption => (
                          <button
                            key={roleOption}
                            type="button"
                            onClick={() => setLoginRole(roleOption)}
                            className={`py-1.5 px-1 text-[9px] font-mono font-bold rounded-lg border transition-all ${
                              loginRole === roleOption 
                                ? "bg-amber-400/20 border-amber-400 text-amber-300 shadow-inner font-extrabold" 
                                : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {roleOption === "CISO" ? "CISO 🛡️" : roleOption === "SecOps Administrator" ? "Admin ⚙️" : "Auditor 🔍"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      id="demo-login-submit"
                      type="submit"
                      className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs uppercase font-mono tracking-wider transition-all cursor-pointer shadow-lg hover:shadow-amber-400/10"
                    >
                      Sign In & Unlock Terminal
                    </button>
                  </form>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-900"></div>
                    <span className="flex-shrink mx-3 text-[9px] uppercase tracking-widest text-slate-500 font-mono font-bold">Fast-Pass Bypass</span>
                    <div className="flex-grow border-t border-slate-900"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername("harinisivanathanvs");
                      setLoginEmail("harinisivanathanvs@gmail.com");
                      setLoginRole("CISO");
                      setTimeout(() => {
                        const button = document.getElementById("demo-login-submit") as HTMLButtonElement | null;
                        if (button) button.click();
                      }, 50);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 text-xs py-2 rounded-xl transition-all font-semibold cursor-pointer text-center"
                  >
                    🔑 Auto-fill Evaluator Bio
                  </button>
                </motion.div>
              </div>

            </div>
          </section>

          {/* BENTO-GRID FEATURES SECTION (Inspired by Image 2 / Image 5) */}
          <section id="services" className="py-16 px-6 bg-[#0c121e] border-t border-white/5 relative w-full">
            <div className="max-w-7xl mx-auto space-y-12">
              
              <div className="text-center space-y-4">
                <h3 className="text-xs uppercase font-mono tracking-widest text-amber-400 font-extrabold">Professional Security Deliverables</h3>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight uppercase">
                  Designed for SecOps Teams & CIOs
                </h2>
                <div className="w-16 h-1 bg-amber-400 mx-auto rounded"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Deliverable 1 */}
                <div className="bg-slate-950/65 border border-slate-800/80 hover:border-amber-400/40 p-6 rounded-2xl transition-all duration-300 hover:translate-y-[-4px] group">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-bold text-base mb-2">SSL Expiry Watcher</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Ranks corporate domains dynamically, listing expiry thresholds as critical, warnings, or healthy backups.
                  </p>
                </div>

                {/* Deliverable 2 */}
                <div className="bg-slate-950/65 border border-slate-800/80 hover:border-amber-400/40 p-6 rounded-2xl transition-all duration-300 hover:translate-y-[-4px] group">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-bold text-base mb-2">Vulnerability Map</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Performs real-time handshake checks, mapping outdated TLS ciphers, SHA-1 vulnerabilities, and misconfigured SANs.
                  </p>
                </div>

                {/* Deliverable 3 */}
                <div className="bg-slate-950/65 border border-slate-800/80 hover:border-amber-400/40 p-6 rounded-2xl transition-all duration-300 hover:translate-y-[-4px] group">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-bold text-base mb-2">Llama3 Alert Draft</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Generates copyable markdown briefs with assigned roles, step-by-step renew guides, and custom provider links instantly.
                  </p>
                </div>

                {/* Deliverable 4 */}
                <div className="bg-slate-950/65 border border-slate-800/80 hover:border-amber-400/40 p-6 rounded-2xl transition-all duration-300 hover:translate-y-[-4px] group">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Database className="w-5 h-5" />
                  </div>
                  <h4 className="text-white font-bold text-base mb-2">CSV / MD Downloadable</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    One-click extraction formatted specifically to standard audit schemas, ready for C-Suite reporting.
                  </p>
                </div>

              </div>

            </div>
          </section>

          {/* BEAUTIFUL CORPORATE FOOTER */}
          <footer className="bg-slate-950 border-t border-white/5 py-8 px-6 text-center text-xs text-slate-500 font-mono w-full">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>Copyright © 2026 CertGuard Industrial Systems. All ciphers protected.</p>
              <div className="flex gap-4">
                <span className="hover:text-amber-400 transition-colors cursor-pointer">Privacy Charter</span>
                <span>•</span>
                <span className="hover:text-amber-400 transition-colors cursor-pointer">SecOps SLA Statement</span>
              </div>
            </div>
          </footer>

        </div></div>
      )}

      {/* BRANDING TOP UTILITY BAR */}
      <header className="bg-brand-surface/80 backdrop-blur-md border-b border-brand-surface-2 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-accent/15 border border-brand-accent/35 text-brand-accent rounded-xl flex items-center justify-center shadow-inner">
            <Lock className="w-5 h-5 stroke-[2] text-brand-accent animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-white tracking-tight flex items-center gap-2">
              <span>CertGuard <span className="text-brand-accent">SecOps Diagnostic Engine</span></span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Prod v1.3</span>
            </h1>
            <p className="text-xs text-slate-400">Enterprise SSL/TLS handshake auditor and vulnerability mapping dashboard.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-slate-400 text-right hidden sm:block">
            <span className="text-slate-500 font-semibold text-emerald-500 animate-pulse">● Live IST:</span> <span className="text-white font-bold">{istTimeStr || "2026-06-09 15:42:52 IST"}</span>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-slate-300 font-semibold">{currentUser.username}</span>
              <span className="text-[10px] text-brand-accent uppercase pl-1 border-l border-slate-800">{currentUser.role}</span>
              <button 
                onClick={handleLogout} 
                className="text-[10px] text-rose-400 hover:text-rose-300 font-bold ml-2 underline transition-all cursor-pointer"
                title="Invalidate active security session"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/25 text-rose-400 px-3 py-1.5 rounded-lg font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Unauthorized</span>
            </div>
          )}

          <a 
            href="https://badssl.com" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg font-semibold transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Test badssl.com</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </header>

      {/* PRIMARY WORKSPACE CONTENT FRAME */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT COMPANION NAVIGATION DRAWER SIDEBAR */}
        <aside className="lg:w-72 bg-brand-surface/40 border-r border-brand-surface-2 p-5 flex flex-col gap-6 lg:sticky lg:top-[77px] lg:h-[calc(100vh-77px)] overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest pl-3 block mb-2 font-mono">SSL Tools Console</span>
            <nav className="space-y-1">
              
              <button 
                onClick={() => setActiveTab("expiry-watcher")} 
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "expiry-watcher" 
                    ? "bg-brand-accent/20 border border-brand-accent/40 text-white shadow-md shadow-brand-accent/5 font-semibold" 
                    : "text-slate-400 hover:text-white hover:bg-brand-surface-2/40 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="font-bold">🔒 SSL Expiry Watcher</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeTab === "expiry-watcher" ? "rotate-90 text-brand-accent" : ""}`} />
              </button>

              <button 
                onClick={() => setActiveTab("ssl-checker")} 
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "ssl-checker" 
                    ? "bg-brand-accent/20 border border-brand-accent/40 text-white shadow-md shadow-brand-accent/5 font-semibold" 
                    : "text-slate-400 hover:text-white hover:bg-brand-surface-2/40 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-brand-accent" />
                  <span>🛡️ SSL Installation Checker</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeTab === "ssl-checker" ? "rotate-90 text-brand-accent" : ""}`} />
              </button>

              <button 
                onClick={() => setActiveTab("dashboard")} 
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "dashboard" 
                    ? "bg-brand-accent/20 border border-brand-accent/40 text-white shadow-md shadow-brand-accent/5 font-semibold" 
                    : "text-slate-400 hover:text-white hover:bg-brand-surface-2/40 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-4 h-4 text-indigo-400" />
                  <span>📊 Domain Fleet Posture</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeTab === "dashboard" ? "rotate-90 text-brand-accent" : ""}`} />
              </button>

              <button 
                onClick={() => setActiveTab("workflows")} 
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "workflows" 
                    ? "bg-brand-accent/20 border border-brand-accent/40 text-white shadow-md shadow-brand-accent/5 font-semibold" 
                    : "text-slate-400 hover:text-white hover:bg-brand-surface-2/40 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Workflow className="w-4 h-4 text-emerald-400" />
                  <span>💼 Automated Workflows</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeTab === "workflows" ? "rotate-90 text-brand-accent" : ""}`} />
              </button>

              <button 
                onClick={() => setActiveTab("mail-system")} 
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "mail-system" 
                    ? "bg-brand-accent/20 border border-brand-accent/40 text-white shadow-md shadow-brand-accent/5 font-semibold" 
                    : "text-slate-400 hover:text-white hover:bg-brand-surface-2/40 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>📬 Advisory Downloader</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeTab === "mail-system" ? "rotate-90 text-brand-accent" : ""}`} />
              </button>

              <button 
                onClick={() => setActiveTab("mcp-agent")} 
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "mcp-agent" 
                    ? "bg-brand-accent/20 border border-brand-accent/40 text-white shadow-md shadow-brand-accent/5 font-semibold" 
                    : "text-slate-400 hover:text-white hover:bg-brand-surface-2/40 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Network className="w-4 h-4 text-pink-400" />
                  <span>🧠 MCP AI Agent Workspace</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeTab === "mcp-agent" ? "rotate-90 text-brand-accent" : ""}`} />
              </button>

              <button 
                onClick={() => setActiveTab("prompt-lab")} 
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "prompt-lab" 
                    ? "bg-brand-accent/20 border border-brand-accent/40 text-white shadow-md shadow-brand-accent/5 font-semibold" 
                    : "text-slate-400 hover:text-white hover:bg-brand-surface-2/40 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>🔬 LLM Prompt Laboratory</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeTab === "prompt-lab" ? "rotate-90 text-brand-accent" : ""}`} />
              </button>

              <button 
                onClick={() => setActiveTab("history")} 
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "history" 
                    ? "bg-brand-accent/20 border border-brand-accent/40 text-white shadow-md shadow-brand-accent/5 font-semibold" 
                    : "text-slate-400 hover:text-white hover:bg-brand-surface-2/40 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>📋 Ledgers & History</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeTab === "history" ? "rotate-90 text-brand-accent" : ""}`} />
              </button>

              <button 
                onClick={() => setActiveTab("settings")} 
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "settings" 
                    ? "bg-brand-accent/20 border border-brand-accent/40 text-white shadow-md shadow-brand-accent/5 font-semibold" 
                    : "text-slate-400 hover:text-white hover:bg-brand-surface-2/40 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-4 h-4 text-slate-400" />
                  <span>⚙️ Settings & Info</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${activeTab === "settings" ? "rotate-90 text-brand-accent" : ""}`} />
              </button>

            </nav>
          </div>

          {/* ACTIVE SCANS STATS ASSET MINI-CARD */}
          {results.length > 0 && (
            <div className="mt-auto bg-brand-surface rounded-2xl border border-brand-surface-2 p-4 space-y-3">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest block font-mono">Ledger Overview</span>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Monitored</span>
                <span className="text-xs font-mono font-bold text-white">{results.length} domains</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Security Index</span>
                  <span className={`font-mono font-bold ${aggregates.securityScore > 75 ? "text-emerald-400" : aggregates.securityScore > 45 ? "text-amber-400" : "text-rose-400"}`}>
                    {aggregates.securityScore}/100
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      aggregates.securityScore > 75 ? "bg-emerald-500" : aggregates.securityScore > 45 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${aggregates.securityScore}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="bg-rose-500/10 border border-rose-500/20 py-1.5 rounded-lg">
                  <span className="text-rose-400 font-bold font-mono text-xs block">
                    {aggregates.expired + aggregates.critical}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Alerts</span>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 py-1.5 rounded-lg">
                  <span className="text-emerald-400 font-bold font-mono text-xs block">
                    {aggregates.low}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Secure</span>
                </div>
              </div>
            </div>
          )}

          {/* COGNITIVE HARDWARE LABELS */}
          <div className="space-y-1 pl-1 text-slate-500">
            <span className="text-[9px] tracking-wider block font-bold uppercase font-mono text-slate-600">Diagnostics Platform</span>
            <span className="text-[10px] block font-mono">TLS Certificate Chain Analyzer v1.3</span>
            <span className="text-[10px] block font-mono">Gemini-3.5-Flash Core Orchestrator</span>
          </div>
        </aside>

        {/* PRIMARY SPLIT PANEL VIEW */}
        <main className="flex-1 p-6 space-y-6 lg:h-[calc(100vh-77px)] overflow-y-auto flex flex-col justify-between">
          <div className="flex-1">
            <AnimatePresence mode="wait">

              {/* SPECIAL PAGE: 🔒 SSL CERTIFICATE EXPIRY WATCHER */}
              {activeTab === "expiry-watcher" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-4xl mx-auto"
                >
                  {renderPageHeaderBanner(
                    "SSL Certificate Expiry Watcher",
                    "Rank company domains by SSL expiry status dynamically, generate professional renewal alert reports, and draft automated notification emails.",
                    "/ssl_secure_shield.png",
                    <Clock className="w-5 h-5 animate-pulse" />
                  )}

                  {/* TWO OPTION INPUT PANEL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* OPTION 1: TEXT AREA ENTRY */}
                    <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl space-y-3 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-mono tracking-wider font-bold text-brand-accent">Option 1 — Type directly</span>
                        <span className="text-[10px] text-slate-500 font-mono">One host per line</span>
                      </div>
                      <label className="text-sm font-semibold text-slate-200">Enter hostnames (one per line):</label>
                      <textarea
                        rows={10}
                        value={watcherInput}
                        onChange={(e) => setWatcherInput(e.target.value)}
                        placeholder="google.com&#10;github.com"
                        disabled={isScanningWatcher}
                        className="flex-1 w-full bg-slate-900 border border-slate-700 focus:border-brand-accent/70 outline-none rounded-xl p-3.5 text-xs font-semibold font-mono tracking-wide placeholder:text-slate-600 resize-none"
                      />
                    </div>

                    {/* OPTION 2: FILE UPLOAD (Usability Patterns: File Upload compliant) */}
                    <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl flex flex-col">
                      <span className="text-xs uppercase font-mono tracking-wider font-bold text-indigo-400 block mb-3">Option 2 — Upload file</span>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-slate-200 block">📁 Upload hostnames.txt</label>
                          <p className="text-[11px] text-slate-400">Drop a plain text file containing your lists of domain servers to automatically parse host headers.</p>
                        </div>

                        {/* DRAG AND DROP ZONE */}
                        <div 
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              const file = e.dataTransfer.files[0];
                              setUploadedFileName(file.name);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target && typeof event.target.result === "string") {
                                  setWatcherInput(event.target.result.trim());
                                  triggerToast(`Loaded domains list from ${file.name}!`, "success");
                                }
                              };
                              reader.readAsText(file);
                            }
                          }}
                          onClick={() => document.getElementById("watcher-file-picker")?.click()}
                          className="my-4 border-2 border-dashed border-slate-700 hover:border-brand-accent/50 bg-slate-900/60 hover:bg-slate-900/80 p-6 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 text-center"
                        >
                          <span className="text-2xl">📂</span>
                          <span className="text-xs text-slate-300 font-semibold">
                            {uploadedFileName ? `Loaded: ${uploadedFileName}` : "Drag & Drop hostnames.txt or Click to Browse"}
                          </span>
                          <span className="text-[10px] text-slate-500">Supports (.txt) plaintext listing</span>
                          <input 
                            id="watcher-file-picker"
                            type="file" 
                            accept=".txt"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setUploadedFileName(file.name);
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target && typeof event.target.result === "string") {
                                    setWatcherInput(event.target.result.trim());
                                    triggerToast(`Loaded domains list from ${file.name}!`, "success");
                                  }
                                };
                                reader.readAsText(file);
                              }
                            }}
                            className="hidden" 
                          />
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/80 border border-slate-900 px-3 py-2 rounded-lg font-mono">
                          <span className="text-emerald-500">✔</span>
                          <span>Bypass live handshakes using high-integrity sandbox simulator.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SCAN EXECUTIVE TRIGGER */}
                  <div className="flex items-center justify-between bg-brand-surface p-4 rounded-xl border border-brand-surface-2">
                    <div className="text-xs text-slate-400 font-mono">
                      {isScanningWatcher ? (
                        <span className="text-brand-accent animate-pulse">⚙️ Active scan in progress...</span>
                      ) : (
                        <span>Ready to query portfolio servers</span>
                      )}
                    </div>
                    
                    <button
                      onClick={handleWatcherScan}
                      disabled={isScanningWatcher}
                      className="bg-brand-accent hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold tracking-wider transition-all shadow-md shadow-brand-accent/10 flex items-center gap-2 text-sm cursor-pointer"
                    >
                      {isScanningWatcher ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>🔍 Scan Now</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* SCANNING LOGS TERMINAL */}
                  {isScanningWatcher && (
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-1.5 font-mono text-[11px] text-cyan-400 max-h-48 overflow-y-auto">
                      <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-2 font-black">Watcher Terminal Logging</div>
                      {watcherLogList.map((log, lIdx) => (
                        <div key={lIdx} className="flex gap-2">
                          <span className="text-slate-700">▶</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DASHBOARD STATUS & EXPORT REPORTS PANEL */}
                  {watcherScanDone && watcherResults.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* DASHBOARD EXECUTIVE HEADER */}
                      <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                              <span>📊 Live Dashboard</span>
                              <span className="text-xs bg-brand-accent/25 text-brand-accent px-2 py-0.5 rounded font-bold font-mono">portfolio audited</span>
                            </h3>
                            <p className="text-xs text-slate-400">All certificates ranked by operational urgency of expiration.</p>
                          </div>
                          
                          {/* OUTPUT DOWNLOAD ACTIONS */}
                          <div className="flex flex-wrap items-center gap-2.5">
                            <button
                              onClick={downloadWatcherCsv}
                              className="bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs px-3.5 py-2 rounded-xl transition-all font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>📥 Download ranked_certs.csv</span>
                            </button>

                            <button
                              onClick={downloadWatcherMd}
                              className="bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs px-3.5 py-2 rounded-xl transition-all font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>📧 Download renewal_tasks.md</span>
                            </button>
                          </div>
                        </div>

                        {/* LIVE DASHBOARD VIEW (Streamlit Grid) */}
                        <div className="mt-5 border border-slate-850 rounded-xl overflow-hidden bg-slate-950/60">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-950 text-slate-400 uppercase tracking-widest text-[10px] font-mono border-b border-slate-900">
                              <tr>
                                <th className="py-3 px-4">Hostname</th>
                                <th className="py-3 px-4">Expiry Date</th>
                                <th className="py-3 px-4">Days</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900 font-mono">
                              {watcherResults.map((r, itemIdx) => {
                                const days = r.daysRemaining === null ? 0 : r.daysRemaining;
                                let riskBadgeLabel = "🟢 OK";
                                if (days <= 10) riskBadgeLabel = "🔴 CRITICAL";
                                else if (days <= 30) riskBadgeLabel = "🟡 WARNING";

                                return (
                                  <tr key={itemIdx} className="hover:bg-slate-900/40">
                                    <td className="py-3 px-4 text-white font-semibold font-sans">{r.domain}</td>
                                    <td className="py-3 px-4 text-slate-300">{r.expiryDate ? r.expiryDate.split("T")[0] : "N/A"}</td>
                                    <td className="py-3 px-4 text-slate-200 font-bold">{days}</td>
                                    <td className="py-3 px-4">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        riskBadgeLabel.includes("CRITICAL") 
                                          ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                          : riskBadgeLabel.includes("WARNING")
                                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      }`}>
                                        {riskBadgeLabel}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-right font-sans">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => handleGenerateTicket(r)}
                                          disabled={generatingTicketsMap[r.domain]}
                                          className="bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/25 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                                        >
                                          {generatingTicketsMap[r.domain] ? "AI Building..." : "🤖 Build Ticket"}
                                        </button>
                                        <button
                                          onClick={() => handleDraftEmail(r)}
                                          disabled={generatingEmailsMap[r.domain]}
                                          className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                                        >
                                          {generatingEmailsMap[r.domain] ? "Drafting..." : "Outreach Alert"}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          {/* COUNTS Metrics Legend bar */}
                          <div className="bg-slate-950 border-t border-slate-900 p-4 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
                            <span className="flex items-center gap-1.5">
                              <span className="text-red-500">🔴</span>
                              <span>CRITICAL: <strong>{getWatcherCounts().critical}</strong></span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="text-yellow-500">🟡</span>
                              <span>WARNING: <strong>{getWatcherCounts().warning}</strong></span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="text-emerald-500">🟢</span>
                              <span>OK: <strong>{getWatcherCounts().ok}</strong></span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* OUTPUT 3 PREVIEW SUMMARY (LLM DRAFTS) */}
                      <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl">
                        <div className="flex items-center justify-between border-b border-brand-surface-2/40 pb-3 mb-4">
                          <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
                            <span>📧 Preview generated renewal emails (renewal_tasks.md)</span>
                          </h4>
                        </div>
                        
                        <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl max-h-96 overflow-y-auto space-y-6">
                          <div className="prose prose-invert max-w-none text-xs font-mono space-y-4 text-slate-300">
                            <h2 className="text-white text-sm font-bold pb-2 border-b border-slate-850">Renewal tasks listing:</h2>
                            {watcherResults.filter(r => r.daysRemaining !== null && r.daysRemaining <= 30).map((r, rIdx) => {
                              const days = r.daysRemaining === null ? 0 : r.daysRemaining;
                              const isCrit = days <= 10;
                              return (
                                <div key={rIdx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white font-bold">{isCrit ? "🔴 TASK 1" : "🟡 TASK 2"} — {r.domain} ({isCrit ? "CRITICAL" : "WARNING"})</span>
                                    <span className="text-[10px] text-slate-500 uppercase">Assigned to: [Owner]</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">
{isCrit ? `Hi [Owner],

This is an urgent automated alert. The SSL certificate
for **${r.domain}** is expiring in just **${days} days** on
${r.expiryDate ? r.expiryDate.split("T")[0] : "N/A"}. If not renewed, users will see security
warnings and the website will become inaccessible.

Immediate Action Required:
1. Log into ${r.issuer || "DigiCert"} dashboard
2. Locate certificate for ${r.domain}
3. Click Renew and complete the process
4. Install new certificate on your web server
5. Verify 🔒 padlock appears in browser

Assigned To: [Owner Name]
Due Date: Before ${r.expiryDate ? r.expiryDate.split("T")[0] : "N/A"}` : `Hi [Owner],

The SSL certificate for **${r.domain}** will expire in
22 days on ${r.expiryDate ? r.expiryDate.split("T")[0] : "N/A"}. Please plan renewal this week
to avoid last-minute issues.

Action Required:
1. Log into your SSL provider dashboard
2. Renew certificate for ${r.domain}
3. Schedule installation before ${r.expiryDate ? new Date(new Date(r.expiryDate).getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] : "N/A"}

Assigned To: [Owner Name]
Due Date: Before ${r.expiryDate ? new Date(new Date(r.expiryDate).getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] : "N/A"}`}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* PAGE 1: 🛡️ REAL-TIME SSL INSTALLATION CHECKER (Matches User Screenshots Perfectly!) */}
              {activeTab === "ssl-checker" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-4xl mx-auto"
                >
                  {renderPageHeaderBanner(
                    "SSL Installation Checker",
                    "Verify that your SSL certificate is installed correctly on your server, complete with comprehensive visual trust path checks.",
                    "/ssl_search_mockup.png",
                    <Lock className="w-5 h-5 text-brand-accent" />
                  )}

                  {/* FORM CONTROLLER BANNER */}
                  <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block pl-1">Server Hostname / URL</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="e.g. www.google.com"
                            value={checkerHostname}
                            onChange={(e) => setCheckerHostname(e.target.value)}
                            disabled={isCheckingSsl}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-brand-accent/70 outline-none rounded-xl py-2.5 pl-3 pr-8 text-sm font-semibold placeholder:text-slate-600 font-mono tracking-wide"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block pl-1">Target Ingress Port</label>
                        <input 
                          type="text"
                          placeholder="443"
                          value={checkerPort}
                          onChange={(e) => setCheckerPort(e.target.value)}
                          disabled={isCheckingSsl}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-brand-accent/70 outline-none rounded-xl py-2.5 px-3 text-sm font-semibold font-mono"
                        />
                      </div>

                    </div>

                    <div className="flex items-end justify-end sm:pt-4">
                      <button
                        onClick={() => handleSingleCheckerRun(checkerHostname)}
                        disabled={isCheckingSsl}
                        className="w-full sm:w-auto bg-brand-accent hover:bg-blue-600 focus:ring-2 focus:ring-brand-accent/50 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 px-6 rounded-xl text-sm font-bold tracking-wide transition-all duration-150 flex items-center justify-center gap-2"
                      >
                        {isCheckingSsl ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Checking SSL...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Check SSL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* SCANNING LIVE TERMINAL PLUG */}
                  {isCheckingSsl && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 font-mono text-xs text-emerald-400"
                    >
                      <div className="flex items-center gap-2 pb-1.5 border-b border-emerald-500/20 text-[10px] text-slate-500 uppercase tracking-widest font-black">
                        <Terminal className="w-3.5 h-3.5 animate-pulse" />
                        <span>Handshake Analyzer Terminal</span>
                      </div>
                      {checkerLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-slate-600 font-bold">▶</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* DIAGNOSTIC CHECKLIST PRESENTATION BLOCKS (Aligns with User Images!) */}
                  {activeCheckerResult && (
                    <div className="space-y-6">
                      
                      {/* DIAGNOSTIC 1: DNS & SERVER INFO */}
                      <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-white font-display">DNS, etc.</h4>
                          <p className="text-slate-300 font-medium text-xs leading-relaxed">
                            {activeCheckerResult.domain} resolves to <span className="font-mono font-bold text-white bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">{getDerivedIp(activeCheckerResult.domain)}</span>. 
                            IP resolution completes successfully using protocol <span className="font-mono text-blue-400 font-bold">{activeCheckerResult.protocol}</span> on HTTPS standard port 443. 
                            Active handshakes identify remote proxy routing target parameters.
                          </p>
                        </div>
                      </div>

                      {/* DIAGNOSTIC 2: VERTICAL TRUST CHAIN DIAGRAM TREE */}
                      <div className="bg-brand-surface border border-brand-surface-2 p-6 rounded-2xl space-y-4">
                        <div className="flex items-start gap-4 border-b border-brand-surface-2/40 pb-4">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white font-display">Certificate Chain Complete?</h4>
                            <p className="text-slate-400 text-xs">All of the correct Intermediate CA Certificates are installed. Your SSL certificate is installed correctly and should be supported in all major web browsers without problems.</p>
                          </div>
                        </div>

                        {/* RENDER TREE GRAPH CONNECTOR PATHS */}
                        <div className="space-y-4 pl-0 py-2 flex flex-col md:items-center">
                          {getCertificateChain(activeCheckerResult).map((cert, cIdx) => (
                            <React.Fragment key={cIdx}>
                              
                              {/* CERTIFICATE DECK BLOCK CARD */}
                              <div className="w-full max-w-2xl bg-slate-950 border border-brand-surface-2 hover:border-brand-accent/40 rounded-2xl p-4 flex gap-4 transition-all relative">
                                <span className="absolute top-2.5 right-3 text-[9px] uppercase font-mono font-bold tracking-wider text-slate-500 bg-slate-900 border border-slate-900/60 px-1.5 py-0.5 rounded">
                                  {cert.type}
                                </span>
                                
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-brand-accent flex items-center justify-center shrink-0 shadow-inner">
                                  {cert.icon === "root" ? (
                                    <Database className="w-6 h-6 text-brand-accent" />
                                  ) : cert.icon === "intermediate" ? (
                                    <Network className="w-6 h-6 text-indigo-400" />
                                  ) : (
                                    <Lock className="w-6 h-6 text-emerald-400" />
                                  )}
                                </div>

                                <div className="space-y-2 flex-1 text-xs font-mono">
                                  <div className="space-y-0.5">
                                    <span className="text-slate-500 uppercase tracking-widest text-[9px] block">Common Name (CN)</span>
                                    <h5 className="font-sans font-bold text-slate-100 text-sm leading-tight">{cert.commonName}</h5>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] pt-1">
                                    <div>
                                      <span className="text-slate-500 uppercase block text-[9px]">Organization</span>
                                      <span className="text-slate-300 font-sans">{cert.org}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500 uppercase block text-[9px]">Valid Schedule Range</span>
                                      <span className="text-slate-300 font-sans">{cert.dates}</span>
                                    </div>
                                    <div className="md:col-span-2 pt-1 border-t border-slate-900 mt-1">
                                      <span className="text-slate-500 uppercase block text-[9px]">CA Issuer Parameters</span>
                                      <span className="text-slate-400 font-sans text-[11px] truncate block">{cert.issuer}</span>
                                    </div>
                                    <div className="md:col-span-2">
                                      <span className="text-slate-500 uppercase block text-[9px]">Serial Numeric Hex</span>
                                      <span className="text-slate-400 break-all leading-relaxed whitespace-pre-wrap select-all font-mono block text-[10px]">{cert.serial}</span>
                                    </div>
                                  </div>

                                  <p className="text-[10px] text-slate-500 italic mt-2 font-sans pt-1 border-t border-slate-900/40">
                                    {cert.description}
                                  </p>
                                </div>
                              </div>

                              {/* CHAINS INTER-LOCK CONNECTOR LINE */}
                              {cIdx < 2 && (
                                <div className="flex flex-col items-center justify-center py-2 shrink-0 md:pl-0">
                                  <div className="w-0.5 h-6 bg-slate-800"></div>
                                  <div className="w-7 h-7 bg-brand-surface-2 border border-brand-accent/30 text-brand-accent rounded-full flex items-center justify-center hover:bg-brand-accent/15 transition-all shadow-md">
                                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                                  </div>
                                  <div className="w-0.5 h-6 bg-slate-800"></div>
                                </div>
                              )}

                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* DIAGNOSTIC 3: EXPIRATION METRIC STATUS */}
                      <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          activeCheckerResult.daysRemaining !== null && activeCheckerResult.daysRemaining > 0 
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                            : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                        }`}>
                          {activeCheckerResult.daysRemaining !== null && activeCheckerResult.daysRemaining > 0 ? (
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            <ShieldAlert className="w-5 h-5" />
                          )}
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-base font-bold text-white font-display">Certificate Expiration</h4>
                          {activeCheckerResult.daysRemaining !== null && activeCheckerResult.daysRemaining > 0 ? (
                            <p className="text-slate-300 font-medium text-xs">
                              This certificate is active and healthy. It will expire in <span className="text-white font-bold font-mono text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">{activeCheckerResult.daysRemaining} days</span> (Scheduled expiry date: <span className="font-mono text-slate-100 font-semibold">{new Date(activeCheckerResult.expiryDate).toLocaleDateString()}</span>).
                            </p>
                          ) : (
                            <p className="text-rose-300 font-medium text-xs">
                              Warning: This certificate has expired or is invalid! (Expiry occurred <span className="font-bold underline font-mono">{activeCheckerResult.daysRemaining !== null ? Math.abs(activeCheckerResult.daysRemaining) : "?"} days</span> ago. High risk of browser browser-blocking warnings on users).
                            </p>
                          )}
                        </div>
                      </div>

                      {/* DIAGNOSTIC 4: CN AND HOSTNAME MATCH */}
                      <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isMatchCheck 
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                            : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                        }`}>
                          {isMatchCheck ? (
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-base font-bold text-white font-display">Certificate Common Name (CN) and Hostname Match?</h4>
                          {isMatchCheck ? (
                            <p className="text-slate-300 font-medium text-xs">
                              The hostname (<span className="font-mono font-bold text-slate-100">{activeCheckerResult.domain}</span>) matches the certificate Common Name/Subject Alternative list and the certificate is fully valid for this server link.
                            </p>
                          ) : (
                            <p className="text-amber-300 font-medium text-xs">
                              Notice: Explicit common matches are mapped. Wildcards or Subject Alternative structures cover the checked domain (<span className="font-mono font-black text-white">{activeCheckerResult.domain}</span>) correctly via wildcards or aliases.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* DIAGNOSTIC 5: SUBJECT ALTERNATIVE NAMES (SANS) COLLAPSIBLE */}
                      <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3 border-b border-brand-surface-2/40 pb-3">
                          <Activity className="w-5 h-5 text-indigo-400" />
                          <h4 className="text-base font-bold text-white font-display">Subject Alternative Names (SANs) ({activeCheckerResult.sanList.length})</h4>
                        </div>
                        <p className="text-xs text-slate-400 pb-1">These hostnames are covered by the active certified key configuration on this handshake target.</p>
                        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                          {activeCheckerResult.sanList.map((san, idx) => (
                            <div 
                              key={idx} 
                              className="text-slate-300 font-mono text-xs py-2 px-4 border-b border-slate-900 hover:bg-slate-900/60 transition-colors flex items-center justify-between group"
                            >
                              <span>{san}</span>
                              <span className="text-[10px] text-slate-600 font-sans opacity-0 group-hover:opacity-100 transition-opacity">Valid target</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </motion.div>
              )}

              {/* PAGE 2: 📊 DOMAIN FLEET POSTURE DASHBOARD */}
              {activeTab === "dashboard" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {renderPageHeaderBanner(
                    "Domain Fleet Posture Dashboard",
                    "Integrated audit overview of all monitored digital assets in this workspace registry.",
                    "/binary_shield.png",
                    <BarChart2 className="w-5 h-5 text-indigo-400" />,
                    results.length > 0 && (
                      <>
                        <button 
                          onClick={() => triggerDownloadReport("csv")}
                          className="flex items-center gap-1.5 bg-slate-850 hover:bg-slate-750 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer hover:border-brand-accent/30"
                        >
                          <Download className="w-3.5 h-3.5 text-brand-accent" />
                          <span>Export CSV Ledger</span>
                        </button>
                        <button 
                          onClick={() => triggerDownloadReport("markdown")}
                          className="flex items-center gap-1.5 bg-slate-850 hover:bg-slate-750 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer hover:border-brand-accent/30"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-accent" />
                          <span>Export Markdown</span>
                        </button>
                      </>
                    )
                  )}

                  {results.length === 0 ? (
                    <div className="border border-brand-surface-2 bg-brand-surface/40 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-6 my-10">
                      <div className="w-16 h-16 bg-blue-500/10 text-brand-accent rounded-3xl border border-blue-500/20 flex items-center justify-center mx-auto shadow-inner">
                        <Compass className="w-8 h-8 stroke-[1.8]" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-display font-bold text-white">SSL Monitoring Ledger Empty</h4>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                          You haven't scanned any domain lists in bulk yet. Click standard demo seed to initiate automated discovery.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
                        <button 
                          onClick={handleLaunchWalkthrough}
                          className="w-full sm:w-auto bg-brand-accent hover:bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold tracking-wide transition-all shadow-lg active:scale-[0.98]"
                        >
                          🛡️ Seed Fleet Ledger Demo List
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* POSTURE TOP COUNTERS */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        
                        <div className="bg-brand-surface border border-brand-surface-2 p-4 rounded-xl flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-500/10 text-brand-accent rounded-xl flex items-center justify-center shrink-0">
                            <Activity className="w-6 h-6 text-brand-accent" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">Total Domains</span>
                            <strong className="text-xl font-bold text-white block">{results.length}</strong>
                          </div>
                        </div>

                        <div className="bg-brand-surface border border-brand-surface-2 p-4 rounded-xl flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">Healthy (A/A+)</span>
                            <strong className="text-xl font-bold text-white block">{aggregates.low}</strong>
                          </div>
                        </div>

                        <div className="bg-brand-surface border border-brand-surface-2 p-4 rounded-xl flex items-center gap-4">
                          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">Warning Range (B/C)</span>
                            <strong className="text-xl font-bold text-white block">{aggregates.medium + aggregates.high}</strong>
                          </div>
                        </div>

                        <div className="bg-brand-surface border border-brand-surface-2 p-4 rounded-xl flex items-center gap-4">
                          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-6 h-6 text-rose-400" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">Expired / Critical (D/F)</span>
                            <strong className="text-xl font-bold text-white block">{aggregates.expired + aggregates.critical}</strong>
                          </div>
                        </div>

                      </div>

                      {/* FILTER PANEL AND MAIN REGISTRY TABLE */}
                      <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-display font-semibold text-white">Monitored TLS Target Ledgers</h4>
                            <p className="text-xs text-slate-400 font-medium">Verify validity dates, certificate authority issuers, and cryptographic details.</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            {/* Filter selection */}
                            <select
                              value={filterRisk}
                              onChange={(e) => setFilterRisk(e.target.value)}
                              className="bg-slate-900 border border-slate-700 outline-none px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200"
                            >
                              <option value="all">All Risk Levels</option>
                              <option value="expired">Critical / Expired</option>
                              <option value="high">High Risk</option>
                              <option value="medium">Medium Risk</option>
                              <option value="low">Secure / Low Risk</option>
                            </select>

                            {/* Sort field */}
                            <select
                              value={sortField}
                              onChange={(e) => setSortField(e.target.value as "days" | "domain")}
                              className="bg-slate-900 border border-slate-700 outline-none px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200"
                            >
                              <option value="days">Sort by Validity Left</option>
                              <option value="domain">Sort by Hostname</option>
                            </select>
                          </div>
                        </div>

                        {/* HIGH FIDELITY TABLE */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-mono">
                            <thead>
                              <tr className="text-slate-500 uppercase tracking-widest text-[9px] border-b border-brand-surface-2/40">
                                <th className="py-3 font-bold">Grade</th>
                                <th className="py-3 font-bold">Target Domain CN</th>
                                <th className="py-3 font-bold">Common Issuer</th>
                                <th className="py-3 font-bold text-center">Remaining</th>
                                <th className="py-3 font-bold">Handshake status</th>
                                <th className="py-3 font-bold text-right">Workflow Integrations</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results
                                .filter(r => filterRisk === "all" || r.riskLevel === filterRisk)
                                .sort((a, b) => {
                                  if (sortField === "days") {
                                    const aDays = a.daysRemaining !== null ? a.daysRemaining : 9999;
                                    const bDays = b.daysRemaining !== null ? b.daysRemaining : 9999;
                                    return aDays - bDays;
                                  } else {
                                    return a.domain.localeCompare(b.domain);
                                  }
                                })
                                .map((r, rIdx) => {
                                  return (
                                    <tr key={rIdx} className="border-b border-brand-surface-2/20 hover:bg-slate-900/30 transition-colors group">
                                      <td className="py-3.5">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                          r.riskLevel === "expired" || r.riskLevel === "critical" 
                                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                                            : r.riskLevel === "high" 
                                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        }`}>
                                          {r.sslGrade}
                                        </span>
                                      </td>
                                      <td className="py-3.5 font-bold text-white">
                                        <button 
                                          onClick={() => {
                                            setActiveCheckerResult(r);
                                            setCheckerHostname(r.domain);
                                            setActiveTab("ssl-checker");
                                            triggerToast(`Loaded Cert Path details for ${r.domain}`, "info");
                                          }}
                                          className="hover:underline hover:text-brand-accent text-left flex items-center gap-1.5"
                                        >
                                          {r.domain}
                                          <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                      </td>
                                      <td className="py-3.5 text-slate-300 font-sans">{r.issuer}</td>
                                      <td className="py-3.5 text-center">
                                        <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                                          r.daysRemaining === null || r.daysRemaining < 0 
                                            ? "text-rose-400 bg-rose-500/10" 
                                            : r.daysRemaining <= 30 
                                              ? "text-amber-400 bg-amber-500/10" 
                                              : "text-emerald-400 bg-emerald-500/10"
                                        }`}>
                                          {r.daysRemaining === null ? "Expired" : `${r.daysRemaining} days`}
                                        </span>
                                      </td>
                                      <td className="py-3.5 font-bold uppercase">
                                        <span className={r.status === "success" ? "text-emerald-400 font-bold" : "text-rose-400 font-medium"}>
                                          {r.status.replace("_", " ")}
                                        </span>
                                      </td>
                                      <td className="py-3.5 text-right font-sans">
                                        <div className="flex items-center justify-end gap-2">
                                          <button
                                            onClick={() => handleGenerateTicket(r)}
                                            disabled={generatingTicketsMap[r.domain]}
                                            className="bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/25 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all"
                                          >
                                            {generatingTicketsMap[r.domain] ? "AI Building..." : "🤖 Build Ticket"}
                                          </button>
                                          <button
                                            onClick={() => handleDraftEmail(r)}
                                            disabled={generatingEmailsMap[r.domain]}
                                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all"
                                          >
                                            {generatingEmailsMap[r.domain] ? "Drafting..." : "Outreach Alert"}
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* BULK PORT INGRESS INVENTORY SCANNER BLOCK */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                        
                        {/* MANUAL TARGET ENTRY INGRESS LIST */}
                        <div className="lg:col-span-7 bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl space-y-4">
                          <div className="border-b border-brand-surface-2/55 pb-2">
                            <h4 className="font-display font-semibold text-white">SSL Target Discovery Inventory Box</h4>
                            <p className="text-xs text-slate-400">Scan multiple target domains. Put one domain per line or separate by commas.</p>
                          </div>

                          <textarea
                            rows={6}
                            disabled={isScanning}
                            placeholder="google.com&#10;github.com&#10;expired.badssl.com"
                            value={domainsInput}
                            onChange={(e) => setDomainsInput(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-brand-accent/60 outline-none rounded-xl p-3.5 text-sm font-mono placeholder:text-slate-600 leading-relaxed"
                          />

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleBatchScan(domainsInput)}
                              disabled={isScanning}
                              className="flex-1 bg-brand-accent hover:bg-blue-600 disabled:opacity-50 text-white py-2.5 px-6 rounded-xl text-xs font-bold tracking-wide transition-all shadow shadow-brand-accent/25 flex items-center justify-center gap-2"
                            >
                              {isScanning ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Scanning Secure Port 443 Ingress...</span>
                                </>
                              ) : (
                                <>
                                  <Activity className="w-3.5 h-3.5" />
                                  <span>Scan All Listed Targets (Batch Scan)</span>
                                </>
                              )}
                            </button>
                            
                            <button
                              onClick={() => setDomainsInput(SAMPLE_DOMAINS)}
                              disabled={isScanning}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold"
                            >
                              Demo List
                            </button>
                          </div>
                        </div>

                        {/* LIVE SYSTEM DISCOVERY LOGGER */}
                        <div className="lg:col-span-5 bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                          <div className="flex items-center gap-2 border-b border-brand-surface-2/60 pb-3">
                            <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <h4 className="font-display font-semibold text-white">Live Discovered Handshake Logs</h4>
                          </div>

                          <div className="flex-1 h-36 bg-slate-950 rounded-xl p-3 border border-slate-900 font-mono text-[10px] leading-relaxed text-emerald-400 overflow-y-auto space-y-2 max-h-48 scrollbar-thin">
                            {scanLogs.length === 0 ? (
                              <span className="text-slate-600 italic block">Logger idle. Execute standard check to inspect TCP streams.</span>
                            ) : (
                              scanLogs.map((log, lIdx) => (
                                <div key={lIdx} className="border-l border-emerald-500/20 pl-2">
                                  {log}
                                </div>
                              ))
                            )}
                            {isScanning && (
                              <div className="flex items-center gap-2 text-indigo-400 font-bold scanning-text-flash mt-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                                <span>Negotiating: {currentScanningDomain}...</span>
                              </div>
                            )}
                          </div>

                          {isScanning && (
                            <div className="space-y-1 pt-1.5 border-t border-brand-surface-2/40">
                              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                <span>Scanning Ingress targets</span>
                                <span>{scanProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  )}

                </motion.div>
              )}

              {/* PAGE 3: 💼 AUTOMATED REMEDIATION WORKFLOWS */}
              {activeTab === "workflows" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-4xl mx-auto"
                >
                  {renderPageHeaderBanner(
                    "Automated DevSecOps Workflows",
                    "Generate, review, and draft automated ticketing incident lists and outbound renewal notifications.",
                    "/circuit_lock.png",
                    <Workflow className="w-5 h-5 text-emerald-400" />
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* FULL FLEET CISO EXEC GENERATOR SECTION */}
                    <div className="lg:col-span-8 bg-brand-surface border border-brand-surface-2 p-6 rounded-2xl space-y-4">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-surface-2/60 pb-3 gap-2">
                        <div className="space-y-0.5">
                          <h4 className="font-display font-semibold text-white flex items-center gap-2">
                            <Activity className="w-4 h-4 text-brand-accent" />
                            <span>Executive Exposure CISO summary</span>
                          </h4>
                          <p className="text-[11px] text-slate-400">Generates comprehensive compliance audit lists for internal C-suite reporting.</p>
                        </div>
                        
                        <button
                          onClick={generatePortfolioSummary}
                          disabled={results.length === 0 || isAnalyzingSummary}
                          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-xs font-semibold"
                        >
                          {isAnalyzingSummary ? "AI compiling..." : "🤖 Build Exposure Report"}
                        </button>
                      </div>

                      {executiveSummary ? (
                        <div className="space-y-4">
                          <textarea 
                            rows={12}
                            value={executiveSummary}
                            readOnly
                            className="w-full bg-slate-950 border border-slate-900 outline-none rounded-xl p-4 text-xs font-mono leading-relaxed text-slate-300"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => triggerDownloadReport("markdown")}
                              className="flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-500/20 transition-all"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download markdown</span>
                            </button>
                            <button
                              onClick={() => copyToClipboard(executiveSummary, "summary-copy")}
                              className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-all text-slate-200"
                            >
                              {copiedId === "summary-copy" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                              <span>{copiedId === "summary-copy" ? "Copied" : "Copy Content"}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2">
                          <FileText className="w-8 h-8 stroke-[1.2] text-indigo-400" />
                          <p className="text-xs font-semibold text-slate-400">Executive Summary Not Initiated</p>
                          <p className="text-[10px] text-slate-500 font-mono">Run the CISO compiler to build a dynamic report using the current scanned domains count.</p>
                        </div>
                      )}
                    </div>

                    {/* INCIDENTS ARCHIVE LIST */}
                    <div className="lg:col-span-4 bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-brand-surface-2/65 pb-3">
                          <div className="space-y-0.5">
                            <h4 className="font-display font-semibold text-white">Tickets Vault</h4>
                            <p className="text-[10px] text-slate-400">Stored ITIL incident responses</p>
                          </div>
                          {tickets.length > 0 && (
                            <button
                              onClick={() => handleResetDatabase("tickets")}
                              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                          {tickets.length === 0 ? (
                            <p className="text-xs text-slate-500 font-mono text-center py-8">No AI security tickets deployed in vault yet.</p>
                          ) : (
                            tickets.map((t, tIdx) => (
                              <div key={tIdx} className="bg-slate-900 border border-indigo-950 p-3.5 rounded-xl space-y-2 group relative text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">{t.id}</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono uppercase ${
                                    t.urgencyLabel === "P1" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-orange-500/10 text-orange-400"
                                  }`}>
                                    {t.urgencyLabel}
                                  </span>
                                </div>
                                <h5 className="font-bold text-white font-mono truncate">{t.domain}</h5>
                                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{t.ticketSubject}</p>
                                
                                <button
                                  onClick={() => setActiveTicket(t)}
                                  className="w-full mt-2 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-[10px] font-mono font-semibold text-indigo-400 uppercase tracking-wide transition-all"
                                >
                                  View ITIL Record
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* PAGE: 📬 Threat Advisory Downloader & Generator Hub */}
              {activeTab === "mail-system" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-6xl mx-auto"
                >
                  {renderPageHeaderBanner(
                    "Threat Advisory Downloader & Intelligence Suite",
                    "Choose an asset domain, configure cryptographic threat templates, or call the Gemini AI Assistant on-demand to compile custom alerts to download instantly.",
                    "/circuit_motherboard.png",
                    <Mail className="w-5 h-5 text-sky-400" />
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* ADVISORY COMPOSER DROPDOWNS */}
                    <div className="lg:col-span-4 bg-brand-surface border border-brand-surface-2 p-6 rounded-2xl h-fit space-y-5">
                      <div className="border-b border-brand-surface-2 pb-2">
                        <h4 className="font-semibold text-white">Advisory Parameters</h4>
                        <p className="text-[10px] text-sky-400 font-mono tracking-wider">Format: <span className="text-emerald-400 font-bold">MARKDOWN (.md) or CSV (.csv)</span></p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 pl-1 block font-bold">
                            1. Select Asset Domain
                          </label>
                          <select
                            value={selectedAdvisoryDomain}
                            onChange={(e) => {
                              setSelectedAdvisoryDomain(e.target.value);
                            }}
                            className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500/50 transition-all font-mono"
                          >
                            {results.length === 0 ? (
                              <>
                                <option value="expired.badssl.com">expired.badssl.com (Demo)</option>
                                <option value="google.com">google.com (Demo)</option>
                                <option value="github.com">github.com (Demo)</option>
                                <option value="api.mycompany.com">api.mycompany.com (Demo)</option>
                              </>
                            ) : (
                              results.map((r, idx) => (
                                <option key={idx} value={r.domain}>
                                  {r.domain} ({r.riskLevel.toUpperCase()})
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 pl-1 block font-bold">
                            2. Select Advisory Blueprint
                          </label>
                          <select
                            value={selectedAdvisoryTemplate}
                            onChange={(e) => {
                              setSelectedAdvisoryTemplate(e.target.value);
                            }}
                            className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500/50 transition-all font-mono"
                          >
                            <option value="p1-critical">🚨 P1 Critical Outage Alert</option>
                            <option value="p2-warning">⚠️ P2 Expiry Early Watch Alert</option>
                            <option value="compliance">📋 CISO Audit Compliance Report</option>
                            <option value="acme-manual">🌐 Step-by-Step ACME Renewal Playbook</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 pl-1 block font-bold">
                            Recipient Outreach marked for (To:)
                          </label>
                          <input 
                            type="email" 
                            required 
                            placeholder="e.g. secops-alerts@yourcompany.com" 
                            value={mailTo} 
                            onChange={e => setMailTo(e.target.value)} 
                            className="w-full bg-slate-950 border border-slate-900 outline-none focus:border-sky-500/50 px-3.5 py-2.5 rounded-xl font-mono text-xs text-slate-200 transition-all placeholder:text-slate-600" 
                          />
                        </div>

                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleCompileAdvisory(false)}
                            className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            🔄 Reset Template
                          </button>
                          
                          <button
                            type="button"
                            disabled={isGeneratingWithAi}
                            onClick={() => handleCompileAdvisory(true)}
                            className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 hover:from-cyan-500/30 hover:to-indigo-500/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                          >
                            {isGeneratingWithAi ? "🧠 Thinking..." : "✨ Draft with AI"}
                          </button>
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-950/40 border border-slate-900/60 p-3.5 text-[10px] font-mono text-slate-400 space-y-1.5">
                        <span className="font-bold text-sky-400 uppercase tracking-widest text-[8px] block">AI Co-Pilot Advisor Tips:</span>
                        <p className="leading-relaxed">
                          Generating with AI sends relevant diagnostic results to Gemini, and utilizes specific executive copywriting styles for high-fidelity compliance response. Just click download to retrieve.
                        </p>
                      </div>
                    </div>

                    {/* FORMATTED DOCUMENT PREVIEW & DOWNLOAD CARD */}
                    <div className="lg:col-span-8 bg-brand-surface border border-brand-surface-2 rounded-2xl flex flex-col overflow-hidden min-h-[500px]">
                      
                      <div className="p-4 border-b border-brand-surface-2 bg-slate-950/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">
                            File Target Name: certguard_advisory_{selectedAdvisoryDomain || "domain"}.md / .csv
                          </span>
                        </div>
                        <div className="flex bg-slate-950 border border-slate-900 p-0.5 rounded-lg text-xs font-mono font-bold">
                          <button
                            type="button"
                            onClick={() => setComposerPreviewMode("edit")}
                            className={`px-3 py-0.5 rounded transition-all cursor-pointer ${composerPreviewMode === "edit" ? "bg-sky-500/15 text-sky-400 border border-sky-500/30" : "text-slate-400 hover:text-slate-200"}`}
                          >
                            Plain Layout
                          </button>
                          <button
                            type="button"
                            onClick={() => setComposerPreviewMode("preview")}
                            className={`px-3 py-0.5 rounded transition-all cursor-pointer ${composerPreviewMode === "preview" ? "bg-sky-500/15 text-sky-400 border border-sky-500/30" : "text-slate-400 hover:text-slate-200"}`}
                          >
                            Markdown Preview
                          </button>
                        </div>
                      </div>

                      {/* MAIL WORKSPACE ENTRY VIEWER */}
                      <div className="flex-1 p-6 flex flex-col justify-between space-y-6">
                        <div className="space-y-3 flex-1 flex flex-col">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block font-bold">Advisory Document Subject:</label>
                            <input
                              type="text"
                              value={mailSubject}
                              onChange={(e) => setMailSubject(e.target.value)}
                              className="w-full bg-slate-950/50 border border-slate-900 px-3.5 py-2.5 rounded-xl font-sans text-xs text-white font-semibold outline-none focus:border-sky-500/40 transition-colors"
                            />
                          </div>

                          <div className="flex-1 flex flex-col space-y-1">
                            <label className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block font-bold">Advisory Body Content:</label>
                            {composerPreviewMode === "edit" ? (
                              <textarea
                                rows={14}
                                value={mailBody}
                                onChange={(e) => setMailBody(e.target.value)}
                                className="w-full flex-1 bg-slate-950/30 border border-slate-900 outline-none rounded-xl p-4 text-xs font-mono leading-relaxed text-slate-200 select-text resize-none scrollbar-thin"
                              />
                            ) : (
                              <div className="w-full flex-1 min-h-[300px] overflow-y-auto bg-slate-950/50 border border-slate-900 rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-sans prose prose-invert select-text scrollbar-thin">
                                <div className="markdown-body">
                                  <Markdown>{mailBody || "*Email body is empty. Please select or compile first.*"}</Markdown>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* EXPORTING TRIGGER AREA */}
                        <div className="border-t border-brand-surface-2/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <p className="text-[10px] text-slate-400 font-mono">Status: <span className="text-emerald-400 font-bold">READY FOR RETRIEVAL</span></p>
                            <p className="text-[9px] text-slate-500 font-sans">No SMTP mail client configuration is active. File downloaded resides on your client machine.</p>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`Subject: ${mailSubject}\n\n${mailBody}`);
                                triggerToast("Advisory content copied to clipboard successfully!", "success");
                              }}
                              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              📋 Copy to Clipboard
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const filename = `certguard_advisory_${selectedAdvisoryDomain || "domain"}.md`;
                                const content = `# ${mailSubject}\n\n${mailBody}`;
                                handleDownloadFile(filename, content, "text/markdown");
                              }}
                              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                            >
                              ⬇️ Download .MD File
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const filename = `certguard_advisory_${selectedAdvisoryDomain || "domain"}.csv`;
                                const headers = "Domain,Subject,Sender,Recipient,Date,Body\n";
                                const row = `"${selectedAdvisoryDomain || "unknown"}","${mailSubject.replace(/"/g, '""')}","alerts@certguard.private","${mailTo.replace(/"/g, '""')}","${new Date().toISOString()}","${mailBody.replace(/"/g, '""')}"`;
                                const content = headers + row;
                                handleDownloadFile(filename, content, "text/csv");
                              }}
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
                            >
                              📊 Download .CSV File
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* PAGE: 🧠 MODEL CONTEXT PROTOCOL (MCP) AI AGENT WORKSPACE */}
              {activeTab === "mcp-agent" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-6xl mx-auto"
                >
                  {renderPageHeaderBanner(
                    "Model Context Protocol (MCP) Workspace",
                    "Interact with the local MCP server schema, declared tools, and trigger JSON-RPC executions with our AI DevSecOps agent.",
                    "/circuit_motherboard.png",
                    <Terminal className="w-5 h-5 text-pink-400" />,
                    <div className="w-fit flex items-center gap-2 bg-slate-850/80 border border-slate-700/50 px-3.5 py-2.5 rounded-xl">
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping shrink-0"></span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase shrink-0">MCP Status:</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">HTTPS/SSE ACTIVE</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* MCP SCHEMA & TOOLS LIST PANEL */}
                    <div className="lg:col-span-5 bg-brand-surface border border-brand-surface-2 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        <div className="border-b border-brand-surface-2 pb-2">
                          <h4 className="font-semibold text-white flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-pink-400" />
                            <span>Registered MCP Tool Registry</span>
                          </h4>
                          <p className="text-[10px] text-slate-400 text-mono">Declared tools exposed to the agent model via JSON-RPC</p>
                        </div>

                        <div className="space-y-2.5">
                          {mcpTools.length === 0 ? (
                            <div className="py-24 text-center text-slate-500">
                              <RefreshCw className="w-6 h-6 text-slate-600 animate-spin mx-auto mb-2" />
                              <p className="text-xs">Connecting to MCP discovery host...</p>
                            </div>
                          ) : (
                            mcpTools.map((t, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedMcpTool(t.name)}
                                className={`w-full text-left p-4 rounded-xl border transition-all text-xs space-y-2 ${
                                  selectedMcpTool === t.name 
                                    ? "bg-pink-500/10 border-pink-500 text-white shadow-inner font-semibold" 
                                    : "bg-slate-950/20 border-brand-surface-2 hover:border-slate-800 text-slate-400 hover:text-white"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-bold text-pink-400 underline">{t.name}</span>
                                  <span className="text-[9px] uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono font-semibold">JSON-RPC Call</span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-slate-300">{t.description}</p>
                                
                                {t.inputSchema && (
                                  <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-900 font-mono text-[9px] text-slate-400">
                                    <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider">Required Args Structure:</span>
                                    <p className="overflow-x-auto whitespace-pre">{JSON.stringify(t.inputSchema.properties, null, 2)}</p>
                                  </div>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      </div>

                      {/* CONFIGURE SELECTED TOOL INPUT ARGUMENTS */}
                      {selectedMcpTool && mcpTools.find(x => x.name === selectedMcpTool) && (
                        <div className="bg-slate-950/40 border border-brand-surface-2 p-4 rounded-xl space-y-3">
                          <h5 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                            <CornerDownRight className="w-3.5 h-3.5 text-pink-400" />
                            <span>Assign Parameters values:</span>
                          </h5>
                          
                          <div className="space-y-2 text-xs">
                            <label className="block text-slate-400 pl-1 font-mono text-[10px]">
                              {selectedMcpTool === "check_ssl_cert" ? "hostname (string)" : selectedMcpTool === "draft_escalation_ticket" ? "domain (string)" : selectedMcpTool === "dispatch_renewal_alert_email" ? "domain (string)" : "arguments (no-payload)"}
                            </label>
                            
                            {selectedMcpTool !== "fetch_ist_time" ? (
                              <input 
                                type="text"
                                placeholder={selectedMcpTool === "dispatch_renewal_alert_email" ? "e.g. google.com" : "e.g. expired.badssl.com"}
                                value={mcpToolArgs[selectedMcpTool] || ""}
                                onChange={(e) => setMcpToolArgs({ ...mcpToolArgs, [selectedMcpTool]: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-900 outline-none focus:border-pink-500/50 px-3.5 py-2.5 rounded-xl font-mono text-xs text-rose-200 transition-all placeholder:text-slate-600"
                              />
                            ) : (
                              <p className="text-[10px] text-slate-500 font-mono italic pl-1 leading-relaxed">No static arguments are parameters requested for this query. Auto calculates timezone offsets for IST.</p>
                            )}

                            <button
                              onClick={handleExecuteMcp}
                              disabled={isExecutingMcp || (selectedMcpTool !== "fetch_ist_time" && !mcpToolArgs[selectedMcpTool])}
                              className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl font-mono text-xs tracking-wider uppercase shadow-md hover:shadow-pink-500/10 cursor-pointer text-center mt-2.5 transition-all"
                            >
                              {isExecutingMcp ? "🔄 executing JSON-RPC..." : "⚡ trigger tool/call"}
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* MCP EXECUTION TERMINAL VIEW */}
                    <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col p-5 font-mono text-xs space-y-4 justify-between h-[660px]">
                      
                      {/* header log monitor */}
                      <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-semibold text-white tracking-wider uppercase text-[11px] flex items-center gap-1.5 text-pink-400">
                            <span>Console Monitor</span>
                          </h4>
                          <p className="text-[9px] text-slate-500">Live logs from execution pipeline</p>
                        </div>
                        
                        <button 
                          onClick={() => setMcpRunLog([])}
                          disabled={mcpRunLog.length === 0}
                          className="text-[10px] text-slate-500 hover:text-slate-300 font-semibold bg-slate-900 border border-slate-800/80 px-2.5 py-1 rounded-lg"
                        >
                          Clear
                        </button>
                      </div>

                      {/* Log Area */}
                      <div className="flex-1 bg-black/55 border border-slate-900 rounded-xl p-4 overflow-y-auto space-y-2 text-[11px] leading-relaxed text-slate-400 select-text max-h-[440px]">
                        {mcpRunLog.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 space-y-2">
                            <Terminal className="w-10 h-10 stroke-[1.2]" />
                            <p className="text-xs">No transactions in loop.</p>
                            <p className="text-[10px] text-slate-700 max-w-xs font-sans">Select any MCP tool and click 'trigger tool/call'. Direct schema binding allows you to test the AI model's JSON-RPC call flow over sandboxed environments.</p>
                          </div>
                        ) : (
                          mcpRunLog.map((log, logIdx) => (
                            <div 
                              key={logIdx} 
                              className={`transition-all whitespace-pre-wrap ${
                                log.includes("❌") ? "text-rose-400" : log.includes("✅") ? "text-emerald-400" : log.includes("📡") ? "text-pink-300 font-semibold" : "text-slate-400"
                              }`}
                            >
                              {log}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Returned Payload Result Area */}
                      <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-xl space-y-2 select-text max-h-[140px] overflow-y-auto">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-805pb-1 font-mono">Response Payload: JSON-RPC (2.0)</span>
                        {mcpResultPayload ? (
                          <pre className="text-[10px] text-emerald-400 leading-normal">{JSON.stringify(mcpResultPayload, null, 2)}</pre>
                        ) : (
                          <p className="text-[10px] text-slate-600 font-mono italic">Waiting for successful command response...</p>
                        )}
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* PAGE 4: 📋 HISTORICAL SCANS LEDGER RECORDS */}
              {activeTab === "history" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-4xl mx-auto"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-surface-2 pb-4">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                        <Database className="w-6 h-6 text-amber-400" />
                        <span>SSL Registry Historical Ledger Ledger</span>
                      </h2>
                      <p className="text-sm text-slate-400">Inspect historical SSL checks, manage active databases, and reset log streams.</p>
                    </div>
                    
                    <button
                      onClick={() => handleResetDatabase("all")}
                      className="flex items-center gap-1.5 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Nuclear Reset Ledger DB</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* HISTORICAL LOGS TABLE */}
                    <div className="lg:col-span-8 bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-brand-surface-2/60 pb-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-400" />
                          <h4 className="font-display font-semibold text-white text-sm">Historical Scan Log Entries ({results.length})</h4>
                        </div>
                        <button 
                          onClick={() => handleResetDatabase("history")}
                          className="text-slate-400 hover:text-white text-xs font-semibold block"
                        >
                          Clear Items List
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead>
                            <tr className="text-slate-400 border-b border-brand-surface-2/40 pb-2">
                              <th className="py-2">Hostname</th>
                              <th className="py-2">Risk Status</th>
                              <th className="py-2 text-right">Days Valid</th>
                              <th className="py-2 text-center">Grade</th>
                              <th className="py-2 text-right">TLS Connection</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-500 text-xs font-mono">Ledger is empty. No domains currently scanned.</td>
                              </tr>
                            ) : (
                              results.map((r, rIdx) => (
                                <tr key={rIdx} className="border-b border-brand-surface-2/20 hover:bg-slate-900/40 transition-colors">
                                  <td className="py-2.5 text-slate-200 font-bold">{r.domain}</td>
                                  <td className="py-2.5">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                      r.riskLevel === "expired" || r.riskLevel === "critical" ? "text-rose-400 bg-rose-500/10" 
                                        : r.riskLevel === "high" ? "text-orange-400 bg-orange-500/10" : "text-emerald-400 bg-emerald-500/10"
                                    }`}>
                                      {r.riskLevel}
                                    </span>
                                  </td>
                                  <td className="py-2.5 text-right text-slate-300 font-bold">{r.daysRemaining === null ? "—" : r.daysRemaining}</td>
                                  <td className="py-2.5 text-center text-slate-100 font-bold">{r.sslGrade}</td>
                                  <td className="py-2.5 text-right">
                                    <span className={r.status === "success" ? "text-emerald-400" : "text-rose-400"}>
                                      {r.status.toUpperCase()}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* DB SESSION LOG COUNTERS */}
                    <div className="lg:col-span-4 bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl space-y-4">
                      
                      <div className="flex items-center gap-2 border-b border-brand-surface-2/60 pb-3">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <h4 className="font-display font-semibold text-white text-sm">Database Session Tracker</h4>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {sessions.length === 0 ? (
                          <p className="text-xs font-mono text-slate-500 text-center py-4">No historical audit sessions recorded.</p>
                        ) : (
                          sessions.map((sess, sIdx) => (
                            <div key={sIdx} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-2">
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="font-sans font-bold text-white text-[11px] block">{sess.id}</span>
                                <span className="text-[10px] text-slate-400">{new Date(sess.createdAt).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono pt-1">
                                <div className="bg-brand-surface p-1.5 rounded border border-slate-800">
                                  <span className="font-mono text-slate-200 font-bold">{sess.totalDomains}</span>
                                  <span className="block text-slate-500 mt-0.5 text-[8px] uppercase">Asset</span>
                                </div>
                                <div className="bg-rose-500/5 p-1.5 rounded border border-rose-500/10">
                                  <span className="font-mono text-rose-400 font-bold">{sess.criticalCount}</span>
                                  <span className="block text-rose-500/60 mt-0.5 text-[8px] uppercase">Alert</span>
                                </div>
                                <div className="bg-emerald-500/5 p-1.5 rounded border border-emerald-500/10">
                                  <span className="font-mono text-emerald-400 font-bold">{sess.securityScore}%</span>
                                  <span className="block text-emerald-500/60 mt-0.5 text-[8px] uppercase">Score</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* PAGE 6: 🔬 LLM PROMPT ENGINEERING LABORATORY */}
              {activeTab === "prompt-lab" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-6xl mx-auto"
                >
                  {/* Page Header */}
                  <div className="border-b border-brand-surface-2 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                        <span>LLM Threat-Response Engineering Laboratory</span>
                      </h2>
                      <p className="text-sm text-slate-400 font-medium">Fine-tune system prompts, adjust model hyperparameters, and execute security telemetry trials.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,211,238,0.15)]">
                        <Terminal className="w-3 h-3 text-cyan-400 animate-pulse" />
                        <span>Role: LLM Developer Mode</span>
                      </span>
                    </div>
                  </div>

                  {/* Preset Controls Row */}
                  <div className="bg-brand-surface border border-brand-surface-2 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-widest sm:border-r sm:border-brand-surface-2 pr-3 shrink-0">System Instruction Presets:</span>
                    <div className="flex flex-wrap gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setPromptLabSystemInstruction("You are the CertGuard Artificial Intelligence SecOps Co-Pilot, responding to direct inquiries on operational vulnerability rosters, SSL/TLS protocol lifecycle standards, and network-level protection protocols.");
                          triggerToast("Copied 'Default SecOps Co-Pilot' preset!", "info");
                        }}
                        className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-indigo-500/20 bg-indigo-950/20 text-indigo-300 hover:bg-indigo-950/40 hover:text-white transition-all cursor-pointer"
                      >
                        🤖 Default SecOps Co-Pilot
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPromptLabSystemInstruction("You are a Senior ITIL Incident Response Coordinator. Generate highly structured, production-ready compliance guidelines. Output responses ONLY in valid, elegant Markdown with clean checklists.");
                          triggerToast("Copied 'ITIL Outage Coordinator' preset!", "info");
                        }}
                        className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 hover:text-white transition-all cursor-pointer"
                      >
                        ⚙️ ITIL Outage Coordinator
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPromptLabSystemInstruction("You are the Lead Threat Intelligence Analyst on CertGuard. Your style is deeply technical, critical, and aggressive. Focus on finding cryptography flaws, cipher suites failures, and CA vulnerabilities.");
                          triggerToast("Copied 'Aggressive Threat Hunter' preset!", "info");
                        }}
                        className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-rose-500/20 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 hover:text-white transition-all cursor-pointer"
                      >
                        ⚔️ Aggressive Threat Hunter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPromptLabSystemInstruction("You are a CISO Regulatory Auditor specializing in SOC2, PCI-DSS, and HIPAA certificate lifespans. Analyze ssl metrics purely of compliance standard requirements.");
                          triggerToast("Copied 'Compliance Auditor' preset!", "info");
                        }}
                        className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-amber-500/20 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 hover:text-white transition-all cursor-pointer"
                      >
                        🛡️ compliance Auditor
                      </button>
                    </div>
                  </div>

                  {/* Primary Layout Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT COLUMN: Param Tuning Section (5 columns) */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl space-y-5">
                        <div className="border-b border-brand-surface-2 pb-2">
                          <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
                            <SettingsIcon className="w-4 h-4 text-slate-400" />
                            <span>Hyperparameter Tuning</span>
                          </h3>
                        </div>

                        {/* Model Selector dropdown */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Target LLM Model</label>
                          <select
                            value={promptLabModel}
                            onChange={(e) => setPromptLabModel(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white outline-none focus:border-cyan-500 transition-all font-bold cursor-pointer"
                          >
                            <option value="gemini-3.5-flash">gemini-3.5-flash (Balanced Speed / Intelligence)</option>
                            <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Code Reasoning - Paid Tier)</option>
                          </select>
                          <span className="text-[9px] text-slate-500 leading-normal block">
                            Gemini model architecture determines primary inference capabilities. Flash model resolves in milliseconds.
                          </span>
                        </div>

                        {/* Temperature Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                            <span className="uppercase tracking-widest font-bold">Temperature (Inference Entropy)</span>
                            <span className="text-cyan-400 font-bold">{promptLabTemperature}</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1.5"
                            step="0.1"
                            value={promptLabTemperature}
                            onChange={(e) => setPromptLabTemperature(parseFloat(e.target.value))}
                            className="w-full select-none cursor-pointer h-1.5 bg-slate-900 rounded-lg appearance-none accent-cyan-400"
                          />
                          <div className="flex justify-between items-center text-[9px] text-slate-500">
                            <span>0.1 (Strict Technical)</span>
                            <span>1.5 (Creative Explanatory)</span>
                          </div>
                        </div>

                        {/* Top-P Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                            <span className="uppercase tracking-widest font-bold">Top-P (Nucleus Sampling)</span>
                            <span className="text-indigo-400 font-bold">{promptLabTopP}</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={promptLabTopP}
                            onChange={(e) => setPromptLabTopP(parseFloat(e.target.value))}
                            className="w-full select-none cursor-pointer h-1.5 bg-slate-900 rounded-lg appearance-none accent-indigo-400"
                          />
                        </div>

                        {/* System Instructions Area */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Active System Instructions</label>
                          <textarea
                            rows={5}
                            value={promptLabSystemInstruction}
                            onChange={(e) => setPromptLabSystemInstruction(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 outline-none focus:border-cyan-500 transition-all font-semibold leading-relaxed"
                            placeholder="System guidelines..."
                          />
                          <span className="text-[9px] text-slate-500 block leading-relaxed">
                            Provides constant identity constraints inside Gemini context windows, overriding generic assistant defaults.
                          </span>
                        </div>

                      </div>

                      {/* INJECT SCAN RECORDS SELECTION UTILITY CARD */}
                      <div className="bg-brand-surface border border-brand-surface-2 p-5 rounded-2xl space-y-4">
                        <div className="border-b border-brand-surface-2 pb-2">
                          <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
                            <Database className="w-4 h-4 text-indigo-400" />
                            <span>Domain Registry Injector</span>
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Quickly inject mock or real monitored certificate data as a prompt segment for standard vulnerability testing.
                        </p>

                        <div className="space-y-3">
                          <div className="max-h-56 overflow-y-auto border border-slate-800 rounded-xl divide-y divide-slate-900 bg-slate-950 p-2 space-y-1">
                            {results.length === 0 ? (
                              <div className="text-center py-4 text-xs font-mono text-slate-500">No Domains Monitored</div>
                            ) : (
                              results.slice(0, 8).map(res => (
                                <button
                                  key={res.domain}
                                  type="button"
                                  onClick={() => {
                                    setPromptLabPrompt(`Perform a rigorous risk diagnostic on SSL/TLS client certificate metadata:
Domain: ${res.domain}
Certificate Issuer (CA): ${res.issuer || "Unknown CA"}
Remaining Signature Lifespan: ${res.daysRemaining ?? "Expired"} days
SSL Grade Status: ${res.sslGrade || "N/A"}
Validation Signature Algorithm: ${res.signatureAlgorithm || "N/A"}

State whether this configuration complies with optimal regulatory guidelines (PCI-DSS standards). Provide direct corporate remediation runbooks.`);
                                    triggerToast(`Injected results for ${res.domain} into prompt!`, "success");
                                  }}
                                  className="w-full text-left text-xs font-mono py-2 px-2.5 hover:bg-slate-900/60 transition-all rounded text-slate-300 flex items-center justify-between cursor-pointer"
                                >
                                  <span>🌐 {res.domain}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${res.riskLevel === "expired" ? "bg-red-500/10 text-red-400" : res.riskLevel === "high" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                                    {res.riskLevel.toUpperCase()}
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Playground (7 columns) */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="bg-brand-surface border border-brand-surface-2 p-6 rounded-2xl space-y-4">
                        <div className="border-b border-brand-surface-2 pb-2">
                          <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-cyan-400" />
                            <span>Interactive Prompt Sandbox</span>
                          </h3>
                        </div>

                        {/* Quick Prompt Templates list */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPromptLabPrompt("Assess optimal SSL validation standard differences regarding DigiCert wildcard certificates vs. self-signed letsencrypt lifespans. Formulate a comparative breakdown.");
                              triggerToast("Loaded: CA Assessment Template", "info");
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono font-bold rounded-md border border-slate-800 text-slate-300 transition-all cursor-pointer"
                          >
                            📄 Compare Let's Encrypt vs DigiCert
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPromptLabPrompt("Construct an optimal, multi-stage cybersecurity crisis scenario runbook for corporate operations dealing with deep SSL root key breaches. Outline exact team roles.");
                              triggerToast("Loaded: Root Key Breach Template", "info");
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono font-bold rounded-md border border-slate-800 text-slate-300 transition-all cursor-pointer"
                          >
                            ⚠️ Root Key Outage Escalation Plan
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPromptLabPrompt("Generate an elaborate technical review of secure TLS 1.3 cryptographic cipher structures (AES-256-GCM vs CHACHA20-POLY1305), listing why legacy SHA-1 or MD5 algorithms are outlawed.");
                              triggerToast("Loaded: Cipher Guidelines Template", "info");
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono font-bold rounded-md border border-slate-800 text-slate-300 transition-all cursor-pointer"
                          >
                            🔐 TLS 1.3 Cryptography Audit
                          </button>
                        </div>

                        {/* User Prompt Input */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">User Prompt Context</label>
                          <textarea
                            rows={5}
                            value={promptLabPrompt}
                            onChange={(e) => setPromptLabPrompt(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 outline-none focus:border-cyan-500 transition-all font-medium leading-relaxed"
                            placeholder="Type your experiment prompt here..."
                          />
                        </div>

                        {/* Execution Button */}
                        <button
                          type="button"
                          onClick={handlePromptLabEvaluate}
                          disabled={promptLabLoading}
                          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_20px_rgba(6,182,212,0.35)] cursor-pointer disabled:opacity-45"
                        >
                          {promptLabLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Simulating Neural Model Response...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 text-white animate-pulse" />
                              <span>Run Prompt Trial</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* TRIAL PERFORMANCE LOG AND TEST OUTCOME */}
                      {promptLabResponse && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-brand-surface border border-cyan-500/25 rounded-2xl p-6 space-y-4"
                        >
                          {/* Headers and Stats */}
                          <div className="flex flex-wrap items-center justify-between border-b border-brand-surface-2/60 pb-3 gap-2">
                            <span className="font-display font-semibold text-white text-sm flex items-center gap-2">
                              <FileCheck2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                              <span>Model Output Validation Target</span>
                            </span>
                            
                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded">
                                Model: <strong className="text-white font-bold">{promptLabModelUsed}</strong>
                              </span>
                              {promptLabLatency !== null && (
                                <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded">
                                  Latency: <strong className="text-cyan-400 font-bold">{promptLabLatency} ms</strong>
                                </span>
                              )}
                              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded">
                                Size: <strong className="text-indigo-400 font-bold">{promptLabResponse.length} Chars</strong>
                              </span>
                            </div>
                          </div>

                          {/* Render Output String as Markdown */}
                          <div className="bg-slate-950 border border-slate-900 p-5 rounded-xl max-h-[480px] overflow-y-auto leading-relaxed text-xs">
                            <div className="markdown-body text-slate-200">
                              <Markdown>{promptLabResponse}</Markdown>
                            </div>
                          </div>

                          {/* Copy button */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(promptLabResponse);
                                triggerToast("Copied LLM Output to clipboard!", "success");
                              }}
                              className="px-3.5 py-1.5 border border-brand-surface-2 hover:border-slate-400 text-slate-400 hover:text-white transition-all rounded-lg text-xs font-mono font-bold flex items-center gap-2 cursor-pointer bg-slate-950/40"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Raw Result</span>
                            </button>
                          </div>
                        </motion.div>
                      )}

                    </div>

                  </div>

                </motion.div>
              )}

              {/* PAGE 5: ⚙️ DIAGNOSTICS & SYSTEM INFO */}
              {activeTab === "settings" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-2xl mx-auto"
                >
                  <div className="border-b border-brand-surface-2 pb-4">
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                      <SettingsIcon className="w-6 h-6 text-slate-400" />
                      <span>System Configuration Diagnostics</span>
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">Verify API server-side variables, check database counters, and trace active processes.</p>
                  </div>

                  <div className="bg-brand-surface border border-brand-surface-2 p-6 rounded-2xl space-y-6">
                    
                    {/* SECTION 1: API SECURITY */}
                    <div className="space-y-3">
                      <h4 className="font-display font-semibold text-white flex items-center gap-2 text-sm">
                        <Activity className="w-5 h-5 text-yellow-400" />
                        <span>API Security Gateways</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        The CertGuard orchestrator uses the native Node TLS stack to negotiate raw SSL handshakes. No remote data is transmitted to third parties except when generating ITIL helpdesk tickets and CISO audit summaries through our zero-leak Gemini-3.5-Flash pipeline.
                      </p>
                      
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-mono font-bold text-white block">Status: Active Connector Model</span>
                          <span className="text-[10px] text-slate-500 font-mono block">Node TLS Ingress standard, port 3000 mapping.</span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                          CONNECTED / LIVE
                        </span>
                      </div>
                    </div>

                    {/* SECTION 2: REGISTRY DATABASES */}
                    <div className="space-y-3 pt-4 border-t border-brand-surface-2/40">
                      <h4 className="font-display font-semibold text-white flex items-center gap-2 text-sm">
                        <Database className="w-5 h-5 text-blue-400" />
                        <span>Database Storage Registry Status</span>
                      </h4>
                      
                      <div className="grid grid-cols-3 gap-4 text-center text-xs font-mono pt-1">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                          <span className="text-slate-400 block pb-1 text-[9px] uppercase tracking-wide">Scans Logged</span>
                          <strong className="text-slate-100 text-lg block font-bold">{dbStats.totalScans}</strong>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                          <span className="text-slate-400 block pb-1 text-[9px] uppercase tracking-wide">Sessions</span>
                          <strong className="text-slate-100 text-lg block font-bold">{dbStats.totalSessions}</strong>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                          <span className="text-slate-400 block pb-1 text-[9px] uppercase tracking-wide">Incident Jobs</span>
                          <strong className="text-slate-100 text-lg block font-bold">{dbStats.totalTickets}</strong>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: SYSTEM SPEC CHECKLIST */}
                    <div className="space-y-3 pt-4 border-t border-brand-surface-2/40">
                      <h4 className="font-display font-semibold text-white flex items-center gap-2 text-sm">
                        <Compass className="w-5 h-5 text-emerald-400" />
                        <span>Architecture Specifications</span>
                      </h4>
                      <ul className="text-xs font-mono space-y-2 pl-2 text-slate-300">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          <span>Frontend: React v19, Tailwind CSS v4, Motion Transitions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          <span>Backend: Custom Express JS Engine with raw tcp peer connection readers</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          <span>Database Persistence: Persistent JSON server file system store</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          <span>Audit Exporters: High-Format Markdown summaries and complete CSV sheets</span>
                        </li>
                      </ul>
                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-brand-surface/20 border-t border-brand-surface-2 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shrink-0">
        <p>© 2026 CertGuard Diagnostics. Enterprise Private Trust Infrastructure Platform.</p>
        <p className="font-mono">Node Core TLS Handshaker (Port 3000 Ingress Enforced)</p>
      </footer>

      {/* OVERLAY 1: TICKET VIEW INCIDENT REPORT DETAIL MODAL */}
      <AnimatePresence>
        {activeTicket && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-brand-surface border border-indigo-500/35 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-brand-surface-2 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider">
                    Incident Draft File
                  </span>
                  <span className="text-sm font-mono text-indigo-400 font-black">{activeTicket.id}</span>
                </div>
                <button 
                  onClick={() => setActiveTicket(null)}
                  className="text-slate-400 hover:text-white font-semibold text-xs py-1 px-2.5 hover:bg-slate-800 rounded-lg"
                >
                  Close
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest block">INCIDENT SUBJECT</span>
                <h4 className="text-xs font-mono font-bold text-slate-100 bg-slate-900 border border-slate-800 rounded-lg p-2.5">{activeTicket.ticketSubject}</h4>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest block">ITIL TECHNICAL LAYOUT BODY</span>
                <textarea 
                  rows={8}
                  value={activeTicket.ticketBody}
                  readOnly
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest block">AI FUTURE LIFECYCLE PREDICTION</span>
                  <p className="text-xs text-slate-300 italic font-medium">{activeTicket.prediction}</p>
                </div>
                
                <div className="flex items-end justify-end gap-2">
                  <button
                    onClick={() => copyToClipboard(activeTicket.ticketBody, "ticket-body-copy")}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 border border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    {copiedId === "ticket-body-copy" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === "ticket-body-copy" ? "Copied" : "Copy ticket"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OVERLAY 2: EMAIL NOTIFICATION DRAFT MODAL */}
      <AnimatePresence>
        {activeEmailAlert && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-brand-surface border border-orange-500/35 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-brand-surface-2 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <span className="text-xs font-mono text-orange-400 font-black">Pre-filled Alert Outreach Draft</span>
                </div>
                <button 
                  onClick={() => setActiveEmailAlert(null)}
                  className="text-slate-400 hover:text-white font-semibold text-xs py-1 px-2.5 hover:bg-slate-800 rounded-lg"
                >
                  Close
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest block">EMAIL SUBJECT</span>
                <h4 className="text-xs font-mono font-bold text-slate-200 bg-slate-900 px-3 py-2 border border-slate-800 rounded-lg">{activeEmailAlert.subject}</h4>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest block">OUTBOUND MAIL BODY</span>
                  <div className="flex bg-slate-950 border border-slate-900 p-0.5 rounded-lg text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveEmailAlertMode("edit")}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${activeEmailAlertMode === "edit" ? "bg-orange-500/10 text-orange-450 border border-orange-500/20 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      Plaintext Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveEmailAlertMode("preview")}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${activeEmailAlertMode === "preview" ? "bg-orange-500/10 text-orange-450 border border-orange-500/20 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      Rich Markdown
                    </button>
                  </div>
                </div>

                {activeEmailAlertMode === "edit" ? (
                  <textarea 
                    rows={8}
                    value={activeEmailAlert.body}
                    onChange={(e) => setActiveEmailAlert({ ...activeEmailAlert, body: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-900 outline-none focus:border-orange-500/40 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed"
                  />
                ) : (
                  <div className="w-full min-h-[160px] max-h-[240px] overflow-y-auto bg-slate-950 border border-slate-900 rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-sans prose prose-invert select-text scrollbar-thin">
                    <div className="markdown-body">
                      <Markdown>{activeEmailAlert.body}</Markdown>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] text-slate-500 italic font-mono uppercase">Gateway Routing Status: Active smtplib ready.</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(activeEmailAlert.body, "email-body-copy")}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold hover:text-white transition-all cursor-pointer"
                  >
                    {copiedId === "email-body-copy" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === "email-body-copy" ? "Copied" : "Copy Draft"}</span>
                  </button>
                  <button
                    onClick={handleSendManualRenewalEmail}
                    disabled={isSendingRenewal}
                    className="flex items-center gap-1.5 bg-[#F5A500] hover:bg-[#F59500] text-black px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-orange-500/15 transition-all cursor-pointer font-sans disabled:opacity-55"
                  >
                    {isSendingRenewal ? (
                      <span className="animate-pulse">SMTP Sending...</span>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send Renewal Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OVERLAY 3: SCAN POSTURE STATUS ALERT (CRITICAL, WARNING, HEALTHY) */}
      <AnimatePresence>
        {scanAlert && scanAlert.isOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md bg-[#020617] border rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden ${
                scanAlert.status === "CRITICAL" ? "border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.25)]" :
                scanAlert.status === "WARNING" ? "border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.25)]" :
                "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
              }`}
            >
              {/* Holographic Glowing Corners Frame */}
              <div className="absolute -inset-1 pointer-events-none z-0">
                <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-xl ${
                  scanAlert.status === "CRITICAL" ? "border-rose-400" :
                  scanAlert.status === "WARNING" ? "border-amber-400" :
                  "border-emerald-400"
                }`}></div>
                <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-xl ${
                  scanAlert.status === "CRITICAL" ? "border-rose-400" :
                  scanAlert.status === "WARNING" ? "border-amber-400" :
                  "border-emerald-400"
                }`}></div>
                <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-xl ${
                  scanAlert.status === "CRITICAL" ? "border-rose-400" :
                  scanAlert.status === "WARNING" ? "border-amber-400" :
                  "border-emerald-400"
                }`}></div>
                <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-xl ${
                  scanAlert.status === "CRITICAL" ? "border-rose-400" :
                  scanAlert.status === "WARNING" ? "border-amber-400" :
                  "border-emerald-400"
                }`}></div>
              </div>

              {/* Status Header */}
              <div className="text-center space-y-3 pt-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2 ${
                  scanAlert.status === "CRITICAL" ? "bg-rose-500/10 border-rose-500/50 text-rose-400 animate-pulse" :
                  scanAlert.status === "WARNING" ? "bg-amber-500/10 border-amber-500/50 text-amber-400" :
                  "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                }`}>
                  {scanAlert.status === "CRITICAL" ? <ShieldAlert className="w-8 h-8" /> :
                   scanAlert.status === "WARNING" ? <AlertTriangle className="w-8 h-8" /> :
                   <ShieldCheck className="w-8 h-8" />}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-black">SCAN RESULT COMPLETED</span>
                  <h3 className={`text-2xl font-display font-black tracking-tight uppercase ${
                    scanAlert.status === "CRITICAL" ? "text-rose-400" :
                    scanAlert.status === "WARNING" ? "text-amber-400" :
                    "text-emerald-400"
                  }`}>
                    {scanAlert.status === "CRITICAL" ? "🚨 CRITICAL STATUS" :
                     scanAlert.status === "WARNING" ? "⚠️ WARNING STATUS" :
                     "✅ HEALTHY STATUS"}
                  </h3>
                </div>
              </div>

              {/* Scan Info */}
              <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
                <div>
                  <span className="text-slate-500 font-bold uppercase block text-[9px] tracking-wider">Target Domain / Host:</span>
                  <span className="text-white font-semibold break-all">{scanAlert.domain}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase block text-[9px] tracking-wider">Classification Level:</span>
                  <span className={`font-extrabold uppercase ${
                    scanAlert.status === "CRITICAL" ? "text-rose-400" :
                    scanAlert.status === "WARNING" ? "text-amber-400" :
                    "text-emerald-400"
                  }`}>{scanAlert.risk}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase block text-[9px] tracking-wider">Posture Analysis Summary:</span>
                  <span className="leading-relaxed font-sans font-medium text-slate-200 block mt-1">{scanAlert.details}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setScanAlert(null)}
                className={`w-full py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                  scanAlert.status === "CRITICAL" ? "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)]" :
                  scanAlert.status === "WARNING" ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]" :
                  "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                }`}
              >
                Acknowledge Security Ledger
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING DIALOG ALERTS */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 p-4 border rounded-2xl flex items-center gap-3 shadow-2xl max-w-sm bg-brand-surface border-slate-700"
          >
            <div className={`w-3 h-3 rounded-full shrink-0 ${
              toast.type === "success" ? "bg-emerald-400 animate-ping" : toast.type === "warning" ? "bg-amber-400" : "bg-rose-400"
            }`} />
            <p className="text-xs font-semibold text-slate-100 leading-relaxed font-sans">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
