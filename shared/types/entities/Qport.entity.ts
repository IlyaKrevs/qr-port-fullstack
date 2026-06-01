import type { IMessage } from "./Order.entity";

export interface IQPort {
  id: string;
  status: "open" | "private";
  role: "admin" | "guest";
  users: string[];
  messages: IMessage[];
  createdAt: string;
}

export interface IQRcodeItem {
  id: number;
  name: string;
  qrDataUrl: string;
}
