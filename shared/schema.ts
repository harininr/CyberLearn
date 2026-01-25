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

export const InsertUser = User.pick({ username: true, password: true, role: true });
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
  complexity: z.number().min(1).max(3), // 1=Easy, 2=Med, 3=Hard
});
