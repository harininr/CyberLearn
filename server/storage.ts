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


export class SqliteStorage implements IStorage {
  // Prepared statements for better performance
  private stmts = {
    getUser: db.prepare('SELECT * FROM users WHERE id = ?'),
    getUserByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
    createUser: db.prepare(`
      INSERT INTO users (id, username, password, salt, role, isMfaEnabled, mfaSecret)
      VALUES (@id, @username, @password, @salt, @role, @isMfaEnabled, @mfaSecret)
    `),
    createLog: db.prepare(`
      INSERT INTO logs (id, userId, timestamp, module, action, details, result)
      VALUES (@id, @userId, @timestamp, @module, @action, @details, @result)
    `),
    getLogs: db.prepare('SELECT * FROM logs ORDER BY timestamp DESC'),
    getLogsByUser: db.prepare('SELECT * FROM logs WHERE userId = ? ORDER BY timestamp DESC'),
    getAllConversations: db.prepare('SELECT * FROM conversations ORDER BY createdAt DESC'),
    getConversation: db.prepare('SELECT * FROM conversations WHERE id = ?'),
    createConversation: db.prepare(`
      INSERT INTO conversations (id, title, createdAt)
      VALUES (@id, @title, @createdAt)
    `),
    getMessages: db.prepare('SELECT * FROM messages WHERE conversationId = ? ORDER BY createdAt ASC'),
    createMessage: db.prepare(`
      INSERT INTO messages (id, conversationId, role, content, createdAt)
      VALUES (@id, @conversationId, @role, @content, @createdAt)
    `),

    // ACM Simulation (Restructured)
    getAccessControlPolicies: db.prepare('SELECT * FROM access_control_policies'),
    createAccessControlPolicy: db.prepare(`
      INSERT INTO access_control_policies (role, resource, permission, allowed)
      VALUES (@role, @resource, @permission, @allowed)
    `),
    logAccessControlEvent: db.prepare(`
      INSERT INTO access_control_logs (timestamp, actor, action, resource, outcome, details)
      VALUES (@timestamp, @actor, @action, @resource, @outcome, @details)
    `),
    getAccessControlLogs: db.prepare('SELECT * FROM access_control_logs ORDER BY timestamp DESC LIMIT 50'),
    checkPermission: db.prepare(`
      SELECT allowed FROM access_control_policies 
      WHERE role = ? AND resource = ? AND permission = ?
    `),
    deleteAccessControlPolicy: db.prepare('DELETE FROM access_control_policies WHERE id = ?'),

    // Auth Simulation
    createAuthSimulationUser: db.prepare(`
      INSERT INTO auth_simulation_users (id, email, password, fullName, studentId, department, otpSecret, mfaEnabled, registered, registrationDate)
      VALUES (@id, @email, @password, @fullName, @studentId, @department, @otpSecret, @mfaEnabled, @registered, @registrationDate)
    `),
    getAuthSimulationUserByEmail: db.prepare('SELECT * FROM auth_simulation_users WHERE email = ?'),

    // Hashing Simulation
    createHashingSimulationUser: db.prepare(`
      INSERT INTO hashing_simulation_users (username, passwordHash, salt)
      VALUES (@username, @passwordHash, @salt)
    `),
    getHashingSimulationUsers: db.prepare('SELECT * FROM hashing_simulation_users'),

    // Simulation Activity
    logSimulationActivity: db.prepare(`
      INSERT INTO simulation_activity_logs (module, timestamp, action, details)
      VALUES (@module, @timestamp, @action, @details)
    `),
    getSimulationActivity: db.prepare('SELECT * FROM simulation_activity_logs WHERE module = ? ORDER BY timestamp DESC'),

    updateMfaSecret: db.prepare('UPDATE users SET mfaSecret = ? WHERE id = ?'),
    enableMfa: db.prepare('UPDATE users SET isMfaEnabled = 1 WHERE id = ?'),
  };


  constructor() {
    this.seedAccessPolicies();
  }

  private seedAccessPolicies() {
    const policies = this.stmts.getAccessControlPolicies.all();
    if (policies.length === 0) {
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

        // Guest Role (New for better sample)
        { role: "guest", resource: "course_materials", permission: "read", allowed: 1 },
        { role: "guest", resource: "assignments", permission: "read", allowed: 0 },
        { role: "guest", resource: "grades", permission: "read", allowed: 0 },

        // Security Resource (New for better sample)
        { role: "admin", resource: "security_logs", permission: "read", allowed: 1 },
        { role: "admin", resource: "security_logs", permission: "delete", allowed: 1 },
        { role: "faculty", resource: "security_logs", permission: "read", allowed: 1 },
        { role: "student", resource: "security_logs", permission: "read", allowed: 0 },
      ];

      initialPolicies.forEach(p => {
        this.stmts.createAccessControlPolicy.run({
          role: p.role,
          resource: p.resource,
          permission: p.permission,
          allowed: p.allowed
        });
      });
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
    const row = this.stmts.getUser.get(id);
    return this.mapUserFromDb(row);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const row = this.stmts.getUserByUsername.get(username);
    return this.mapUserFromDb(row);
  }

  async createUser(user: User): Promise<User> {
    this.stmts.createUser.run({
      id: user.id,
      username: user.username,
      password: user.password,
      salt: user.salt,
      role: user.role,
      isMfaEnabled: user.isMfaEnabled ? 1 : 0,
      mfaSecret: user.mfaSecret || null,
    });
    return user;
  }

  async updateMfaSecret(id: string, secret: string): Promise<void> {
    this.stmts.updateMfaSecret.run(secret, id);
  }

  async enableMfa(id: string): Promise<void> {
    this.stmts.enableMfa.run(id);
  }

  async createLog(log: Log): Promise<Log> {
    this.stmts.createLog.run({
      id: log.id,
      userId: log.userId || null,
      timestamp: log.timestamp,
      module: log.module,
      action: log.action,
      details: log.details,
      result: log.result,
    });
    return log;
  }

  async getLogs(userId?: string): Promise<Log[]> {
    if (userId) {
      return this.stmts.getLogsByUser.all(userId) as Log[];
    }
    return this.stmts.getLogs.all() as Log[];
  }

  async getAllConversations(): Promise<Conversation[]> {
    return this.stmts.getAllConversations.all() as Conversation[];
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const row = this.stmts.getConversation.get(id);
    return row as Conversation | undefined;
  }

  async createConversation(conversation: Conversation): Promise<Conversation> {
    this.stmts.createConversation.run({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
    });
    return conversation;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.stmts.getMessages.all(conversationId) as Message[];
  }

  async createMessage(message: Message): Promise<Message> {
    this.stmts.createMessage.run({
      id: message.id,
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
    });
    return message;
  }

  // ACM Simulation
  async getAccessControlPolicies(): Promise<AccessControlPolicy[]> {
    return this.stmts.getAccessControlPolicies.all().map((p: any) => ({
      ...p,
      allowed: Boolean(p.allowed)
    })) as AccessControlPolicy[];
  }

  async createAccessControlPolicy(policy: AccessControlPolicy): Promise<AccessControlPolicy> {
    const res = this.stmts.createAccessControlPolicy.run({
      role: policy.role,
      resource: policy.resource,
      permission: policy.permission,
      allowed: policy.allowed ? 1 : 0
    });
    return { ...policy, id: Number(res.lastInsertRowid) };
  }

  async logAccessControlEvent(log: AccessControlLog): Promise<AccessControlLog> {
    const res = this.stmts.logAccessControlEvent.run({
      timestamp: log.timestamp,
      actor: log.actor,
      action: log.action,
      resource: log.resource,
      outcome: log.outcome,
      details: log.details || null
    });
    return { ...log, id: Number(res.lastInsertRowid) };
  }

  async getAccessControlLogs(): Promise<AccessControlLog[]> {
    return this.stmts.getAccessControlLogs.all() as AccessControlLog[];
  }

  async checkPermission(role: string, resource: string, permission: string): Promise<boolean> {
    const row = this.stmts.checkPermission.get(role, resource, permission) as { allowed: number } | undefined;
    return row ? Boolean(row.allowed) : false;
  }

  async deleteAccessControlPolicy(id: number): Promise<boolean> {
    const res = this.stmts.deleteAccessControlPolicy.run(id);
    return res.changes > 0;
  }

  // Auth Simulation
  async createAuthSimulationUser(user: AuthSimulationUser): Promise<AuthSimulationUser> {
    this.stmts.createAuthSimulationUser.run({
      id: user.id,
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      studentId: user.studentId,
      department: user.department,
      otpSecret: user.otpSecret,
      mfaEnabled: user.mfaEnabled ? 1 : 0,
      registered: user.registered ? 1 : 0,
      registrationDate: user.registrationDate
    });
    return user;
  }


  async getAuthSimulationUserByEmail(email: string): Promise<AuthSimulationUser | undefined> {
    const row = this.stmts.getAuthSimulationUserByEmail.get(email);
    if (!row) return undefined;
    return {
      ...row,
      mfaEnabled: Boolean(row.mfaEnabled),
      registered: Boolean(row.registered)
    } as AuthSimulationUser;
  }

  // Hashing Simulation
  async createHashingSimulationUser(user: InsertHashingSimulationUser): Promise<HashingSimulationUser> {
    const res = this.stmts.createHashingSimulationUser.run(user);
    return { ...user, id: Number(res.lastInsertRowid) } as HashingSimulationUser;
  }

  async getHashingSimulationUsers(): Promise<HashingSimulationUser[]> {
    return this.stmts.getHashingSimulationUsers.all() as HashingSimulationUser[];
  }

  // Simulation Activity
  async logSimulationActivity(activity: Omit<SimulationActivityLog, "id">): Promise<SimulationActivityLog> {
    const res = this.stmts.logSimulationActivity.run(activity);
    return { ...activity, id: Number(res.lastInsertRowid) } as SimulationActivityLog;
  }

  async getSimulationActivity(module: string): Promise<SimulationActivityLog[]> {
    return this.stmts.getSimulationActivity.all(module) as SimulationActivityLog[];
  }

} // End of SqliteStorage

export const storage = new SqliteStorage();
