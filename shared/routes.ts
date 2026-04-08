import { z } from 'zod';
import {
  User,
  InsertUser,
  LoginRequest,
  Log,
  Conversation,
  Message,
  AesEncryptRequest,
  AesDecryptRequest,
  RsaEncryptRequest,
  RsaDecryptRequest,
  HashRequest,
  SignRequest,
  VerifyRequest,
  BruteForceRequest,
  AccessControlPolicy,
  AccessControlLog,
  AuthSimulationUser,
  InsertAuthSimulationUser,
  HashingSimulationUser,
  InsertHashingSimulationUser,
  SimulationActivityLog
} from "./schema.js";


export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: InsertUser,
      responses: {
        201: User.omit({ password: true, salt: true, mfaSecret: true }).extend({
          token: z.string().optional()
        }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: LoginRequest,
      responses: {
        200: User.omit({ password: true, salt: true, mfaSecret: true }).extend({
          token: z.string().optional()
        }),
        401: errorSchemas.unauthorized,
        403: z.object({ message: z.string(), mfaRequired: z.boolean() }),
      },
    },
    mfaSetup: {
      method: 'POST' as const,
      path: '/api/auth/mfa/setup',
      responses: {
        200: z.object({ qrCode: z.string(), secret: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    mfaVerify: {
      method: 'POST' as const,
      path: '/api/auth/mfa/verify',
      input: z.object({ code: z.string() }),
      responses: {
        200: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    user: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: User.omit({ password: true, salt: true, mfaSecret: true }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  modules: {
    crypto: {
      encryptAes: {
        method: 'POST' as const,
        path: '/api/crypto/aes/encrypt',
        input: AesEncryptRequest,
        responses: {
          200: z.object({ encrypted: z.string(), iv: z.string() }),
        },
      },
      decryptAes: {
        method: 'POST' as const,
        path: '/api/crypto/aes/decrypt',
        input: AesDecryptRequest,
        responses: {
          200: z.object({ decrypted: z.string() }),
        },
      },
      generateRsa: {
        method: 'POST' as const,
        path: '/api/crypto/rsa/generate',
        responses: {
          200: z.object({ publicKey: z.string(), privateKey: z.string() }),
        },
      },
      encryptRsa: {
        method: 'POST' as const,
        path: '/api/crypto/rsa/encrypt',
        input: RsaEncryptRequest,
        responses: {
          200: z.object({ encrypted: z.string() }),
        },
      },
      decryptRsa: {
        method: 'POST' as const,
        path: '/api/crypto/rsa/decrypt',
        input: RsaDecryptRequest,
        responses: {
          200: z.object({ decrypted: z.string() }),
        },
      },
    },
    hashing: {
      hash: {
        method: 'POST' as const,
        path: '/api/hashing/hash',
        input: HashRequest,
        responses: {
          200: z.object({ hash: z.string() }),
        },
      },
      sign: {
        method: 'POST' as const,
        path: '/api/hashing/sign',
        input: SignRequest,
        responses: {
          200: z.object({ signature: z.string() }),
        },
      },
      verify: {
        method: 'POST' as const,
        path: '/api/hashing/verify',
        input: VerifyRequest,
        responses: {
          200: z.object({ isValid: z.boolean() }),
        },
      },
    },
    attack: {
      bruteForce: {
        method: 'POST' as const,
        path: '/api/attack/brute-force',
        input: BruteForceRequest,
        responses: {
          200: z.object({
            success: z.boolean(),
            crackedPassword: z.string().optional(),
            attempts: z.number(),
            timeTaken: z.number(),
            hashAlgorithm: z.string().optional(),
            complexity: z.number().optional(),
            attackSpeed: z.number().optional()
          }),
        },
      },
    },
    simulation: {
      // Access Control
      getACM: {
        method: 'GET' as const,
        path: '/api/simulation/acm',
        responses: {
          200: z.array(AccessControlPolicy),
        },
      },
      verifyAccess: {
        method: 'POST' as const,
        path: '/api/simulation/acm/verify',
        input: z.object({
          role: z.string(),
          resource: z.string(),
          permission: z.string(),
        }),
        responses: {
          200: z.object({ allowed: z.boolean() }),
        },
      },
      logAccess: {
        method: 'POST' as const,
        path: '/api/simulation/acm/log',
        input: AccessControlLog.omit({ id: true }),
        responses: {
          201: AccessControlLog,
        },
      },
      getAccessLogs: {
        method: 'GET' as const,
        path: '/api/simulation/acm/logs',
        responses: {
          200: z.array(AccessControlLog),
        },
      },
      createPolicy: {
        method: 'POST' as const,
        path: '/api/simulation/acm',
        input: AccessControlPolicy.omit({ id: true }),
        responses: {
          201: AccessControlPolicy,
        },
      },
      deletePolicy: {
        method: 'DELETE' as const,
        path: '/api/simulation/acm/:id',
        responses: {
          200: z.object({ success: z.boolean() }),
        },
      },

      // Auth Simulation
      createAuthUser: {
        method: 'POST' as const,
        path: '/api/simulation/auth/register',
        input: InsertAuthSimulationUser,
        responses: {
          201: AuthSimulationUser,
        },
      },
      getAuthUser: {
        method: 'GET' as const,
        path: '/api/simulation/auth/user/:email',
        responses: {
          200: AuthSimulationUser,
          404: errorSchemas.notFound,
        },
      },

      // Hashing Simulation
      createHashingUser: {
        method: 'POST' as const,
        path: '/api/simulation/hashing/register',
        input: InsertHashingSimulationUser,
        responses: {
          201: HashingSimulationUser,
        },
      },
      getHashingUsers: {
        method: 'GET' as const,
        path: '/api/simulation/hashing/users',
        responses: {
          200: z.array(HashingSimulationUser),
        },
      },

      // Generic Activity Log
      logActivity: {
        method: 'POST' as const,
        path: '/api/simulation/activity/log',
        input: SimulationActivityLog.omit({ id: true }),
        responses: {
          201: SimulationActivityLog,
        },
      },
      getActivity: {
        method: 'GET' as const,
        path: '/api/simulation/activity/:module',
        responses: {
          200: z.array(SimulationActivityLog),
        },
      },
    },

  },
  chat: {
    list: {
      method: 'GET' as const,
      path: '/api/chat/conversations',
      responses: {
        200: z.array(Conversation),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/chat/conversations',
      input: z.object({ title: z.string() }),
      responses: {
        201: Conversation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/chat/conversations/:id',
      responses: {
        200: z.object({
          conversation: Conversation,
          messages: z.array(Message),
        }),
        404: errorSchemas.notFound,
      },
    },
    message: {
      method: 'POST' as const,
      path: '/api/chat/conversations/:id/messages',
      input: z.object({ content: z.string() }),
      responses: {
        200: Message, // In reality, this endpoint streams SSE
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
