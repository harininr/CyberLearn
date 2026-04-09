import {
  User, Log, Conversation, Message,
  AccessControlPolicy, AccessControlLog,
  AuthSimulationUser, HashingSimulationUser, SimulationActivityLog,
  InsertAuthSimulationUser, InsertHashingSimulationUser
} from "../shared/schema.js";

import { db } from "./db.js";

export interface IStorage {
  // User
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: User): Promise<User>;

  // Logs
  createLog(log: Log): Promise<Log>;
  getLogs(userId?: string): Promise<Log[]>;

  // Chat
  getAllConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: Conversation): Promise<Conversation>;
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: Message): Promise<Message>;

  // Access Control Simulation
  getAccessControlPolicies(): Promise<AccessControlPolicy[]>;
  createAccessControlPolicy(policy: AccessControlPolicy): Promise<AccessControlPolicy>;
  logAccessControlEvent(log: AccessControlLog): Promise<AccessControlLog>;
  getAccessControlLogs(): Promise<AccessControlLog[]>;
  checkPermission(role: string, resource: string, permission: string): Promise<boolean>;
  deleteAccessControlPolicy(id: number): Promise<boolean>;

  // Auth Simulation
  createAuthSimulationUser(user: AuthSimulationUser): Promise<AuthSimulationUser>;
  getAuthSimulationUserByEmail(email: string): Promise<AuthSimulationUser | undefined>;

  // Hashing Simulation
  createHashingSimulationUser(user: InsertHashingSimulationUser): Promise<HashingSimulationUser>;
  getHashingSimulationUsers(): Promise<HashingSimulationUser[]>;

  // Generic Simulation Activity
  logSimulationActivity(activity: Omit<SimulationActivityLog, "id">): Promise<SimulationActivityLog>;
  getSimulationActivity(module: string): Promise<SimulationActivityLog[]>;

  // MFA
  updateMfaSecret(id: string, secret: string): Promise<void>;
  enableMfa(id: string): Promise<void>;
}


export class PostgresStorage implements IStorage {
  constructor() {
    this.seedAccessPolicies().catch(err => {
      console.error('[database] Failed to seed access policies:', err.message);
    });
  }

  private async seedAccessPolicies() {
    const res = await db.query('SELECT * FROM access_control_policies');
    if (res.rows.length === 0) {
      const initialPolicies = [
        // Student
        { role: "student", resource: "course_materials", permission: "read", allowed: 1 },
        { role: "student", resource: "course_materials", permission: "download", allowed: 1 },
        { role: "student", resource: "assignments", permission: "read", allowed: 1 },
        { role: "student", resource: "assignments", permission: "submit", allowed: 1 },
        { role: "student", resource: "grades", permission: "read", allowed: 1 },

        // Faculty
        { role: "faculty", resource: "course_materials", permission: "read", allowed: 1 },
        { role: "faculty", resource: "course_materials", permission: "write", allowed: 1 },
        { role: "faculty", resource: "course_materials", permission: "upload", allowed: 1 },
        { role: "faculty", resource: "course_materials", permission: "delete", allowed: 1 },
        { role: "faculty", resource: "assignments", permission: "read", allowed: 1 },
        { role: "faculty", resource: "assignments", permission: "write", allowed: 1 },
        { role: "faculty", resource: "assignments", permission: "grade", allowed: 1 },
        { role: "faculty", resource: "assignments", permission: "delete", allowed: 1 },
        { role: "faculty", resource: "grades", permission: "read", allowed: 1 },
        { role: "faculty", resource: "grades", permission: "write", allowed: 1 },
        { role: "faculty", resource: "grades", permission: "manage", allowed: 1 },
        { role: "faculty", resource: "user_database", permission: "read", allowed: 1 },

        // Admin
        { role: "admin", resource: "course_materials", permission: "read", allowed: 1 },
        { role: "admin", resource: "course_materials", permission: "write", allowed: 1 },
        { role: "admin", resource: "course_materials", permission: "upload", allowed: 1 },
        { role: "admin", resource: "course_materials", permission: "delete", allowed: 1 },
        { role: "admin", resource: "assignments", permission: "read", allowed: 1 },
        { role: "admin", resource: "assignments", permission: "write", allowed: 1 },
        { role: "admin", resource: "assignments", permission: "grade", allowed: 1 },
        { role: "admin", resource: "assignments", permission: "delete", allowed: 1 },
        { role: "admin", resource: "grades", permission: "read", allowed: 1 },
        { role: "admin", resource: "grades", permission: "write", allowed: 1 },
        { role: "admin", resource: "grades", permission: "manage", allowed: 1 },
        { role: "admin", resource: "user_database", permission: "read", allowed: 1 },
        { role: "admin", resource: "user_database", permission: "write", allowed: 1 },
        { role: "admin", resource: "user_database", permission: "manage", allowed: 1 },
        { role: "admin", resource: "user_database", permission: "delete", allowed: 1 },
        { role: "admin", resource: "system_settings", permission: "read", allowed: 1 },
        { role: "admin", resource: "system_settings", permission: "write", allowed: 1 },
        { role: "admin", resource: "system_settings", permission: "manage", allowed: 1 },

        // Guest Role
        { role: "guest", resource: "course_materials", permission: "read", allowed: 1 },
        { role: "guest", resource: "assignments", permission: "read", allowed: 0 },
        { role: "guest", resource: "grades", permission: "read", allowed: 0 },

        // Security Resource
        { role: "admin", resource: "security_logs", permission: "read", allowed: 1 },
        { role: "admin", resource: "security_logs", permission: "delete", allowed: 1 },
        { role: "faculty", resource: "security_logs", permission: "read", allowed: 1 },
        { role: "student", resource: "security_logs", permission: "read", allowed: 0 },
      ];

      for (const p of initialPolicies) {
        await db.query(
          'INSERT INTO access_control_policies (role, resource, permission, allowed) VALUES ($1, $2, $3, $4)',
          [p.role, p.resource, p.permission, p.allowed]
        );
      }
      console.log("[database] seeded enhanced access policies");
    }
  }

  private mapUserFromDb(row: any): User | undefined {
    if (!row) return undefined;
    return {
      ...row,
      isMfaEnabled: Boolean(row.isMfaEnabled),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return this.mapUserFromDb(res.rows[0]);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const res = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return this.mapUserFromDb(res.rows[0]);
  }

  async createUser(user: User): Promise<User> {
    await db.query(`
      INSERT INTO users (id, username, password, salt, role, "isMfaEnabled", "mfaSecret")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [user.id, user.username, user.password, user.salt, user.role, user.isMfaEnabled ? 1 : 0, user.mfaSecret || null]);
    return user;
  }

  async updateMfaSecret(id: string, secret: string): Promise<void> {
    await db.query('UPDATE users SET "mfaSecret" = $1 WHERE id = $2', [secret, id]);
  }

  async enableMfa(id: string): Promise<void> {
    await db.query('UPDATE users SET "isMfaEnabled" = 1 WHERE id = $2', [id]);
  }

  async createLog(log: Log): Promise<Log> {
    await db.query(`
      INSERT INTO logs (id, "userId", timestamp, module, action, details, result)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [log.id, log.userId || null, log.timestamp, log.module, log.action, log.details, log.result]);
    return log;
  }

  async getLogs(userId?: string): Promise<Log[]> {
    if (userId) {
      const res = await db.query('SELECT * FROM logs WHERE "userId" = $1 ORDER BY timestamp DESC', [userId]);
      return res.rows as Log[];
    }
    const res = await db.query('SELECT * FROM logs ORDER BY timestamp DESC');
    return res.rows as Log[];
  }

  async getAllConversations(): Promise<Conversation[]> {
    const res = await db.query('SELECT * FROM conversations ORDER BY "createdAt" DESC');
    return res.rows as Conversation[];
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const res = await db.query('SELECT * FROM conversations WHERE id = $1', [id]);
    return res.rows[0] as Conversation | undefined;
  }

  async createConversation(conversation: Conversation): Promise<Conversation> {
    await db.query(`
      INSERT INTO conversations (id, title, "createdAt")
      VALUES ($1, $2, $3)
    `, [conversation.id, conversation.title, conversation.createdAt]);
    return conversation;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await db.query('SELECT * FROM messages WHERE "conversationId" = $1 ORDER BY "createdAt" ASC', [conversationId]);
    return res.rows as Message[];
  }

  async createMessage(message: Message): Promise<Message> {
    await db.query(`
      INSERT INTO messages (id, "conversationId", role, content, "createdAt")
      VALUES ($1, $2, $3, $4, $5)
    `, [message.id, message.conversationId, message.role, message.content, message.createdAt]);
    return message;
  }

  async getAccessControlPolicies(): Promise<AccessControlPolicy[]> {
    const res = await db.query('SELECT * FROM access_control_policies');
    return res.rows.map((p: any) => ({
      ...p,
      allowed: Boolean(p.allowed)
    })) as AccessControlPolicy[];
  }

  async createAccessControlPolicy(policy: AccessControlPolicy): Promise<AccessControlPolicy> {
    const res = await db.query(`
      INSERT INTO access_control_policies (role, resource, permission, allowed)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [policy.role, policy.resource, policy.permission, policy.allowed ? 1 : 0]);
    return { ...policy, id: res.rows[0].id };
  }

  async logAccessControlEvent(log: AccessControlLog): Promise<AccessControlLog> {
    const res = await db.query(`
      INSERT INTO access_control_logs (timestamp, actor, action, resource, outcome, details)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [log.timestamp, log.actor, log.action, log.resource, log.outcome, log.details || null]);
    return { ...log, id: res.rows[0].id };
  }

  async getAccessControlLogs(): Promise<AccessControlLog[]> {
    const res = await db.query('SELECT * FROM access_control_logs ORDER BY timestamp DESC LIMIT 50');
    return res.rows as AccessControlLog[];
  }

  async checkPermission(role: string, resource: string, permission: string): Promise<boolean> {
    const res = await db.query(`
      SELECT allowed FROM access_control_policies 
      WHERE role = $1 AND resource = $2 AND permission = $3
    `, [role, resource, permission]);
    return res.rows[0] ? Boolean(res.rows[0].allowed) : false;
  }

  async deleteAccessControlPolicy(id: number): Promise<boolean> {
    const res = await db.query('DELETE FROM access_control_policies WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async createAuthSimulationUser(user: AuthSimulationUser): Promise<AuthSimulationUser> {
    await db.query(`
      INSERT INTO auth_simulation_users (id, email, password, "fullName", "studentId", department, "otpSecret", "mfaEnabled", registered, "registrationDate")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [user.id, user.email, user.password, user.fullName, user.studentId, user.department, user.otpSecret, user.mfaEnabled ? 1 : 0, user.registered ? 1 : 0, user.registrationDate]);
    return user;
  }


  async getAuthSimulationUserByEmail(email: string): Promise<AuthSimulationUser | undefined> {
    const res = await db.query('SELECT * FROM auth_simulation_users WHERE email = $1', [email]);
    const row = res.rows[0];
    if (!row) return undefined;
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      fullName: row.fullName,
      studentId: row.studentId,
      department: row.department,
      otpSecret: row.otpSecret,
      mfaEnabled: Boolean(row.mfaEnabled),
      registered: Boolean(row.registered),
      registrationDate: row.registrationDate
    };
  }

  async createHashingSimulationUser(user: InsertHashingSimulationUser): Promise<HashingSimulationUser> {
    const res = await db.query(`
      INSERT INTO hashing_simulation_users (username, "passwordHash", salt)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [user.username, user.passwordHash, user.salt]);
    return { ...user, id: res.rows[0].id } as HashingSimulationUser;
  }

  async getHashingSimulationUsers(): Promise<HashingSimulationUser[]> {
    const res = await db.query('SELECT * FROM hashing_simulation_users');
    return res.rows as HashingSimulationUser[];
  }

  async logSimulationActivity(activity: Omit<SimulationActivityLog, "id">): Promise<SimulationActivityLog> {
    const res = await db.query(`
      INSERT INTO simulation_activity_logs (module, timestamp, action, details)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [activity.module, activity.timestamp, activity.action, activity.details]);
    return { ...activity, id: res.rows[0].id } as SimulationActivityLog;
  }

  async getSimulationActivity(module: string): Promise<SimulationActivityLog[]> {
    const res = await db.query('SELECT * FROM simulation_activity_logs WHERE module = $1 ORDER BY timestamp DESC', [module]);
    return res.rows as SimulationActivityLog[];
  }

}

export const storage = new PostgresStorage();
