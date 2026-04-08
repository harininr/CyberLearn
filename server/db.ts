import Database from 'better-sqlite3';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'cyberease.db');

// Create database connection
export const db = new Database(DB_FILE);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

// Initialize database schema
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Student', 'Instructor', 'Admin')),
      isMfaEnabled INTEGER DEFAULT 0,
      mfaSecret TEXT
    )
  `);

  // Logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      userId TEXT,
      timestamp TEXT NOT NULL,
      module TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      result TEXT NOT NULL
    )
  `);

  // Conversations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversationId TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (conversationId) REFERENCES conversations(id)
    )
  `);

  // Create indexes for better query performance
  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_logs_userId ON logs(userId)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_messages_conversationId ON messages(conversationId)`);

  // Access Control Policies table
  db.exec(`
    CREATE TABLE IF NOT EXISTS access_control_policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      resource TEXT NOT NULL,
      permission TEXT NOT NULL,
      allowed INTEGER DEFAULT 1
    )
    `);

  // Access Control Logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS access_control_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      outcome TEXT NOT NULL,
      details TEXT
    )
    `);

  // Auth Simulation Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS auth_simulation_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fullName TEXT NOT NULL,
      studentId TEXT NOT NULL,
      department TEXT NOT NULL,
      otpSecret TEXT NOT NULL,
      mfaEnabled INTEGER DEFAULT 1,
      registered INTEGER DEFAULT 1,
      registrationDate TEXT NOT NULL
    )
  `);

  // Hashing Simulation Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS hashing_simulation_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      salt TEXT NOT NULL
    )
  `);

  // Simulation Activity Logs (for Crypto, DS, etc.)
  db.exec(`
    CREATE TABLE IF NOT EXISTS simulation_activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT NOT NULL
    )
  `);

  // Index for policies
  db.exec(`CREATE INDEX IF NOT EXISTS idx_policies_role ON access_control_policies(role)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sim_logs_module ON simulation_activity_logs(module)`);


  console.log('[database] SQLite database initialized');
}

// Initialize on import
initializeDatabase();
