import type { TypedApiEndpoints } from "@globalShared/api/endpoints";
import type { ApiResponse } from "@globalShared/types/api";
import { typedLocalStorage } from "./localStorage";
import { encryptAuthData } from "./crypto/encrypt";
import type { IUserUniqData } from "@shared/types/userUniqData";

const defaultTTL = 60 * 60 * 1e3 * 4;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type AppHeaders = {
  "Content-Type"?: "application/json";
  "X-Encrypted-Auth"?: string;
};

interface FetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string> | Headers | AppHeaders;
  body?: BodyInit;
}

export async function fetchApi<T>(
  url: TypedApiEndpoints,
  options?: FetchOptions,
): Promise<T> {
  const headers: AppHeaders = {
    "Content-Type": "application/json",
  };
  let userUniqData = typedLocalStorage.get("userUniqData");

  if (!userUniqData || userUniqData.expiresAt < Date.now()) {
    const newUniqData: IUserUniqData = {
      userUniqId: crypto.randomUUID(),
      expiresAt: Date.now() + defaultTTL,
    };
    userUniqData = newUniqData;
    typedLocalStorage.set("userUniqData", newUniqData);
  }

  const encrypt = encryptAuthData({
    userUniqId: userUniqData.userUniqId,
    nonce: crypto.randomUUID(),
  });
  headers["X-Encrypted-Auth"] = encrypt;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    throw new Error(msg);
  }

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (!response.ok || !data.success) {
    const msg = !data.success ? data.error : `HTTP ${response.status}`;
    throw new Error(msg);
  }

  return data.data;
}
