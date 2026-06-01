import type { IUserUniqData } from "@shared/types/userUniqData";

interface ILocalStorage {
  serverId: string;
  publicKey: string;
  userUniqData: IUserUniqData;
}

function LSgetItem<K extends keyof ILocalStorage>(
  key: K,
): ILocalStorage[K] | null {
  const value = localStorage.getItem(key);
  if (value === null) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value as ILocalStorage[K];
  }
}

function LSsetItem<K extends keyof ILocalStorage>(
  key: K,
  value: ILocalStorage[K],
): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function LSremoveItem(key: keyof ILocalStorage): void {
  localStorage.removeItem(key);
}

function LSclear(): void {
  localStorage.clear();
}

export const typedLocalStorage = {
  get: LSgetItem,
  set: LSsetItem,
  remove: LSremoveItem,
  clear: LSclear,
};
