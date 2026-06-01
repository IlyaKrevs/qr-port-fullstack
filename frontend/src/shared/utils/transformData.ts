import type { IDefaultOrder } from "@globalShared/types/entities/Order.entity";
import type {
  ICartItem,
  IProduct,
  NormalizedCatalog,
} from "@globalShared/types/entities/Product.entity";

type FullCartData = {
  totalPrice: number;
  items: (ICartItem & IProduct)[];
};

export function getFullCartData(
  arr: ICartItem[],
  normalize: NormalizedCatalog,
): FullCartData {
  const temp: FullCartData = arr.reduce(
    (acc, next) => {
      const newItem = { ...next, ...normalize[next.id] };

      acc.items.push(newItem);
      acc.totalPrice += newItem.price * newItem.quantity;
      return acc;
    },
    {
      items: [],
      totalPrice: 0,
    } as FullCartData,
  );

  return temp;
}

export type OrderWithFullData = Omit<IDefaultOrder, "items"> & {
  items: FullCartData;
};

type FullSessionData = {
  items: OrderWithFullData[];
  price: {
    toPay: number;
    await: number;
  };
};

const dictionary: Record<
  Exclude<IDefaultOrder["status"], "cancelled">,
  keyof FullSessionData["price"]
> = {
  new: "await",
  confirmed: "toPay",
  completed: "toPay",
};

export function getFullSessionData(
  arr: IDefaultOrder[],
  normalize: NormalizedCatalog,
): FullSessionData {
  return arr.reduce(
    (acc, next) => {
      const orderCartData = getFullCartData(next.items, normalize);
      acc.items.push({
        ...next,
        items: orderCartData,
      });

      if (next.status !== "cancelled") {
        const targetKey = dictionary[next.status];
        acc.price[targetKey] = acc.price[targetKey] + orderCartData.totalPrice;
      }

      return acc;
    },
    {
      items: [],
      price: {
        toPay: 0,
        await: 0,
      },
    } as FullSessionData,
  );
}

type needFor = "client" | "admin";
export function extractClientName(
  clientId: string,
  needFor: needFor = "client",
): string {
  const temp = needFor === "client" ? "_" : "-";
  const index = clientId.indexOf(temp);
  if (index === -1) {
    return "Invalid clientName format";
  }
  return clientId.slice(0, index);
}
