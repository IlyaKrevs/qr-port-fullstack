import type { IProduct } from "@globalShared/types/entities/Product.entity";
import styles from "./ClientCatalogItem.module.css";
import { AppButton } from "@shared/ui/components/AppButton/AppButton";
import { formatPrice } from "@shared/utils/formatPrice";
import { memo } from "react";

interface ClientCatalogItemProps extends IProduct {
  onClick?: (id: number) => void;
}

export const ClientCatalogItem: React.FC<ClientCatalogItemProps> = memo(
  ({ id, name, description, price, onClick }) => {
    return (
      <div key={id} className={styles.container}>
        <div className={styles.title}>
          <div>{name}</div>
          <div>{formatPrice(price)}</div>
        </div>
        <p className={styles.description}>{description}</p>
        {onClick && (
          <AppButton onClick={() => onClick(id)}>Добавить в заказ</AppButton>
        )}
      </div>
    );
  },
);
