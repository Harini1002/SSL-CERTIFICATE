import { exec } from "child_process";
import { ScanResult, MailAlert } from "../src/types.js";
import { saveMailAlert } from "./db.js";

/**
 * Runs Python mailer.py process and parses JSON output.
 */
function runPythonMailer(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    // Construct command with properly-escaped arguments
    const cmd = `python3 mailer.py ${args.join(" ")}`;
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`[Mailer subprocess error]:`, stderr || error.message);
        return resolve({
          sent: false,
          connected: false,
          message: stderr.trim() || error.message
        });
      }
      
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (err) {
        console.error(`[Mailer JSON parse error] stdout: "${stdout}"`, err);
        resolve({
          sent: false,
          connected: false,
          message: `Malformed output from mailer script: ${stdout.trim() || "No output"}`
        });
      }
    });
  });
}

/**
 * Escape JSON strings so they can be passed as terminal arguments safely.
 * On Linux/Unix, surrounding the JSON in single quotes means we only need to double-escape double quotes,
 * or serialize in a shell-safe manner.
 */
function escapeShellArg(arg: string): string {
  // Surrounding with single quotes of single-quoted string: replace ' with '"'"'
  return `'${arg.replace(/'/g, "'\"'\"'")}'`;
}

/**
 * FUNCTION 4 Bridge: test_email_connection
 */
export async function runTestConnection(): Promise<any> {
  return runPythonMailer(["--action", "test"]);
}

/**
 * FUNCTION 1 Bridge: send_critical_alert
 */
export async function runSendCriticalAlert(domainData: ScanResult, recipient?: string): Promise<any> {
  const payload = {
    ...domainData,
    recipient: recipient || "harinisivanathanvs@gmail.com"
  };
  const escapedData = escapeShellArg(JSON.stringify(payload));
  const res = await runPythonMailer(["--action", "critical", "--data", escapedData]);
  
  if (res && res.sent) {
    saveMailAlert({
      id: `mail-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`,
      domain: domainData.domain,
      sender: "harinisivanathanvs@gmail.com",
      recipient: recipient || "harinisivanathanvs@gmail.com",
      subject: `🚨 [CRITICAL ALERT] SSL Certificate Expiry — ${domainData.domain}`,
      body: `Automated critical SSL warning sent via python smtplib.`,
      status: "dispatched",
      sentAt: new Date().toISOString()
    });
  }
  return res;
}

/**
 * FUNCTION 2 Bridge: send_renewal_email
 */
export async function runSendRenewalEmail(domainData: ScanResult, aiEmailContent: string, recipient?: string): Promise<any> {
  const payload = {
    ...domainData,
    recipient: recipient || "harinisivanathanvs@gmail.com"
  };
  const escapedData = escapeShellArg(JSON.stringify(payload));
  const escapedAi = escapeShellArg(aiEmailContent);
  const res = await runPythonMailer([
    "--action", "renewal", 
    "--data", escapedData, 
    "--ai-content", escapedAi
  ]);
  
  if (res && res.sent) {
    saveMailAlert({
      id: `mail-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`,
      domain: domainData.domain,
      sender: "harinisivanathanvs@gmail.com",
      recipient: recipient || "harinisivanathanvs@gmail.com",
      subject: `📋 SSL Renewal Required — ${domainData.domain}`,
      body: aiEmailContent,
      status: "dispatched",
      sentAt: new Date().toISOString()
    });
  }
  return res;
}

/**
 * FUNCTION 3 Bridge: send_bulk_alert
 */
export async function runSendBulkAlert(allResults: ScanResult[]): Promise<any> {
  const escapedData = escapeShellArg(JSON.stringify(allResults));
  const res = await runPythonMailer(["--action", "bulk", "--data", escapedData]);
  
  if (res && res.sent && res.domains_alerted && res.domains_alerted.length > 0) {
    for (const domain of res.domains_alerted) {
      saveMailAlert({
        id: `mail-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`,
        domain: domain,
        sender: "harinisivanathanvs@gmail.com",
        recipient: "harinisivanathanvs@gmail.com",
        subject: `🚨 [BULK ALERT] SSL certificate requires secure patching`,
        body: `Bulk scan summary covered multiple expiring certificates.`,
        status: "dispatched",
        sentAt: new Date().toISOString()
      });
    }
  }
  return res;
}
