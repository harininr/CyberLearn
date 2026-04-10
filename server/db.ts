import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cyberease';

if (!process.env.DATABASE_URL) {
  console.warn('[database] WARNING: DATABASE_URL environment variable is not set. Falling back to local default.');
}

export const db = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

db.on('error', (err) => {
  console.error('[database] Unexpected error on idle client:', err.message);
});

// Initialize database schema
export async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn('[database] Skipping initialization: DATABASE_URL not set');
    return;
  }
  
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        salt TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('Student', 'Instructor', 'Admin')),
        "isMfaEnabled" INTEGER DEFAULT 0,
        "mfaSecret" TEXT
      )
    `);

    // Logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        "userId" TEXT,
        timestamp TEXT NOT NULL,
        module TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        result TEXT NOT NULL
      )
    `);

    // Conversations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        "createdAt" TEXT NOT NULL
      )
    `);

    // Messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        "conversationId" TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        "createdAt" TEXT NOT NULL,
        FOREIGN KEY ("conversationId") REFERENCES conversations(id)
      )
    `);

    // Access Control Policies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS access_control_policies (
        id SERIAL PRIMARY KEY,
        role TEXT NOT NULL,
        resource TEXT NOT NULL,
        permission TEXT NOT NULL,
        allowed INTEGER DEFAULT 1
      )
    `);

    // Access Control Logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS access_control_logs (
        id SERIAL PRIMARY KEY,
        timestamp TEXT NOT NULL,
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        outcome TEXT NOT NULL,
        details TEXT
      )
    `);

    // Auth Simulation Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth_simulation_users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        "studentId" TEXT NOT NULL,
        department TEXT NOT NULL,
        "otpSecret" TEXT NOT NULL,
        "mfaEnabled" INTEGER DEFAULT 1,
        registered INTEGER DEFAULT 1,
        "registrationDate" TEXT NOT NULL
      )
    `);

    // Hashing Simulation Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS hashing_simulation_users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        "passwordHash" TEXT NOT NULL,
        salt TEXT NOT NULL
      )
    `);

    // Simulation Activity Logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS simulation_activity_logs (
        id SERIAL PRIMARY KEY,
        module TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL
      )
    `);

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_logs_userId ON logs("userId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_conversationId ON messages("conversationId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_policies_role ON access_control_policies(role)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sim_logs_module ON simulation_activity_logs(module)`);

    await client.query('COMMIT');
    console.log('[database] PostgreSQL database initialized');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[database] Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}
