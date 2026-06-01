import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchApi } from "@shared/utils/fetchApi";
import { createAsyncAction } from "./helpers/createAsyncAction";

import { ENDPOINTS } from "@globalShared/api/endpoints";
import type { IQPort } from "@globalShared/types/entities/Qport.entity";

interface ISessionState {
  userName: string | null;
  userRole: IQPort["role"];
  qrCodeId: string | null;
  status: "none" | "pending" | "approved" | "rejected";
  sessions: string[];
  loading: boolean;
  error: null | string;
}

interface ISesssionMethods {
  getAll: () => Promise<void>;
  startSession: (data: SessionRequest) => Promise<void>;
  closeSession: (id: string) => Promise<void>;
  checkStatus: () => Promise<void>;
}

type SessionResponse = {
  userName: string;
  userRole: ISessionState["userRole"];
  sessionId: string;
  status: ISessionState["status"];
};

type SessionRequest = {
  userName: string;
  qrCodeId: string;
};

type SessionCheckResponse = {
  sessionId: string;
  status: ISessionState["status"];
};

const initState: ISessionState = {
  userName: null,
  userRole: "guest",
  qrCodeId: null,
  status: "none",
  sessions: [],
  loading: false,
  error: null,
};

type ISessionStore = ISessionState & ISesssionMethods;

export const useSessionStore = create<ISessionStore>()(
  persist(
    (set, get) => {
      const asyncAction = createAsyncAction<ISessionStore>(set, get);

      return {
        ...initState,
        getAll: asyncAction<string[], void>(
          () => fetchApi(ENDPOINTS.session.getAll),
          {
            onSuccess: (data, set) => {
              set({ sessions: data });
            },
          },
        ),
        startSession: asyncAction<SessionResponse, SessionRequest>(
          (data) =>
            fetchApi(ENDPOINTS.session.start, {
              method: "POST",
              body: JSON.stringify({
                userName: data.userName,
                qrCodeId: data.qrCodeId,
              }),
            }),
          {
            onSuccess: (data, set) => {
              set({
                userName: data.userName,
                userRole: data.userRole,
                qrCodeId: data.sessionId,
                status: data.status,
              });
            },
          },
        ),
        closeSession: asyncAction<{ id: string }, string>(
          (id) =>
            fetchApi(ENDPOINTS.session.close, {
              method: "DELETE",
              body: JSON.stringify({ id }),
            }).then(() => ({ id })),
          {
            onSuccess: (data, set, get) => {
              const newSessions = get().sessions.filter(
                (item) => item !== data.id,
              );
              set({ sessions: newSessions });
            },
          },
        ),
        checkStatus: asyncAction<SessionCheckResponse, void>(
          () => fetchApi(ENDPOINTS.session.getAll),
          {
            onSuccess: (data, set) => {
              if (data.status === "rejected") {
                set({ status: "none" });
              } else {
                set({
                  qrCodeId: data.sessionId,
                  status: data.status,
                });
              }
            },
          },
        ),
      };
    },
    {
      name: "session-storage",
    },
  ),
);
