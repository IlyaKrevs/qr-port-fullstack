export const AppRoutes = {
  admin: {
    main: "/admin",
    qports: "/admin/qports",
    catalog: "/admin/catalog",
  },
  client: {
    main: "/client",
    cart: "/client/cart",
  },
};

export const AppNavigaions = {
  admin: [
    { name: "Заказы", path: AppRoutes.admin.main },
    { name: "Q-Ports", path: AppRoutes.admin.qports },
    { name: "Каталог", path: AppRoutes.admin.catalog },
  ],
  client: [
    { name: "Меню", path: AppRoutes.client.main },
    { name: "Корзина", path: AppRoutes.client.cart },
  ],
} as const;

export type TypedAppNavigation = typeof AppNavigaions;
