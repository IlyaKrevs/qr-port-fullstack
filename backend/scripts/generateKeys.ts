import * as forge from "node-forge";
import fs from "fs";
import path from "path";

const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);

const keyDir = path.join(__dirname, "../keys");
if (!fs.existsSync(keyDir)) {
  fs.mkdirSync(keyDir, { recursive: true });
}

fs.writeFileSync(
  path.join(keyDir, "private.pem"),
  forge.pki.privateKeyToPem(privateKey),
);

fs.writeFileSync(
  path.join(keyDir, "public.pem"),
  forge.pki.publicKeyToPem(publicKey),
);

console.log("✅ Keys generated!");
