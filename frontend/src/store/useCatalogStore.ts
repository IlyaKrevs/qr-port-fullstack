import { create } from "zustand";

import { createAsyncAction } from "./helpers/createAsyncAction";
import { fetchApi } from "@shared/utils/fetchApi";
import { ENDPOINTS } from "@globalShared/api/endpoints";
import type {
  IProduct,
  NormalizedCatalog,
} from "@globalShared/types/entities/Product.entity";

interface ICatalogState {
  items: IProduct[];
  normalizeItems: NormalizedCatalog;
  loading: boolean;
  error: null | string;
}

interface ICatalogMethods {
  fetchAll: () => void;
}

const initState: ICatalogState = {
  items: [],
  normalizeItems: {},
  loading: false,
  error: null,
};

type ICatalogStore = ICatalogState & ICatalogMethods;

export const useCatalogStore = create<ICatalogStore>()((set, get) => {
  const asyncAction = createAsyncAction<ICatalogStore>(set, get);
  return {
    ...initState,
    fetchAll: asyncAction<IProduct[], void>(
      () => fetchApi(ENDPOINTS.catalog.getAll),
      {
        onSuccess: (data, set) => {
          const normalize: NormalizedCatalog = data.reduce((acc, next) => {
            return { ...acc, [next.id]: next };
          }, {});
          set({ items: data, normalizeItems: normalize });
        },
      },
    ),
  };
});
