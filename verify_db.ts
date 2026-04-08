
import Database from 'better-sqlite3';

const db = new Database('sqlite.db');

const tables = [
    'users',
    'access_control_policies',
    'access_control_logs',
    'auth_simulation_users',
    'hashing_simulation_users',
    'simulation_activity_logs'
];

console.log('--- Database Verification ---');

tables.forEach(table => {
    try {
        const info = db.prepare(`PRAGMA table_info(${table})`).all();
        if (info.length > 0) {
            console.log(`[PASS] Table "${table}" exists.`);
            // console.log(JSON.stringify(info, null, 2));
        } else {
            console.log(`[FAIL] Table "${table}" does not exist.`);
        }
    } catch (e: any) {
        console.log(`[ERROR] Table "${table}" error: ${e.message}`);
    }
});

console.log('--- End Verification ---');
db.close();
