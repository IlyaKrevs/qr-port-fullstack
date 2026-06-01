import { Outlet } from "react-router-dom";
import styles from "./ClientLayout.module.css";
import { AppNavLink } from "@shared/ui/components/AppNavLink/AppNavLink";
import type { TypedAppNavigation } from "@_routes/routes";
import { formatPrice } from "@shared/utils/formatPrice";

import { useOrderStore } from "@store/useOrderStore";
import { useCartStore } from "@store/useCartStore";

import {
  getFullCartData,
  getFullSessionData,
} from "@shared/utils/transformData";
import { useCatalogStore } from "@store/useCatalogStore";

interface IProps {
  links: TypedAppNavigation["client"];
}

export const ClientLayout: React.FC<IProps> = ({ links }) => {
  const orders = useOrderStore((s) => s.items);
  const cartItems = useCartStore((s) => s.items);

  const normalizedCatalog = useCatalogStore((s) => s.normalizeItems);
  const sessionData = getFullSessionData(orders, normalizedCatalog);
  const cartData = getFullCartData(cartItems, normalizedCatalog);

  return (
    <div className={styles.appWrapper}>
      <div className={styles.topStickyContainer}>
        <div className={styles.topStickyContainerInnerWrapper}>
          <div className={styles.navContainer}>
            {links.map((item) => {
              return (
                <AppNavLink key={item.name} to={item.path} end>
                  {item.name}
                </AppNavLink>
              );
            })}
          </div>
          <div className={styles.infoContainer}>
            <div>К оплате: {formatPrice(sessionData.price.toPay)}</div>
            <div className={styles.textCenter}>
              Ожидает подтверждения: {formatPrice(sessionData.price.await)}
            </div>
            <div className={styles.textRight}>
              Цена корзины: {formatPrice(cartData.totalPrice)}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
};
