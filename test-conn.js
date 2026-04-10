import pg from 'pg';
const { Client } = pg;

async function test(username, host, port, password) {
  const client = new Client({
    user: username,
    host: host,
    database: 'postgres',
    password: password,
    port: port,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`Success with ${username}@${host}:${port}`);
    await client.end();
  } catch(e) {
    console.log(`Failed with ${username}@${host}:${port}: ${e.message}`);
  }
}

async function run() {
  await test('postgres.mgkvfaeqisloebvdzddl', 'db.mgkvfaeqisloebvdzddl.supabase.co', 6543, 'Cyber@Learn04');
  await test('postgres.mgkvfaeqisloebvdzddl', 'aws-0-ap-south-1.pooler.supabase.com', 6543, 'Cyber@Learn04');
  await test('postgres', 'db.mgkvfaeqisloebvdzddl.supabase.co', 6543, 'Cyber@Learn04');
}

run();
