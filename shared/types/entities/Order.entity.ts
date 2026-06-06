import { ISession } from "./Session.entity";
import type { ICartItem } from "./Product.entity";

export interface IDefaultOrder {
  id: number;
  sessionId: ISession["id"];
  userUniqId: string;
  createdAt: number;
  status: "new" | "confirmed" | "completed" | "cancelled";
  items: ICartItem[];
}

export interface IOrder extends IDefaultOrder {
  edited?: {
    by: string;
    at: string;
    prevVersion: IDefaultOrder;
  }[];
}



