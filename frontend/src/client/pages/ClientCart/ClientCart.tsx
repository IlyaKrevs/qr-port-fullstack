import styles from "./ClientCart.module.css";
import { useCartStore } from "@store/useCartStore";
import { AppButton } from "@shared/ui/components/AppButton/AppButton";
import { AppRoutes } from "../../../_routes/routes";
import { formatPrice } from "@shared/utils/formatPrice";
import { useNavigate } from "react-router-dom";

import { useOrderStore } from "@store/useOrderStore";
import { typedLocalStorage } from "@shared/utils/localStorage";

import { useCatalogStore } from "@store/useCatalogStore";
import {
  getFullCartData,
  getFullSessionData,
} from "@shared/utils/transformData";
import { OrderCardItem } from "@shared/ui/components/OrderCardItem/OrderCardItem";
import type { IMessage } from "@globalShared/types/entities/Order.entity";

export const ClientCart: React.FC = () => {
  const navigate = useNavigate();

  const normalizedCatalog = useCatalogStore((s) => s.normalizeItems);
  const cartItems = useCartStore((s) => s.items);

  const fullCartData = getFullCartData(cartItems, normalizedCatalog);

  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const setExistOrder = useCartStore((s) => s.setExistOrder);
  const createOrder = useOrderStore((s) => s.createOrder);
  const makeOrder = () => {
    const qrcode = typedLocalStorage.get("qrCodeId");
    const token = typedLocalStorage.get("userUniqData");
    if (!qrcode || !token || !cartItems.length) {
      return;
    }

    const order: IMessage = {
      id: Date.now(),
      clientId: token.userUniqId,
      qrCodeId: qrcode,
      status: "new",
      createdAt: Date.now() + "",
      items: cartItems,
    };
    createOrder(order);
    clearCart();
  };

  const orders = useOrderStore((s) => s.items);
  const declineOrder = useOrderStore((s) => s.declineOrder);
  const fullSessionData = getFullSessionData(orders, normalizedCatalog);
  const resetCartOrder = (id: number) => {
    const temp = orders.find((item) => item.id === id);
    if (!temp) {
      return;
    }
    setExistOrder(temp.items);
  };
  return (
    <div className={styles.container}>
      <div className={styles.orderContainer}>
        <div className="">
          {cartItems.length > 0 ? (
            <>Заказ на сумму: {formatPrice(fullCartData.totalPrice)}</>
          ) : (
            <>Корзина пуста</>
          )}
        </div>
        <div className={styles.cartContainer}>
          {fullCartData.items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.cartItemControls}>
                <AppButton onClick={() => updateQuantity(item.id, -1)}>
                  -
                </AppButton>
                <div className={styles.quantity}>{item.quantity}</div>
                <AppButton onClick={() => updateQuantity(item.id, 1)}>
                  +
                </AppButton>
                <div className={styles.totalPrice}>
                  {item.price} * {item.quantity} ={" "}
                  {formatPrice(item.price * item.quantity)}
                </div>
                <AppButton onClick={() => removeItem(item.id)} color="danger">
                  X
                </AppButton>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.btnsContainer}>
          {cartItems.length > 0 && (
            <AppButton color="success" onClick={makeOrder}>
              Отправить заказ
            </AppButton>
          )}
          <AppButton
            color="secondary"
            onClick={() => navigate(AppRoutes.client.main)}
          >
            Вернуться в меню
          </AppButton>
        </div>
      </div>
      {fullSessionData.items.length > 0 && (
        <div className={styles.historyConatiner}>
          <div className={styles.historyTitle}>HISTORY:</div>
          {fullSessionData.items.reverse().map((item) => {
            return (
              <OrderCardItem
                key={item.id}
                data={item}
                declineClick={declineOrder}
                resetCartClick={resetCartOrder}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
