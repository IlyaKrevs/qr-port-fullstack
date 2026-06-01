import { ApiResponse } from "@globalShared/types/api";
import { Request, Response } from "express";
import { ApiError } from "./ApiError";
import { decryptAuthData } from "@utils/crypto/decrypt";
import {  userConnections } from "@mockData/userConnections";
type AppRequest<
  T,
  P extends Record<string, string> = {},
  Q extends Record<string, string> = {},
> = Request<P, {}, T, Q>;

export type AppResponse<T> = Response<ApiResponse<T>>;

const defaultErrorsHandler = <
  T,
  R,
  P extends Record<string, string> = {},
  Q extends Record<string, string> = {},
>(
  handler: (req: AppRequest<T, P, Q>) => Promise<R>,
) => {
  return async (inReq: AppRequest<T, P, Q>, inRes: AppResponse<R>) => {
    try {
      const data = await handler(inReq);
      inRes.json({ success: true, data });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        inRes.status(err.status).json({
          success: false,
          error: err.message,
        });
        return;
      }
      const message =
        err instanceof Error ? err.message : "Server unknown error";
      inRes.status(500).json({
        success: false,
        error: message,
      });
    }
  };
};

export const createEndpoint = <
  T,
  R,
  P extends Record<string, string> = {},
  Q extends Record<string, string> = {},
>(
  handler: (req: AppRequest<T, P, Q>, userUniqId: string) => Promise<R>,
) => {
  return defaultErrorsHandler(async (req: AppRequest<T, P, Q>) => {
    const authHeader = req.headers["x-encrypted-auth"] as string;
    if (!authHeader) {
      throw new ApiError(401, "No auth header");
    }
    const authData = decryptAuthData(authHeader);

    let userData = userConnections.get(authData.userUniqId);
    if (!userData) {
      userData = {
        id: authData.userUniqId,
        name: null,
        nonce: [],
        lastConnect: Date.now(),
      };
      userConnections.set(authData.userUniqId, userData);
    }

    if (userData.nonce.includes(authData.nonce)) {
      throw new ApiError(409, "Reply request detected!");
    }
    userData.nonce.push(authData.nonce);
    userData.lastConnect = Date.now();

    return handler(req, authData.userUniqId);
  });
};
