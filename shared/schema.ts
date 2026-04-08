import { z } from "zod";

export const UserRole = z.enum(["Student", "Instructor", "Admin"]);
export type UserRole = z.infer<typeof UserRole>;

export const User = z.object({
  id: z.string(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string(), // This will store the HASH in JSON, but for input it's plain text
  salt: z.string(),
  role: UserRole,
  isMfaEnabled: z.boolean().default(false),
  mfaSecret: z.string().optional(),
});
export type User = z.infer<typeof User>;

export const InsertUser = User.pick({ username: true, password: true, role: true }).extend({
  enableMfa: z.boolean().default(false),
});
export type InsertUser = z.infer<typeof InsertUser>;

export const LoginRequest = z.object({
  username: z.string(),
  password: z.string(),
  otp: z.string().optional(),
});
export type LoginRequest = z.infer<typeof LoginRequest>;

export const Log = z.object({
  id: z.string(),
  userId: z.string().optional(),
  timestamp: z.string(), // ISO
  module: z.string(),
  action: z.string(),
  details: z.string(),
  result: z.string(),
});
export type Log = z.infer<typeof Log>;

export const Conversation = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(), // ISO
});
export type Conversation = z.infer<typeof Conversation>;

export const Message = z.object({
  id: z.string(),
  conversationId: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.string(), // ISO
});
export type Message = z.infer<typeof Message>;

// Crypto Module Types
export const AesEncryptRequest = z.object({
  text: z.string(),
  key: z.string(), // hex
});
export const AesDecryptRequest = z.object({
  encrypted: z.string(), // hex
  key: z.string(), // hex
  iv: z.string(), // hex
});

export const RsaKeyRequest = z.object({});
export const RsaEncryptRequest = z.object({
  text: z.string(),
  publicKey: z.string(),
});
export const RsaDecryptRequest = z.object({
  encrypted: z.string(), // base64
  privateKey: z.string(),
});

// Hashing Module Types
export const HashRequest = z.object({
  text: z.string(),
  algorithm: z.enum(["sha256", "md5"]), // Educational purposes
  salt: z.string().optional(),
});

export const SignRequest = z.object({
  text: z.string(),
  privateKey: z.string(),
});
export const VerifyRequest = z.object({
  text: z.string(),
  signature: z.string(), // hex or base64
  publicKey: z.string(),
});

// Attack Module Types
export const BruteForceRequest = z.object({
  targetHash: z.string(),
  complexity: z.number().min(1).max(5), // 1-5 scale for character set complexity
  hashAlgorithm: z.enum(["md5", "sha256"]).default("sha256"),
  attackSpeed: z.number().min(1).max(5).default(3), // 1-5 scale for simulated computing power
});
export type BruteForceRequest = z.infer<typeof BruteForceRequest>;

// Access Control Module Types
export const AccessControlPolicy = z.object({
  id: z.number(),
  role: z.string(), // 'student', 'faculty', 'admin'
  resource: z.string(), // 'course_materials', 'grades', 'assignments', 'user_database', 'system_settings'
  permission: z.string(), // 'read', 'write', 'delete', 'manage', 'submit', 'grade', 'upload'
  allowed: z.boolean()
});
export type AccessControlPolicy = z.infer<typeof AccessControlPolicy>;

export const AccessControlLog = z.object({
  id: z.number(),
  timestamp: z.string(),
  actor: z.string(),
  action: z.string(),
  resource: z.string(),
  outcome: z.string(), // 'GRANTED', 'DENIED'
  details: z.string().optional()
});
export type AccessControlLog = z.infer<typeof AccessControlLog>;

// Auth Simulation Specific Types
export const AuthSimulationUser = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  fullName: z.string(),
  studentId: z.string(),
  department: z.string(),
  otpSecret: z.string(),
  mfaEnabled: z.boolean().default(true),
  registered: z.boolean().default(true),
  registrationDate: z.string(),
});
export type AuthSimulationUser = z.infer<typeof AuthSimulationUser>;

export const InsertAuthSimulationUser = AuthSimulationUser.omit({ id: true });
export type InsertAuthSimulationUser = z.infer<typeof InsertAuthSimulationUser>;

// Hashing Simulation Specific Types
export const HashingSimulationUser = z.object({
  id: z.number(),
  username: z.string(),
  passwordHash: z.string(),
  salt: z.string(),
});
export type HashingSimulationUser = z.infer<typeof HashingSimulationUser>;

export const InsertHashingSimulationUser = HashingSimulationUser.omit({ id: true });
export type InsertHashingSimulationUser = z.infer<typeof InsertHashingSimulationUser>;

// Generic Simulation Log for other modules
export const SimulationActivityLog = z.object({
  id: z.number(),
  module: z.string(), // 'crypto', 'ds', 'hashing'
  timestamp: z.string(),
  action: z.string(),
  details: z.string(),
});
export type SimulationActivityLog = z.infer<typeof SimulationActivityLog>;

