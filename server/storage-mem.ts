import {
  User, Log, Conversation, Message,
  AccessControlPolicy, AccessControlLog,
  AuthSimulationUser, HashingSimulationUser, SimulationActivityLog,
  InsertHashingSimulationUser
} from "../shared/schema.js";
import { IStorage } from "./storage-types.js";
import fs from "fs";
import path from "path";

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private logs: Log[];
  private conversations: Map<string, Conversation>;
  private messages: Message[];
  private policies: AccessControlPolicy[];
  private accessLogs: AccessControlLog[];
  private authSimUsers: Map<string, AuthSimulationUser>;
  private hashingUsers: HashingSimulationUser[];
  private activityLogs: SimulationActivityLog[];

  constructor() {
    this.users = new Map();
    this.logs = [];
    this.conversations = new Map();
    this.messages = [];
    this.policies = [];
    this.accessLogs = [];
    this.authSimUsers = new Map();
    this.hashingUsers = [];
    this.activityLogs = [];

    this.loadData();
    if (this.policies.length === 0) {
      this.seedAccessPolicies();
    }
  }

  private loadData() {
    try {
      const dataPath = path.resolve(process.cwd(), "data.json");
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        if (data.users) data.users.forEach((u: User) => this.users.set(u.id, u));
        if (data.logs) this.logs = data.logs;
        if (data.conversations) data.conversations.forEach((c: Conversation) => this.conversations.set(c.id, c));
        if (data.messages) this.messages = data.messages;
        if (data.access_control_policies) this.policies = data.access_control_policies;
        if (data.access_control_logs) this.accessLogs = data.access_control_logs;
        if (data.auth_simulation_users) data.auth_simulation_users.forEach((u: AuthSimulationUser) => this.authSimUsers.set(u.email, u));
        if (data.hashing_simulation_users) this.hashingUsers = data.hashing_simulation_users;
        if (data.simulation_activity_logs) this.activityLogs = data.simulation_activity_logs;
        console.log("[storage] Loaded data from data.json");
      }
    } catch (e) {
      console.error("[storage] Failed to load data.json:", e);
    }
  }

  private seedAccessPolicies() {
    const initialPolicies = [
      { id: 1, role: "student", resource: "course_materials", permission: "read", allowed: 1 },
      { id: 2, role: "student", resource: "course_materials", permission: "download", allowed: 1 },
      { id: 3, role: "student", resource: "assignments", permission: "read", allowed: 1 },
      { id: 4, role: "student", resource: "assignments", permission: "submit", allowed: 1 },
      { id: 5, role: "student", resource: "grades", permission: "read", allowed: 1 },
      { id: 6, role: "faculty", resource: "course_materials", permission: "read", allowed: 1 },
      { id: 7, role: "faculty", resource: "course_materials", permission: "write", allowed: 1 },
      { id: 8, role: "faculty", resource: "assignments", permission: "grade", allowed: 1 },
      { id: 9, role: "admin", resource: "system_settings", permission: "manage", allowed: 1 },
    ];
    this.policies = initialPolicies;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async createLog(log: Log): Promise<Log> {
    this.logs.push(log);
    return log;
  }

  async getLogs(userId?: string): Promise<Log[]> {
    if (userId) return this.logs.filter(l => l.userId === userId);
    return this.logs;
  }

  async getAllConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(conversation: Conversation): Promise<Conversation> {
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messages.filter(m => m.conversationId === conversationId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async createMessage(message: Message): Promise<Message> {
    this.messages.push(message);
    return message;
  }

  async getAccessControlPolicies(): Promise<AccessControlPolicy[]> {
    return this.policies;
  }

  async createAccessControlPolicy(policy: AccessControlPolicy): Promise<AccessControlPolicy> {
    const newPolicy = { ...policy, id: this.policies.length + 1 };
    this.policies.push(newPolicy);
    return newPolicy;
  }

  async logAccessControlEvent(log: AccessControlLog): Promise<AccessControlLog> {
    const newLog = { ...log, id: this.accessLogs.length + 1 };
    this.accessLogs.push(newLog);
    return newLog;
  }

  async getAccessControlLogs(): Promise<AccessControlLog[]> {
    return this.accessLogs;
  }

  async checkPermission(role: string, resource: string, permission: string): Promise<boolean> {
    const policy = this.policies.find(p => p.role === role && p.resource === resource && p.permission === permission);
    return policy ? Boolean(policy.allowed) : false;
  }

  async deleteAccessControlPolicy(id: number): Promise<boolean> {
    const index = this.policies.findIndex(p => p.id === id);
    if (index !== -1) {
      this.policies.splice(index, 1);
      return true;
    }
    return false;
  }

  async createAuthSimulationUser(user: AuthSimulationUser): Promise<AuthSimulationUser> {
    this.authSimUsers.set(user.email, user);
    return user;
  }

  async getAuthSimulationUserByEmail(email: string): Promise<AuthSimulationUser | undefined> {
    return this.authSimUsers.get(email);
  }

  async createHashingSimulationUser(user: InsertHashingSimulationUser): Promise<HashingSimulationUser> {
    const newUser = { ...user, id: this.hashingUsers.length + 1 };
    this.hashingUsers.push(newUser);
    return newUser;
  }

  async getHashingSimulationUsers(): Promise<HashingSimulationUser[]> {
    return this.hashingUsers;
  }

  async logSimulationActivity(activity: Omit<SimulationActivityLog, "id">): Promise<SimulationActivityLog> {
    const newActivity = { ...activity, id: this.activityLogs.length + 1 };
    this.activityLogs.push(newActivity);
    return newActivity;
  }

  async getSimulationActivity(module: string): Promise<SimulationActivityLog[]> {
    return this.activityLogs.filter(a => a.module === module).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  async updateMfaSecret(id: string, secret: string): Promise<void> {
    const user = this.users.get(id);
    if (user) user.mfaSecret = secret;
  }

  async enableMfa(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) user.isMfaEnabled = true;
  }
}
