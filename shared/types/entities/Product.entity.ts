type ProductMustHave = { id: number };

// Содежримое корзины - изменяется в зависимости от бизнеса
export type ICartItem = ProductMustHave & {
  quantity: number;
};
// Карточка продукта - изменяется в зависимости от бизнеса
export type IProduct = ProductMustHave & {
  name: string;
  price: number;
  description: string;
};

export type NormalizedCatalog = Record<string, IProduct>;
