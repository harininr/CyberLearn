import "dotenv/config";
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;
console.log("Connecting to:", connectionString?.split('@')[1]); // Log host only for safety

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
});

async function test() {
  try {
    const client = await pool.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log("Query result:", res.rows[0]);
    client.release();
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await pool.end();
  }
}

test();
