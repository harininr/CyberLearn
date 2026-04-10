import pkg from 'pg';
const { Pool } = pkg;

const connectionString = "postgresql://postgres:Cyber@Learn04@db.mgkvfaeqisloebvdzddl.supabase.co:5432/postgres";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function test() {
  try {
    const client = await pool.connect();
    console.log("Connected successfully with raw string!");
    client.release();
  } catch (err) {
    console.error("Failed with raw string:", err.message);
  } finally {
    await pool.end();
  }
}

test();
