import * as dotenv from 'dotenv';
dotenv.config();

import { storage } from './server/storage.js';
import crypto from 'crypto';

async function test() {
  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const user = await storage.createUser({
      id: crypto.randomUUID(),
      username: "testuser_" + Date.now(),
      password: "hashedPassword",
      salt,
      role: "Student",
      isMfaEnabled: false,
      mfaSecret: undefined
    });
    console.log("Success", user);
  } catch(e) {
    console.error("Error creating user:", e);
  }
}

test().then(() => process.exit(0));
