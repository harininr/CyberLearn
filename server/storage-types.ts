import {
  User, Log, Conversation, Message,
  AccessControlPolicy, AccessControlLog,
  AuthSimulationUser, HashingSimulationUser, SimulationActivityLog
} from "../shared/schema.js";

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
  createHashingSimulationUser(user: any): Promise<HashingSimulationUser>;
  getHashingSimulationUsers(): Promise<HashingSimulationUser[]>;

  // Generic Simulation Activity
  logSimulationActivity(activity: Omit<SimulationActivityLog, "id">): Promise<SimulationActivityLog>;
  getSimulationActivity(module: string): Promise<SimulationActivityLog[]>;

  // MFA
  updateMfaSecret(id: string, secret: string): Promise<void>;
  enableMfa(id: string): Promise<void>;
}
