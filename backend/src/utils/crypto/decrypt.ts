import * as forge from "node-forge";
import { CryptoAuthData } from "@globalShared/types/crypto";
import { getCryptoKeys } from "./getCryptoKeys";

export const decryptAuthData = (data: string): CryptoAuthData => {
  if (!data) {
    throw new Error("No encrypted data");
  }

  const privateKeyPem = getCryptoKeys.private;
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encrypted = forge.util.decode64(data);
  const decryptedStr = privateKey.decrypt(encrypted);

  return JSON.parse(decryptedStr);
};
