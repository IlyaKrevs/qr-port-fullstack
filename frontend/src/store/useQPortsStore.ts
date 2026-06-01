import { create } from "zustand";
import { fetchApi } from "@shared/utils/fetchApi";
import { createAsyncAction } from "./helpers/createAsyncAction";

import { ENDPOINTS } from "@globalShared/api/endpoints";
import type { IQRcodeItem } from "@globalShared/types/entities/Qport.entity";

interface IQPortsState {
  items: IQRcodeItem[];
  loading: boolean;
  error: null | string;
}

interface IQportMethods {
  fetchAll: () => Promise<void>;
  addPort: (name: string) => Promise<void>;
  deletePort: (id: number) => Promise<void>;
}

const initState: IQPortsState = {
  items: [],
  loading: false,
  error: null,
};

type IQPortsStore = IQPortsState & IQportMethods;

export const useQPortsStore = create<IQPortsStore>()((set, get) => {
  const asyncAction = createAsyncAction<IQPortsStore>(set, get);
  return {
    ...initState,
    fetchAll: asyncAction<IQRcodeItem[], void>(
      () => fetchApi(ENDPOINTS.qrcodes.getAll),
      {
        onSuccess: (data, set) => set({ items: data }),
      },
    ),
    addPort: asyncAction<IQRcodeItem, string>(
      (name) =>
        fetchApi(ENDPOINTS.qrcodes.create, {
          method: "POST",
          body: JSON.stringify({ name }),
        }),
      {
        onSuccess: (data, set, get) => {
          const curItems = get().items;
          set({ items: [...curItems, data] });
        },
      },
    ),
    deletePort: asyncAction<Pick<IQRcodeItem, "id">, number>(
      (id) =>
        fetchApi(ENDPOINTS.qrcodes.delete(id), {
          method: "DELETE",
        }).then(() => ({ id })),
      {
        onSuccess: (data, set, get) => {
          const newItems = get().items.filter((i) => i.id !== data.id);
          set({ items: newItems });
        },
      },
    ),
  };
});
