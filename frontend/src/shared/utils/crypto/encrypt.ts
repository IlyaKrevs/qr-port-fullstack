import * as forge from "node-forge";
import { typedLocalStorage } from "../localStorage";
import type { CryptoAuthData } from "@globalShared/types/crypto";

export const encryptAuthData = (data: CryptoAuthData): string => {
  const publicKeyPem = typedLocalStorage.get("publicKey");
  if (!publicKeyPem) {
    throw new Error("Public key not loaded");
  }

  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const jsonStr = JSON.stringify(data);
  const encrypted = publicKey.encrypt(jsonStr);
  return forge.util.encode64(encrypted);
};
