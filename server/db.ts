/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { ScanResult, DashboardSession, IncidentTicket, MailAlert, UserAccount } from "../src/types.js";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "certguard.json");

interface DatabaseSchema {
  scans: ScanResult[];
  sessions: DashboardSession[];
  tickets: IncidentTicket[];
  mails: MailAlert[];
  users: UserAccount[];
}

const defaultSchema: DatabaseSchema = {
  scans: [],
  sessions: [],
  tickets: [],
  mails: [],
  users: [
    {
      id: "usr-1",
      username: "harinisivanathanvs",
      email: "harinisivanathanvs@gmail.com",
      role: "CISO"
    }
  ]
};

// Ensure database file and directory exist
export function initDb(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultSchema, null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

// Read database
function readDb(): DatabaseSchema {
  initDb();
  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error("Failed to read database, resetting:", error);
    return defaultSchema;
  }
}

// Write database
function writeDb(data: DatabaseSchema): void {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to database:", error);
  }
}

export function saveScanResults(results: ScanResult[]): void {
  const db = readDb();
  // Prepend new results, keeping only unique domains in latest state by domain,
  // or simple appending as historical log. Let's append but if a scan for a domain exists,
  // we can also replace or keep both. Let's keep a full scan log!
  db.scans = [...results, ...db.scans].slice(0, 500); // Keep last 500 scans
  writeDb(db);
}

export function saveSession(session: DashboardSession): void {
  const db = readDb();
  db.sessions = [session, ...db.sessions].slice(0, 50); // Keep last 50 sessions
  writeDb(db);
}

export function saveTicket(ticket: IncidentTicket): void {
  const db = readDb();
  db.tickets = [ticket, ...db.tickets].slice(0, 100); // Keep last 100 tickets
  writeDb(db);
}

export function getScanHistory(): ScanResult[] {
  return readDb().scans;
}

export function getRecentSessions(): DashboardSession[] {
  return readDb().sessions;
}

export function getTickets(): IncidentTicket[] {
  return readDb().tickets;
}

export function saveMailAlert(mail: MailAlert): void {
  const db = readDb();
  if (!db.mails) db.mails = [];
  db.mails = [mail, ...db.mails].slice(0, 200);
  writeDb(db);
}

export function getMailHistory(): MailAlert[] {
  const db = readDb();
  return db.mails || [];
}

export function saveUserAccount(user: UserAccount): void {
  const db = readDb();
  if (!db.users) db.users = [];
  db.users = [user, ...db.users.filter(u => u.username !== user.username)];
  writeDb(db);
}

export function getUsers(): UserAccount[] {
  const db = readDb();
  return db.users || [];
}

export function clearHistory(): void {
  const db = readDb();
  db.scans = [];
  db.sessions = [];
  writeDb(db);
}

export function clearTickets(): void {
  const db = readDb();
  db.tickets = [];
  writeDb(db);
}

export function getDbStats() {
  const db = readDb();
  return {
    totalScans: db.scans.length,
    totalSessions: db.sessions.length,
    totalTickets: db.tickets.length,
    totalMails: db.mails ? db.mails.length : 0,
    oldestScan: db.scans.length > 0 ? db.scans[db.scans.length - 1].scanTimestamp : null
  };
}
