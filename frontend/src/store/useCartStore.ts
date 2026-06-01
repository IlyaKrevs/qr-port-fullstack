import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ICartItem } from "@globalShared/types/entities/Product.entity";

interface ICartState {
  items: ICartItem[];
}

interface ICartMethods {
  addItem: (id: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setExistOrder: (data: ICartItem[]) => void;
}

const initState: ICartState = {
  items: [],
};

type ICartStore = ICartState & ICartMethods;

export const useCartStore = create<ICartStore>()(
  persist(
    (set, get) => ({
      ...initState,
      addItem: (id) => {
        const items = get().items;
        const exist = items.find((i) => i.id === id);

        const newItems = (() => {
          if (exist) {
            return items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
            );
          } else {
            return [...items, { id, quantity: 1 }];
          }
        })();
        set({
          items: newItems.sort((a, b) => a.id - b.id),
        });
      },
      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        set({
          items: newItems,
        });
      },
      updateQuantity: (id, quantity) => {
        const newItems = (() => {
          const newArr = get().items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + quantity } : i,
          );
          return newArr.filter((i) => i.quantity > 0);
        })();
        set({
          items: newItems,
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
      setExistOrder: (data) => {
        set({
          items: [...data].sort((a, b) => a.id - b.id),
        });
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);

