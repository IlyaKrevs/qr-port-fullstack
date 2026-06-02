import type { ICartItem } from "./Product.entity";

export interface IDefaultMessage {
  id: number;
  items: ICartItem[];
  qrCodeId: string;
  clientId: string;
  createdAt: string;
  status: "new" | "confirmed" | "completed" | "cancelled";
}

export interface IMessage extends IDefaultMessage {
  edited?: {
    by: string;
    at: string;
    prevVersion: IDefaultMessage;
  }[];
}
