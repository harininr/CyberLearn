// Minimal db.ts to satisfy imports if any, but we are using JSON storage.
// This ensures that if any legacy code tries to import db, it doesn't crash immediately,
// although it won't work for Drizzle operations.

export const db = {} as any;
export const pool = {} as any;
