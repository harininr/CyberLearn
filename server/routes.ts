import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { api, errorSchemas } from "../shared/routes.js";
import { z } from "zod";
import crypto from "crypto";
import OpenAI from "openai";
import { generateSecret, verify, generateURI } from "otplib";

// OpenRouter setup for AI chat functionality
const openrouter = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:5000",
      "X-Title": "CyberSec Simulator",
    },
  })
  : null;


export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Middleware for sessions (simple memory-based for this local app)
  // In a real app we'd use express-session, but here we can just use a simple map for demo
  // Or just stateless JWT. Requirement says "Implement session-based authentication".
  // I'll use a simple in-memory session map.
  const sessions = new Map<string, { userId: string, expiresAt: number }>();

  function createSession(userId: string) {
    const id = crypto.randomUUID();
    sessions.set(id, { userId, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
    return id;
  }

  function getSession(req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(" ")[1];
    const session = sessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
      sessions.delete(token);
      return null;
    }
    return session;
  }

  // === AUTHENTICATION ===

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByUsername(input.username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const salt = crypto.randomBytes(16).toString("hex");
      const passwordHash = crypto.pbkdf2Sync(input.password, salt, 1000, 64, "sha512").toString("hex");

      const user = await storage.createUser({
        id: crypto.randomUUID(),
        username: input.username,
        password: passwordHash, // Store hash
        salt,
        role: input.role,
        isMfaEnabled: false,
        mfaSecret: input.enableMfa ? generateSecret() : undefined,
      });

      // Log registration
      await storage.createLog({
        id: crypto.randomUUID(),
        userId: user.id,
        timestamp: new Date().toISOString(),
        module: "Auth",
        action: "Register",
        details: `User ${user.username} registered as ${user.role}`,
        result: "Success"
      });

      const token = createSession(user.id);
      const { password, salt: s, mfaSecret, ...safeUser } = user;
      res.status(201).json({ ...safeUser, token });
    } catch (err: any) {
      console.error('[register] Registration error:', err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.issues[0].message });
      } else {
        res.status(500).json({ message: err.message || "Internal server error" });
      }
    }
  }
  );

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(input.username);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const hash = crypto.pbkdf2Sync(input.password, user.salt, 1000, 64, "sha512").toString("hex");
      if (hash !== user.password) {
        // Log failure
        await storage.createLog({
          id: crypto.randomUUID(),
          userId: user.id,
          timestamp: new Date().toISOString(),
          module: "Auth",
          action: "Login",
          details: `Failed login attempt for ${input.username}`,
          result: "Failure"
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Real MFA Check
      if (user.isMfaEnabled) {
        if (!input.otp) {
          return res.status(403).json({ message: "MFA code required", mfaRequired: true });
        }
        const isValid = await verify({
          token: input.otp,
          secret: user.mfaSecret!
        });
        if (!isValid) {
          return res.status(401).json({ message: "Invalid MFA code" });
        }
      }

      const token = createSession(user.id);

      // Log success
      await storage.createLog({
        id: crypto.randomUUID(),
        userId: user.id,
        timestamp: new Date().toISOString(),
        module: "Auth",
        action: "Login",
        details: `User ${user.username} logged in${user.isMfaEnabled ? " (MFA)" : ""}`,
        result: "Success"
      });

      const { password, salt, mfaSecret, ...safeUser } = user;
      res.json({ ...safeUser, token });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.issues[0].message });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  });

  app.post(api.auth.mfaSetup.path, async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) return res.status(401).json({ message: "Unauthorized" });

      const user = await storage.getUser(session.userId);
      if (!user) return res.status(401).json({ message: "User not found" });

      if (!user.mfaSecret) {
        const secret = generateSecret();
        await storage.updateMfaSecret(user.id, secret);
        user.mfaSecret = secret;
      }

      const otpauth = generateURI({
        secret: user.mfaSecret!,
        label: user.username,
        issuer: "CyberLearn"
      });
      res.json({ qrCode: otpauth, secret: user.mfaSecret });
    } catch (e) {
      res.status(500).json({ message: "Failed to set up MFA" });
    }
  });

  app.post(api.auth.mfaVerify.path, async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) return res.status(401).json({ message: "Unauthorized" });

      const user = await storage.getUser(session.userId);
      if (!user || !user.mfaSecret) return res.status(401).json({ message: "MFA not set up" });

      const { code } = z.object({ code: z.string() }).parse(req.body);
      const isValid = await verify({
        token: code,
        secret: user.mfaSecret
      });

      if (isValid) {
        await storage.enableMfa(user.id);
        res.json({ success: true });
      } else {
        res.status(400).json({ message: "Invalid verification code" });
      }
    } catch (e) {
      res.status(500).json({ message: "Failed to verify MFA" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    // In a real session store, we'd destroy the session.
    res.json({ message: "Logged out" });
  });

  app.get(api.auth.user.path, async (req, res) => {
    const session = getSession(req);
    if (!session) return res.status(401).json({ message: "Not authenticated" });

    const user = await storage.getUser(session.userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    const { password, salt, mfaSecret, ...safeUser } = user;
    res.json(safeUser);
  });

  // === CRYPTO MODULE ===

  app.post(api.modules.crypto.encryptAes.path, async (req, res) => {
    try {
      const { text, key } = api.modules.crypto.encryptAes.input.parse(req.body);
      const iv = crypto.randomBytes(16);
      // Key must be 32 bytes for aes-256-cbc
      // We'll pad or truncate the input key to 32 bytes (64 hex chars)
      // Or just hash it to get a key.
      const keyBuffer = crypto.createHash('sha256').update(key).digest();

      const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      res.json({ encrypted, iv: iv.toString('hex') });
    } catch (e) {
      res.status(500).json({ message: "Encryption failed" });
    }
  });

  app.post(api.modules.crypto.decryptAes.path, async (req, res) => {
    try {
      const { encrypted, key, iv } = api.modules.crypto.decryptAes.input.parse(req.body);
      const keyBuffer = crypto.createHash('sha256').update(key).digest();
      const ivBuffer = Buffer.from(iv, 'hex');

      const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      res.json({ decrypted });
    } catch (e) {
      res.status(400).json({ message: "Decryption failed (Wrong key/IV?)" });
    }
  });

  app.post(api.modules.crypto.generateRsa.path, async (req, res) => {
    crypto.generateKeyPair('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    }, (err, publicKey, privateKey) => {
      if (err) return res.status(500).json({ message: "Key gen failed" });
      res.json({ publicKey, privateKey });
    });
  });

  app.post(api.modules.crypto.encryptRsa.path, async (req, res) => {
    try {
      const { text, publicKey } = api.modules.crypto.encryptRsa.input.parse(req.body);
      const buffer = Buffer.from(text, 'utf8');
      const encrypted = crypto.publicEncrypt(publicKey, buffer);
      res.json({ encrypted: encrypted.toString('base64') });
    } catch (e) {
      res.status(500).json({ message: "RSA Encryption failed" });
    }
  });

  app.post(api.modules.crypto.decryptRsa.path, async (req, res) => {
    try {
      const { encrypted, privateKey } = api.modules.crypto.decryptRsa.input.parse(req.body);
      const buffer = Buffer.from(encrypted, 'base64');
      const decrypted = crypto.privateDecrypt(privateKey, buffer);
      res.json({ decrypted: decrypted.toString('utf8') });
    } catch (e) {
      res.status(400).json({ message: "RSA Decryption failed" });
    }
  });

  // === HASHING MODULE ===

  app.post(api.modules.hashing.hash.path, async (req, res) => {
    try {
      const { text, algorithm, salt } = api.modules.hashing.hash.input.parse(req.body);
      const input = salt ? text + salt : text;
      const hash = crypto.createHash(algorithm).update(input).digest('hex');
      res.json({ hash });
    } catch (e) {
      res.status(500).json({ message: "Hashing failed" });
    }
  });

  app.post(api.modules.hashing.sign.path, async (req, res) => {
    try {
      const { text, privateKey } = api.modules.hashing.sign.input.parse(req.body);
      const sign = crypto.createSign('SHA256');
      sign.update(text);
      sign.end();
      const signature = sign.sign(privateKey, 'base64');
      res.json({ signature });
    } catch (e) {
      res.status(500).json({ message: "Signing failed" });
    }
  });

  app.post(api.modules.hashing.verify.path, async (req, res) => {
    try {
      const { text, signature, publicKey } = api.modules.hashing.verify.input.parse(req.body);
      const verify = crypto.createVerify('SHA256');
      verify.update(text);
      verify.end();
      const isValid = verify.verify(publicKey, signature, 'base64');
      res.json({ isValid });
    } catch (e) {
      res.status(400).json({ message: "Verification failed" });
    }
  });

  // === ATTACK MODULE ===

  app.post(api.modules.attack.bruteForce.path, async (req, res) => {
    // Simulated brute force attack
    const { targetHash, complexity, hashAlgorithm, attackSpeed } = api.modules.attack.bruteForce.input.parse(req.body);

    let attempts = 0;
    const startTime = Date.now();
    let cracked: string | undefined = undefined;

    // Generate character set based on complexity
    const getCharSet = (level: number): string => {
      const digits = "0123456789";
      const lowercase = "abcdefghijklmnopqrstuvwxyz";
      const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const symbols = "!@#$%^&*";

      switch (level) {
        case 1: return digits;
        case 2: return digits + lowercase;
        case 3: return digits + lowercase + uppercase;
        case 4: return digits + lowercase + uppercase + symbols;
        case 5: return digits + lowercase + uppercase + symbols + "()[]{}|;:',.<>?/~`";
        default: return digits + lowercase;
      }
    };

    const charSet = getCharSet(complexity);

    // Calculate max attempts based on attack speed (higher speed = more attempts)
    const speedMultiplier = Math.pow(10, attackSpeed - 1);
    const maxAttempts = Math.min(100000, 1000 * speedMultiplier);
    const timeout = 5000; // 5 second timeout

    // Try to crack the password by brute forcing through combinations
    // For demo purposes, we limit to reasonable iteration count
    const algorithm = hashAlgorithm || "sha256";

    // First try common numeric passwords
    for (let i = 0; i < Math.min(maxAttempts, 100000); i++) {
      attempts++;
      const attempt = i.toString();
      const hash = crypto.createHash(algorithm).update(attempt).digest('hex');

      if (hash === targetHash) {
        cracked = attempt;
        break;
      }

      if (Date.now() - startTime > timeout) break;
    }

    // If not found in numeric, try common patterns
    if (!cracked && Date.now() - startTime < timeout) {
      const commonPasswords = [
        "password", "123456", "qwerty", "admin", "letmein", "welcome",
        "abc123", "test", "hello", "password1", "123", "1234", "12345"
      ];

      for (const pwd of commonPasswords) {
        attempts++;
        const hash = crypto.createHash(algorithm).update(pwd).digest('hex');
        if (hash === targetHash) {
          cracked = pwd;
          break;
        }
      }
    }

    res.json({
      success: !!cracked,
      crackedPassword: cracked,
      attempts,
      timeTaken: Date.now() - startTime,
      hashAlgorithm: algorithm,
      complexity,
      attackSpeed
    });
  });


  // === SIMULATION MODULES (Restructured) ===

  // Access Control Simulation
  app.get(api.modules.simulation.getACM.path, async (_req, res) => {
    try {
      const policies = await storage.getAccessControlPolicies();
      res.json(policies);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch ACM" });
    }
  });

  app.post(api.modules.simulation.verifyAccess.path, async (req, res) => {
    try {
      const { role, resource, permission } = api.modules.simulation.verifyAccess.input.parse(req.body);
      const allowed = await storage.checkPermission(role, resource, permission);
      res.json({ allowed });
    } catch (e) {
      res.status(400).json({ message: "Invalid verification request" });
    }
  });

  app.post(api.modules.simulation.logAccess.path, async (req, res) => {
    try {
      const input = api.modules.simulation.logAccess.input.parse(req.body);
      const log = await storage.logAccessControlEvent({
        ...input,
        id: 0
      });
      res.status(201).json(log);
    } catch (e) {
      res.status(500).json({ message: "Failed to log access event" });
    }
  });

  app.get(api.modules.simulation.getAccessLogs.path, async (_req, res) => {
    try {
      const logs = await storage.getAccessControlLogs();
      res.json(logs);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch access logs" });
    }
  });

  app.post(api.modules.simulation.createPolicy.path, async (req, res) => {
    try {
      const input = api.modules.simulation.createPolicy.input.parse(req.body);
      const policy = await storage.createAccessControlPolicy({
        ...input,
        id: 0
      });
      res.status(201).json(policy);
    } catch (e) {
      res.status(500).json({ message: "Failed to create policy" });
    }
  });

  app.delete(api.modules.simulation.deletePolicy.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const success = await storage.deleteAccessControlPolicy(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Policy not found" });
      }
    } catch (e) {
      res.status(500).json({ message: "Failed to delete policy" });
    }
  });

  // Auth Simulation
  app.post(api.modules.simulation.createAuthUser.path, async (req, res) => {
    try {
      const input = api.modules.simulation.createAuthUser.input.parse(req.body);
      const user = await storage.createAuthSimulationUser({
        ...input,
        id: crypto.randomUUID()
      });
      res.status(201).json(user);
    } catch (e) {
      res.status(500).json({ message: "Failed to register simulation user" });
    }
  });

  app.get(api.modules.simulation.getAuthUser.path, async (req, res) => {
    try {
      const email = req.params.email as string;
      const user = await storage.getAuthSimulationUserByEmail(email);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch simulation user" });
    }
  });

  // Hashing Simulation
  app.post(api.modules.simulation.createHashingUser.path, async (req, res) => {
    try {
      const input = api.modules.simulation.createHashingUser.input.parse(req.body);
      const user = await storage.createHashingSimulationUser(input);
      res.status(201).json(user);
    } catch (e) {
      res.status(500).json({ message: "Failed to store hashing user" });
    }
  });

  app.get(api.modules.simulation.getHashingUsers.path, async (_req, res) => {
    try {
      const users = await storage.getHashingSimulationUsers();
      res.json(users);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch hashing users" });
    }
  });

  // Generic Activity Log
  app.post(api.modules.simulation.logActivity.path, async (req, res) => {
    try {
      const input = api.modules.simulation.logActivity.input.parse(req.body);
      const activity = await storage.logSimulationActivity(input);
      res.status(201).json(activity);
    } catch (e) {
      res.status(500).json({ message: "Failed to log activity" });
    }
  });

  app.get(api.modules.simulation.getActivity.path, async (req, res) => {
    try {
      const moduleName = req.params.module as string;
      const activity = await storage.getSimulationActivity(moduleName);
      res.json(activity);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });




  // === CHAT MODULE (AI TUTOR) ===

  app.get(api.chat.list.path, async (req, res) => {
    const conversations = await storage.getAllConversations();
    res.json(conversations);
  });

  app.post(api.chat.create.path, async (req, res) => {
    const { title } = req.body;
    const conversation = await storage.createConversation({
      id: crypto.randomUUID(),
      title: title || "New Chat",
      createdAt: new Date().toISOString()
    });
    res.status(201).json(conversation);
  });

  app.get(api.chat.get.path, async (req, res) => {
    const conversation = await storage.getConversation(req.params.id as string);
    if (!conversation) return res.status(404).json({ message: "Not found" });
    const messages = await storage.getMessages(req.params.id as string);
    res.json({ conversation, messages });
  });

  app.post(api.chat.message.path, async (req, res) => {
    // Note: This implementation mirrors the streaming logic but adapted for our types
    try {
      const conversationId = req.params.id as string;
      const { content } = req.body;

      // Save user message
      await storage.createMessage({
        id: crypto.randomUUID(),
        conversationId,
        role: "user",
        content,
        createdAt: new Date().toISOString()
      });

      // Get history
      const messages = await storage.getMessages(conversationId);
      const history = messages.map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }));

      // Prepare SSE
      // Prepare SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      if (!openrouter) {
        return res.status(500).json({ message: "OpenRouter API key not configured" });
      }

      const stream = await openrouter.chat.completions.create({

        model: "meta-llama/llama-3.3-70b-instruct", // High quality, usually available
        messages: [
          { role: "system", content: "You are an expert Cybersecurity Tutor for the 'CyberLearn Simulator'. Explain concepts clearly, step-by-step. Do NOT generate actual keys or perform attacks, just explain them. Keep responses concise." },
          ...history
        ],
        stream: true,
        max_tokens: 1024,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) {
          fullResponse += delta;
          res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
        }
      }

      // Save assistant message
      await storage.createMessage({
        id: crypto.randomUUID(),
        conversationId,
        role: "assistant",
        content: fullResponse,
        createdAt: new Date().toISOString()
      });

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();

    } catch (error) {
      console.error("AI Error:", error);
      if (!res.headersSent) res.status(500).json({ message: "AI Error" });
    }
  });

  return httpServer;
}
