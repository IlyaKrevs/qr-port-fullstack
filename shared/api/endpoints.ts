// const API_BASE = "";
export const ENDPOINTS = {
  qrPorts: {
    getAll: "/api/qrports",
    create: "/api/qrports",
    deleteClient: (id: number) => `/api/qrports/${id}`,
    deleteServer: "/api/qrports/:id",
  },
  catalog: {
    getAll: "/api/catalog",
  },
  orders: {
    getAll: "/api/orders",
    create: "/api/orders/create",
    changeStatus: "/api/orders/changeStatus",
  },
  // delete it?
  // tables: {
  //   list: "/api/tables",
  // },
  // auth: {
  //   login: "/api/auth",
  // },
  sessions: {
    start: "/api/sessions/start",
    getAllActive: "api/sessions/getAllActive",
    close: "/api/sessions/close",
  },
  defaultData: "/api/defaultData",
} as const;

type NestedPaths<T> = T extends string
  ? T
  : T extends (...args: any[]) => string
    ? ReturnType<T>
    : { [K in keyof T]: NestedPaths<T[K]> }[keyof T];

export type TypedApiEndpoints = NestedPaths<typeof ENDPOINTS>;
