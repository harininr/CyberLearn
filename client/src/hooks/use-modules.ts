import { useMutation } from "@tanstack/react-query";
import { api, type AesEncryptRequest, type AesDecryptRequest, type RsaEncryptRequest, type RsaDecryptRequest, type HashRequest, type SignRequest, type VerifyRequest, type BruteForceRequest } from "@shared/routes";

// ==================== CRYPTO MODULE ====================

export function useAesEncrypt() {
  return useMutation({
    mutationFn: async (data: AesEncryptRequest) => {
      const res = await fetch(api.modules.crypto.encryptAes.path, {
        method: api.modules.crypto.encryptAes.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Encryption failed");
      return api.modules.crypto.encryptAes.responses[200].parse(await res.json());
    },
  });
}

export function useAesDecrypt() {
  return useMutation({
    mutationFn: async (data: AesDecryptRequest) => {
      const res = await fetch(api.modules.crypto.decryptAes.path, {
        method: api.modules.crypto.decryptAes.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Decryption failed");
      return api.modules.crypto.decryptAes.responses[200].parse(await res.json());
    },
  });
}

export function useGenerateRsa() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.modules.crypto.generateRsa.path, {
        method: api.modules.crypto.generateRsa.method,
      });
      if (!res.ok) throw new Error("Key generation failed");
      return api.modules.crypto.generateRsa.responses[200].parse(await res.json());
    },
  });
}

export function useRsaEncrypt() {
  return useMutation({
    mutationFn: async (data: RsaEncryptRequest) => {
      const res = await fetch(api.modules.crypto.encryptRsa.path, {
        method: api.modules.crypto.encryptRsa.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("RSA Encryption failed");
      return api.modules.crypto.encryptRsa.responses[200].parse(await res.json());
    },
  });
}

export function useRsaDecrypt() {
  return useMutation({
    mutationFn: async (data: RsaDecryptRequest) => {
      const res = await fetch(api.modules.crypto.decryptRsa.path, {
        method: api.modules.crypto.decryptRsa.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("RSA Decryption failed");
      return api.modules.crypto.decryptRsa.responses[200].parse(await res.json());
    },
  });
}

// ==================== HASHING MODULE ====================

export function useHash() {
  return useMutation({
    mutationFn: async (data: HashRequest) => {
      const res = await fetch(api.modules.hashing.hash.path, {
        method: api.modules.hashing.hash.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Hashing failed");
      return api.modules.hashing.hash.responses[200].parse(await res.json());
    },
  });
}

export function useSign() {
  return useMutation({
    mutationFn: async (data: SignRequest) => {
      const res = await fetch(api.modules.hashing.sign.path, {
        method: api.modules.hashing.sign.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Signing failed");
      return api.modules.hashing.sign.responses[200].parse(await res.json());
    },
  });
}

export function useVerify() {
  return useMutation({
    mutationFn: async (data: VerifyRequest) => {
      const res = await fetch(api.modules.hashing.verify.path, {
        method: api.modules.hashing.verify.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Verification failed");
      return api.modules.hashing.verify.responses[200].parse(await res.json());
    },
  });
}

// ==================== ATTACK MODULE ====================

export function useBruteForce() {
  return useMutation({
    mutationFn: async (data: BruteForceRequest) => {
      const res = await fetch(api.modules.attack.bruteForce.path, {
        method: api.modules.attack.bruteForce.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Attack simulation failed");
      return api.modules.attack.bruteForce.responses[200].parse(await res.json());
    },
  });
}
