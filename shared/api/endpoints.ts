// const API_BASE = "";
export const ENDPOINTS = {
  qrcodes: {
    getAll: "/api/qports",
    create: "/api/qports",
    delete: (id: number) => `/api/qports/${id}`,
    deleteServer: "/api/qports/:id",
  },
  catalog: {
    getAll: "/api/catalog",
  },
  orders: {
    getAll: "/api/orders",
    create: "/api/orders/create",
    decline: "/api/orders/decline",
  },
  tables: {
    list: "/api/tables",
  },
  auth: {
    login: "/api/auth",
  },
  session: {
    start: "/api/sessions/start",
    getAll: "api/sessions/getAll",
    close: `/api/sessions/close`,
  },
  defaultData: "/api/defaultData",
} as const;

type NestedPaths<T> = T extends string
  ? T
  : T extends (...args: any[]) => string
    ? ReturnType<T>
    : { [K in keyof T]: NestedPaths<T[K]> }[keyof T];

export type TypedApiEndpoints = NestedPaths<typeof ENDPOINTS>;
