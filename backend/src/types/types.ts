// import { ApiResponse } from "@globalShared/types/api";
// import { CryptoAuthData } from "@globalShared/types/crypto";
// import { ApiError } from "@utils/basicApiFncs/ApiError";
// import { decryptAuthData } from "@utils/crypto/decrypt";
// import { Request, Response } from "express";

// type AppRequest<
//   T,
//   P extends Record<string, string> = {},
//   Q extends Record<string, string> = {},
// > = Request<P, {}, T, Q>;

// export type AppResponse<T> = Response<ApiResponse<T>>;

// export const createEndpoint = <
//   T,
//   R,
//   P extends Record<string, string> = {},
//   Q extends Record<string, string> = {},
// >(
//   handler: (req: AppRequest<T, P, Q>, authData?: CryptoAuthData) => Promise<R>,
// ) => {
//   return async (inReq: AppRequest<T, P, Q>, inRes: AppResponse<R>) => {
//     try {
//       const authData = inReq.headers["x-encrypted-auth"] as string;

//       const decryptData = decryptAuthData(authData);

//       const data = await handler(inReq, decryptData);
//       inRes.json({ success: true, data });
//     } catch (err: unknown) {
//       if (err instanceof ApiError) {
//         inRes.status(err.status).json({
//           success: false,
//           error: err.message,
//         });
//         return;
//       }
//       const message =
//         err instanceof Error ? err.message : "Server unknown error";
//       inRes.status(500).json({
//         success: false,
//         error: message,
//       });
//     }
//   };
// };
