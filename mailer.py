#!/usr/bin/env python3
import sys
import json
import smtplib
import ssl
import argparse
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

# ==========================================
# EMAIL CONFIG
# ==========================================
SMTP_SERVER   = "smtp.gmail.com"
SMTP_PORT     = 587
SENDER_EMAIL  = "harinisivanathanvs@gmail.com"
SENDER_NAME   = "CertGuard AI Monitor"
APP_PASSWORD  = "@92252324303614"

# Defaults, but can be overridden dynamically
RECEIVER_EMAIL = "harinisivanathanvs@gmail.com"
CC_EMAIL       = "security@company.com"

def get_ssl_context():
    return ssl.create_default_context()

def clean_value(dic, key_camel, key_snake, default="N/A"):
    if key_camel in dic and dic[key_camel] is not None:
        return dic[key_camel]
    if key_snake in dic and dic[key_snake] is not None:
        return dic[key_snake]
    return default

def send_mail_via_smtp(recipient, subject, html_body, cc_recipient=None):
    """
    Helper function to dispatch TLS-authenticated rich HTML email.
    """
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f'"{SENDER_NAME}" <{SENDER_EMAIL}>'
        msg['To'] = recipient
        
        recipients_list = [recipient]
        if cc_recipient:
            msg['Cc'] = cc_recipient
            recipients_list.append(cc_recipient)
            
        msg.attach(MIMEText(html_body, 'html'))
        
        context = get_ssl_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipients_list, msg.as_string())
            
        return {"sent": True, "error": None}
    except Exception as e:
        return {"sent": False, "error": str(e)}

# ────────────────────────────────────────
# FUNCTION 1: send_critical_alert
# ────────────────────────────────────────
def send_critical_alert(domain_data: dict) -> dict:
    domain = clean_value(domain_data, "domain", "domain")
    days_remaining = clean_value(domain_data, "daysRemaining", "days_remaining")
    expiry_date = clean_value(domain_data, "expiryDate", "expiry_date")
    risk_level = clean_value(domain_data, "riskLevel", "risk_level", "critical").lower()
    issuer = clean_value(domain_data, "issuer", "issuer")
    ssl_grade = clean_value(domain_data, "sslGrade", "ssl_grade")
    
    # Check custom recipient passed in domain_data or default
    recipient = domain_data.get("recipient", RECEIVER_EMAIL)
    cc_recipient = domain_data.get("cc_recipient", CC_EMAIL)
    
    # Subject: 🚨 [CRITICAL] SSL Certificate Expiry Alert — {domain} — {days} days remaining
    tag = "CRITICAL" if risk_level in ["expired", "critical"] else "HIGH RISK"
    subject = f"🚨 [{tag}] SSL Certificate Expiry Alert — {domain} — {days_remaining} days remaining"
    
    is_critical_outage = risk_level in ["expired", "critical"]
    header_color = "#FF4444" if is_critical_outage else "#FF8C00"
    header_title = "🚨 CRITICAL SSL ALERT" if is_critical_outage else "⚠️ HIGH RISK ALERT"
    sla_hours = "4" if is_critical_outage else "24"
    
    now_ist = datetime.now().strftime("%Y-%m-%d %H:%M:%S") + " IST"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 24px;
          color: #1e293b;
        }}
        .email-container {{
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }}
        .header-bar {{
          background-color: {header_color};
          color: #ffffff;
          padding: 24px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }}
        .content {{
          padding: 32px;
        }}
        .domain-name {{
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          background-color: #f1f5f9;
          padding: 12px 18px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 18px;
          text-align: center;
          margin: 16px 0;
          border: 1px solid #cbd5e1;
          color: #0f172a;
        }}
        .warning-text {{
          font-size: 15px;
          line-height: 1.6;
          color: #334155;
          margin-bottom: 24px;
        }}
        .details-table {{
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }}
        .details-table td, .details-table th {{
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
        }}
        .details-table th {{
          background-color: #f8fafc;
          color: #64748b;
          font-weight: 600;
          width: 35%;
        }}
        .details-table td {{
          color: #1e293b;
        }}
        .action-box {{
          background-color: {header_color}18;
          border-left: 4px solid {header_color};
          padding: 18px;
          border-radius: 8px;
          margin-bottom: 30px;
        }}
        .action-title {{
          font-weight: bold;
          font-size: 14px;
          color: {header_color};
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }}
        .action-desc {{
          font-size: 13px;
          color: #334155;
          line-height: 1.5;
          margin: 0;
        }}
        .steps-title {{
          font-weight: bold;
          font-size: 16px;
          color: #0f172a;
          margin-bottom: 12px;
        }}
        .steps {{
          margin: 0 0 24px 0;
          padding-left: 20px;
          font-size: 14px;
          color: #334155;
          line-height: 1.6;
        }}
        .steps li {{
          margin-bottom: 8px;
        }}
        .footer {{
          background-color: #f1f5f9;
          padding: 24px;
          text-align: center;
          font-size: 11px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
          line-height: 1.6;
        }}
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header-bar">
          {header_title}
        </div>
        <div class="content">
          <div class="domain-name">{domain}</div>
          <p class="warning-text">
            The SSL certificate for <strong>{domain}</strong> will expire in <strong>{days_remaining} days</strong>. Immediate action required to prevent service disruption, browser security warnings, and transactional client lockout.
          </p>
          
          <table class="details-table">
            <tr>
              <th>Domain</th>
              <td><strong>{domain}</strong></td>
            </tr>
            <tr>
              <th>Risk Level</th>
              <td><span style="color: {header_color}; font-weight: bold; text-transform: uppercase;">{risk_level}</span></td>
            </tr>
            <tr>
              <th>Days Left</th>
              <td><strong>{days_remaining} days</strong></td>
            </tr>
            <tr>
              <th>Expiry Date</th>
              <td>{expiry_date}</td>
            </tr>
            <tr>
              <th>Issuer</th>
              <td>{issuer}</td>
            </tr>
            <tr>
              <th>SSL Grade</th>
              <td><span style="background-color: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;">{ssl_grade}</span></td>
            </tr>
            <tr>
              <th>Detected By</th>
              <td>CertGuard AI</td>
            </tr>
            <tr>
              <th>Alert Time</th>
              <td>{now_ist}</td>
            </tr>
          </table>
          
          <div class="action-box">
            <div class="action-title">&amp;#9889; IMMEDIATE ACTION REQUIRED</div>
            <p class="action-desc">
              Renew this certificate within <strong>{sla_hours} hours</strong> to prevent browser security warnings and business service interruption.
            </p>
          </div>
          
          <div class="steps-title">Recommended SecOps Renewal Runbook:</div>
          <ol class="steps">
            <li>Log into your certificate provider (<strong>{issuer}</strong>)</li>
            <li>Locate the active certificate workspace for <strong>{domain}</strong></li>
            <li>Initiate the standard or ACME-enabled renewal process</li>
            <li>Install new certificate PEM chains on your target server hosting environments</li>
            <li>Verify correct propagation with: <code style="background-color: #f1f5f9; padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 12px;">openssl s_client -connect {domain}:443</code></li>
          </ol>
        </div>
        
        <div class="footer">
          Generated automatically by <strong>CertGuard AI Monitoring System</strong><br>
          Powered by Groq + Llama3 | {now_ist}<br>
          <em>This is a high-priority automated administrative alert. Do not reply.</em>
        </div>
      </div>
    </body>
    </html>
    """
    
    res = send_mail_via_smtp(recipient, subject, html_body, cc_recipient)
    
    timestamp = datetime.now().isoformat()
    if res["sent"]:
        return {
            "sent": True,
            "message": f"Alert email sent to {recipient}",
            "timestamp": timestamp
        }
    else:
        return {
            "sent": False,
            "message": f"SMTP Dispatch Outage: {res['error']}",
            "timestamp": timestamp
        }

# ────────────────────────────────────────
# FUNCTION 2: send_renewal_email
# ────────────────────────────────────────
def send_renewal_email(domain_data: dict, ai_email_content: str) -> dict:
    domain = clean_value(domain_data, "domain", "domain")
    days_remaining = clean_value(domain_data, "daysRemaining", "days_remaining")
    expiry_date = clean_value(domain_data, "expiryDate", "expiry_date")
    issuer = clean_value(domain_data, "issuer", "issuer")
    ssl_grade = clean_value(domain_data, "sslGrade", "ssl_grade")
    
    recipient = domain_data.get("recipient", RECEIVER_EMAIL)
    cc_recipient = domain_data.get("cc_recipient", CC_EMAIL)
    
    # Subject: 📋 SSL Renewal Required — {domain} — {days} days until expiry
    subject = f"📋 SSL Renewal Required — {domain} — {days_remaining} days until expiry"
    
    now_ist = datetime.now().strftime("%Y-%m-%d %H:%M:%S") + " IST"
    
    # Escape safe html of AI email content
    escaped_ai_content = ai_email_content.replace("<", "&lt;").replace(">", "&gt;")
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 24px;
          color: #1e293b;
        }}
        .email-container {{
          max-width: 650px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }}
        .header-bar {{
          background-color: #F5A500;
          color: #ffffff;
          padding: 20px 32px;
          overflow: hidden;
        }}
        .header-left {{
          float: left;
          font-weight: bold;
          font-size: 18px;
        }}
        .header-right {{
          float: right;
          font-size: 13px;
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 1px;
          opacity: 0.9;
          margin-top: 3px;
        }}
        .content {{
          padding: 32px;
          clear: both;
        }}
        .section-title {{
          font-size: 15px;
          font-weight: bold;
          color: #0f172a;
          margin-top: 24px;
          margin-bottom: 12px;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 6px;
        }}
        .summary-card {{
          border-left: 4px solid #F5A500;
          background-color: #fffbeb;
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 24px;
        }}
        .details-table {{
          width: 100%;
          border-collapse: collapse;
        }}
        .details-table td, .details-table th {{
          padding: 10px 14px;
          text-align: left;
          font-size: 13px;
        }}
        .details-table th {{
          color: #854d0e;
          font-weight: 600;
          width: 30%;
        }}
        .details-table td {{
          color: #451a03;
        }}
        .ai-content {{
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          white-space: pre-wrap;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 12px;
          color: #334155;
          line-height: 1.6;
          margin-bottom: 24px;
        }}
        .commands-box {{
          background-color: #1A1A1A;
          border-radius: 8px;
          padding: 20px;
          color: #ffffff;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          line-height: 1.6;
          margin-bottom: 24px;
        }}
        .commands-title {{
          color: #F5A500;
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 12px;
          font-family: -apple-system, BlinkMacSystemFont, inherit;
        }}
        .command-line {{
          margin-bottom: 10px;
        }}
        .command-comment {{
          color: #888888;
        }}
        .checklist-item {{
          display: block;
          margin-bottom: 10px;
          font-size: 13px;
          color: #334155;
        }}
        .checklist-box {{
          display: inline-block;
          width: 15px;
          font-size: 15px;
          font-weight: bold;
          margin-right: 8px;
          color: #94a3b8;
          font-family: monospace;
        }}
        .footer {{
          background-color: #f1f5f9;
          padding: 24px;
          text-align: center;
          font-size: 11px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
          line-height: 1.6;
          clear: both;
        }}
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header-bar">
          <div class="header-left">🛡️ CertGuard AI</div>
          <div class="header-right">Renewal Notification</div>
        </div>
        <div class="content">
          
          <div class="section-title">Section 1 — Certificate Summary</div>
          <div class="summary-card">
            <table class="details-table">
              <tr>
                <th>Domain</th>
                <td><strong>{domain}</strong></td>
              </tr>
              <tr>
                <th>Days Remaining</th>
                <td><strong>{days_remaining} days</strong></td>
              </tr>
              <tr>
                <th>Expiry Date</th>
                <td>{expiry_date}</td>
              </tr>
              <tr>
                <th>Issuer</th>
                <td>{issuer}</td>
              </tr>
              <tr>
                <th>SSL Grade</th>
                <td><span style="background-color: #F5A500; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">{ssl_grade}</span></td>
              </tr>
            </table>
          </div>
          
          <div class="section-title">Section 2 — AI-Recommended Renewal Steps</div>
          <div class="ai-content">{escaped_ai_content}</div>
          
          <div class="section-title">Section 3 — Quick Verification Commands</div>
          <div class="commands-box">
            <div class="commands-title">Verification Commands</div>
            
            <div class="command-line">
              <span class="command-comment"># Check current certificate attributes on remote host</span><br>
              <span style="color: #38bdf8;">openssl s_client -connect {domain}:443</span>
            </div>
            
            <div class="command-line">
              <span class="command-comment"># Check expiry date specifically</span><br>
              <span style="color: #38bdf8;">echo | openssl s_client -connect {domain}:443 2>/dev/null | openssl x509 -noout -dates</span>
            </div>
            
            <div class="command-line">
              <span class="command-comment"># Test after renewal propagation completes</span><br>
              <span style="color: #38bdf8;">curl -vI https://{domain} 2>&amp;1 | grep -i ssl</span>
            </div>
          </div>
          
          <div class="section-title">Section 4 — Renewal Operational Checklist</div>
          <div style="padding: 6px 0 16px 0;">
            <div class="checklist-item"><span class="checklist-box">&#9744;</span> Certificate renewed with certificate provider ({issuer})</div>
            <div class="checklist-item"><span class="checklist-box">&#9744;</span> New certificate installed and bound on active web server/LB endpoints</div>
            <div class="checklist-item"><span class="checklist-box">&#9744;</span> SSL TLS handshake grade checked and verified (Target: A or A+)</div>
            <div class="checklist-item"><span class="checklist-box">&#9744;</span> Public browser validation test successfully resolved</div>
            <div class="checklist-item"><span class="checklist-box">&#9744;</span> Monitoring alert cleared in CertGuard AI console logs</div>
          </div>
          
        </div>
        
        <div class="footer">
          Generated automatically by <strong>CertGuard AI Monitoring System</strong><br>
          Powered by Groq + Llama3 | {now_ist}<br>
          <em>This is a high-priority automated administrative alert. Do not reply.</em>
        </div>
      </div>
    </body>
    </html>
    """
    
    res = send_mail_via_smtp(recipient, subject, html_body, cc_recipient)
    
    timestamp = datetime.now().isoformat()
    if res["sent"]:
        return {
            "sent": True,
            "message": f"Alert email sent to {recipient}",
            "timestamp": timestamp
        }
    else:
        return {
            "sent": False,
            "message": f"SMTP Dispatch Outage: {res['error']}",
            "timestamp": timestamp
        }

# ────────────────────────────────────────
# FUNCTION 3: send_bulk_alert
# ────────────────────────────────────────
def send_bulk_alert(all_results: list) -> dict:
    at_risk_domains = []
    total_count = len(all_results)
    
    critical_count = 0
    high_count = 0
    
    most_severe_risk = "high"
    
    for item in all_results:
        risk = clean_value(item, "riskLevel", "risk_level", "low").lower()
        if risk in ["expired", "critical"]:
            critical_count += 1
            most_severe_risk = "critical"
            at_risk_domains.append(item)
        elif risk == "high":
            high_count += 1
            at_risk_domains.append(item)
            
    if not at_risk_domains:
        return {
            "sent": False,
            "message": "No critical domains — no alert needed",
            "timestamp": datetime.now().isoformat()
        }
        
    count = len(at_risk_domains)
    now_date = datetime.now().strftime("%Y-%m-%d")
    now_ist = datetime.now().strftime("%Y-%m-%d %H:%M:%S") + " IST"
    
    # Subject: 🚨 CertGuard AI — {count} Certificates Need Attention — Scan completed {date}
    subject = f"🚨 CertGuard AI — {count} Certificates Need Attention — Scan completed {now_date}"
    
    header_color = "#FF4444" if most_severe_risk == "critical" else "#FF8C00"
    header_title = "🚨 CRITICAL BULK VULNERABILITY REPORT" if most_severe_risk == "critical" else "⚠️ HIGH RISK BULK EXPOSURE ALERT"
    
    recipient = RECEIVER_EMAIL
    cc_recipient = CC_EMAIL
    
    table_rows = ""
    for r in at_risk_domains:
        domain = clean_value(r, "domain", "domain")
        risk = clean_value(r, "riskLevel", "risk_level", "high").upper()
        days = clean_value(r, "daysRemaining", "days_remaining", "0")
        
        row_bg = "#FFE8E8" if risk in ["EXPIRED", "CRITICAL"] else "#FFF3E0"
        action = "Renew Now" if risk in ["EXPIRED", "CRITICAL"] else "Renew Soon"
        badge_color = "#dc2626" if risk in ["EXPIRED", "CRITICAL"] else "#d97706"
        
        table_rows += f"""
        <tr style="background-color: {row_bg}; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 14px; font-family: monospace; font-weight: bold; color: #0f172a; font-size: 13px;">{domain}</td>
          <td style="padding: 12px 14px; font-size: 12px;">
            <span style="color: {badge_color}; font-weight: bold; text-transform: uppercase;">{risk}</span>
          </td>
          <td style="padding: 12px 14px; font-weight: bold; color: #1e293b; font-size: 13px;">{days} days</td>
          <td style="padding: 12px 14px; font-size: 12px;">
            <span style="background-color: {badge_color}; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-family: monospace;">{action}</span>
          </td>
        </tr>
        """
        
    dashboard_url = "https://ais-pre-vohqhzz6kzc25x3l2env2g-793300815622.asia-southeast1.run.app"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 24px;
          color: #1e293b;
        }}
        .email-container {{
          max-width: 650px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }}
        .header-bar {{
          background-color: {header_color};
          color: #ffffff;
          padding: 24px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }}
        .content {{
          padding: 32px;
        }}
        .summary-box {{
          background-color: #f8fafc;
          border-left: 4px solid #3b82f6;
          padding: 16px 20px;
          border-radius: 0 8px 8px 0;
          font-size: 14px;
          color: #334155;
          line-height: 1.6;
          margin-bottom: 24px;
        }}
        .priority-table {{
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }}
        .priority-table th {{
          background-color: #f1f5f9;
          color: #475569;
          font-weight: bold;
          padding: 12px 14px;
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e2e8f0;
        }}
        .button-container {{
          text-align: center;
          margin-bottom: 12px;
        }}
        .action-btn {{
          display: inline-block;
          background-color: #F5A500;
          color: #000000 !important;
          text-decoration: none;
          font-weight: 800;
          font-family: inherit;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 14px 28px;
          border-radius: 8px;
          transition: background-color 0.2s;
          box-shadow: 0 4px 6px -1px rgba(245, 165, 0, 0.2);
        }}
        .footer {{
          background-color: #f1f5f9;
          padding: 24px;
          text-align: center;
          font-size: 11px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
          line-height: 1.6;
        }}
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header-bar">
          {header_title}
        </div>
        <div class="content">
          
          <div class="summary-box">
            CertGuard AI completed an automated scan of <strong>{total_count}</strong> registry hostnames. 
            A total of <strong>{critical_count} CRITICAL</strong> and <strong>{high_count} HIGH</strong> risk active certificate exposures were flagged during the sweeping validation process.
          </div>
          
          <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: bold;">Priority Mitigation Ledger</h4>
          <table class="priority-table">
            <thead>
              <tr>
                <th>Domain Name</th>
                <th>Risk Matrix</th>
                <th>Days Till Expiration</th>
                <th>Action Recommended</th>
              </tr>
            </thead>
            <tbody>
              {table_rows}
            </tbody>
          </table>
          
          <div class="button-container">
            <a href="{dashboard_url}" class="action-btn">OPEN CERTGUARD AI DASHBOARD &rarr;</a>
          </div>
          
        </div>
        
        <div class="footer">
          Generated automatically by <strong>CertGuard AI Monitoring System</strong><br>
          Powered by Groq + Llama3 | {now_ist}<br>
          <em>This is a high-priority automated administrative alert. Do not reply.</em>
        </div>
      </div>
    </body>
    </html>
    """
    
    res = send_mail_via_smtp(recipient, subject, html_body, cc_recipient)
    
    timestamp = datetime.now().isoformat()
    domain_names = [clean_value(x, "domain", "domain") for x in at_risk_domains]
    if res["sent"]:
        return {
            "sent": True,
            "message": f"Bulk alert sent for {count} domains",
            "domains_alerted": domain_names,
            "timestamp": timestamp
        }
    else:
        return {
            "sent": False,
            "message": f"SMTP Dispatch Outage in Bulk dispatch: {res['error']}",
            "domains_alerted": domain_names,
            "timestamp": timestamp
        }

# ────────────────────────────────────────
# FUNCTION 4: test_email_connection
# ────────────────────────────────────────
def test_email_connection() -> dict:
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(SENDER_EMAIL, APP_PASSWORD)
        return {
            "connected": True,
            "message": "SMTP connection successful",
            "server": SMTP_SERVER,
            "port": SMTP_PORT,
            "sender": SENDER_EMAIL
        }
    except smtplib.SMTPAuthenticationError:
        return {
            "connected": False,
            "message": "Authentication failed. Check App Password.",
            "fix": "Go to Google Account -> Security -> App Passwords"
        }
    except Exception as e:
        return {
            "connected": False,
            "message": f"SMTP Contact Interrupted: {str(e)}",
            "server": SMTP_SERVER,
            "port": SMTP_PORT
        }

# ==========================================
# CLI PARSER EXPOSING THE FUNCTIONS TO NODE
# ==========================================
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CertGuard Python SMTP Mail Service Helper Interface")
    parser.add_argument("--action", required=True, choices=["test", "critical", "renewal", "bulk"], help="Mail action execution key")
    parser.add_argument("--data", type=str, help="JSON-serialized input payload for critical, renewal or bulk list actions")
    parser.add_argument("--ai-content", type=str, help="Plaintext generated by LLM for the renewal instruction pre box")
    
    args = parser.parse_args()
    
    result = {}
    
    if args.action == "test":
        result = test_email_connection()
    elif args.action == "critical":
        if not args.data:
            print(json.dumps({"sent": False, "message": "Missing --data argument JSON content"}), flush=True)
            sys.exit(1)
        try:
            domain_data = json.loads(args.data)
            result = send_critical_alert(domain_data)
        except Exception as err:
            result = {"sent": False, "message": f"Critical Action Parser Outage: {str(err)}"}
    elif args.action == "renewal":
        if not args.data or not args.ai_content:
            print(json.dumps({"sent": False, "message": "Missing --data or --ai-content argument details"}), flush=True)
            sys.exit(1)
        try:
            domain_data = json.loads(args.data)
            result = send_renewal_email(domain_data, args.ai_content)
        except Exception as err:
            result = {"sent": False, "message": f"Renewal Action Parser Outage: {str(err)}"}
    elif args.action == "bulk":
        if not args.data:
            print(json.dumps({"sent": False, "message": "Missing --data JSON list argument payload"}), flush=True)
            sys.exit(1)
        try:
            all_results = json.loads(args.data)
            result = send_bulk_alert(all_results)
        except Exception as err:
            result = {"sent": False, "message": f"Bulk Action Parser Outage: {str(err)}"}
            
    print(json.dumps(result), flush=True)
