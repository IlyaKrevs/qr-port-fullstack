import type { ICartItem } from "./Product.entity";

export interface IDefaultOrder {
  id: number;
  items: ICartItem[];
  qrCodeId: string;
  clientId: string;
  createdAt: string;
  status: "new" | "confirmed" | "completed" | "cancelled";
}

export interface IOrder extends IDefaultOrder {
  edited?: {
    by: string;
    at: string;
    prevVersion: IDefaultOrder;
  }[];
}
