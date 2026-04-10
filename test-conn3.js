import pg from 'pg';
const { Client } = pg;

async function test(user, host, port, dbname, password) {
  const client = new Client({
    user, host, port, database: dbname, password, ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log(`[SUCCESS] Connected to ${user}@${host}:${port}`);
    await client.end();
  } catch (e) {
    console.log(`[FAILED] ${user}@${host}:${port} - ${e.message}`);
  }
}

async function run() {
  const pwd = 'Cyber@Learn04';
  const host = 'db.mgkvfaeqisloebvdzddl.supabase.co';
  
  await test('postgres', host, 6543, 'postgres', pwd);
  await test('postgres.mgkvfaeqisloebvdzddl', host, 6543, 'postgres', pwd);
  await test('postgres', host, 5432, 'postgres', pwd);
}
run();
