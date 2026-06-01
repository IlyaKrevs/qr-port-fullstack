import fs from "fs";
import path from "node:path";

const appKeysPath = {
  public: "./keys/public.pem",
  private: "./keys/private.pem",
};

const getFileContent = (
  relativePath: string,
  mainPath = __dirname,
  encode: BufferEncoding = "utf8",
) => {
  const fullPath = path.join(mainPath, relativePath);
  const content = fs.readFileSync(fullPath, encode);
  return content;
};

const getPublicKey = (): string => {
  return getFileContent(appKeysPath.public);
};

const getPrivateKey = (): string => {
  return getFileContent(appKeysPath.private);
};

export const getCryptoKeys = {
  public: getPublicKey(),
  private: getPrivateKey(),
};
