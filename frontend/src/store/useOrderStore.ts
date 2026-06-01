import { create } from "zustand";
import { fetchApi } from "@shared/utils/fetchApi";
import { createAsyncAction } from "./helpers/createAsyncAction";

import { ENDPOINTS } from "@globalShared/api/endpoints";
import type { IMessage } from "@globalShared/types/entities/Order.entity";

interface IOrderState {
  items: IMessage[];
  loading: boolean;
  error: null | string;
}

interface IOrderMethods {
  createOrder: (item: IMessage) => void;
  fetchAll: (data: { qrCodeId: string }) => void;
  declineOrder: (id: number) => void;
}

const initState: IOrderState = {
  items: [],
  loading: false,
  error: null,
};

type IOrderStore = IOrderState & IOrderMethods;

export const useOrderStore = create<IOrderStore>()((set, get) => {
  const asyncAction = createAsyncAction<IOrderStore>(set, get);

  return {
    ...initState,
    createOrder: asyncAction<IMessage, IMessage>(
      (item) =>
        fetchApi(ENDPOINTS.orders.create, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }),
      {
        onSuccess: (data, set, get) => {
          const currentItems = get().items;
          set({ items: [...currentItems, data] });
        },
      },
    ),
    fetchAll: asyncAction<IMessage[], { qrCodeId: string }>(
      (data) =>
        fetchApi(ENDPOINTS.orders.getAll, {
          method: "POST",
          body: JSON.stringify({ qrCodeId: data.qrCodeId }),
        }),
      {
        onSuccess: (data, set) => set({ items: data }),
      },
    ),
    declineOrder: asyncAction<IMessage, number>(
      (id) =>
        fetchApi(ENDPOINTS.orders.decline, {
          method: "PATCH",
          body: JSON.stringify({ id }),
        }),
      {
        onSuccess: (data, set, get) => {
          const newItems: IMessage[] = get().items.map((item) =>
            item.id === data.id ? data : item,
          );
          set({ items: newItems });
        },
      },
    ),
  };
});
