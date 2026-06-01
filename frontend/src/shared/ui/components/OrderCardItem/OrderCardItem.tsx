import styles from "./OrderCardItem.module.css";
import { formatPrice } from "@shared/utils/formatPrice";
import {
  extractClientName,
  type OrderWithFullData,
} from "@shared/utils/transformData";
import { AppButton } from "../AppButton/AppButton";

interface OrderCardItemProps {
  data: OrderWithFullData;
  declineClick: (id: number) => void;
  resetCartClick: (id: number) => void;
}

export const OrderCardItem: React.FC<OrderCardItemProps> = ({
  data,
  declineClick,
  resetCartClick,
}) => {
  const currentBtn = (() => {
    if (data.status === "new") {
      return (
        <AppButton color="danger" onClick={() => declineClick(data.id)}>
          Отменить
        </AppButton>
      );
    } else {
      return (
        <AppButton onClick={() => resetCartClick(data.id)}>
          Восстановить в корзину
        </AppButton>
      );
    }
  })();

  return (
    <div className={styles.orderItem}>
      <div className={styles.orderTitle}>
        <div className={styles.clientName}>
          Заказ от {extractClientName(data.clientId)}
        </div>
        <div className={styles.tableCode}>{data.qrCodeId}</div>
        <div
          className={`${styles.status} ${styles[`status${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`]}`}
        >
          {data.status === "new" && "🆕 Новый"}
          {data.status === "confirmed" && "✅ Подтверждён"}
          {data.status === "completed" && "✔️ Выполнен"}
          {data.status === "cancelled" && "❌ Отменён"}
        </div>
        <div className={styles.date}>
          {new Date(+data.createdAt).toLocaleString()}
        </div>
      </div>

      <div className={styles.orderContent}>
        {data.items.items.map((innerItem, i) => (
          <div key={i} className={styles.orderItemRow}>
            <div className={styles.itemName}>
              {i + 1}
              {")"} {innerItem.name}
            </div>
            <div className={styles.itemQuantity}>{innerItem.quantity} шт</div>
          </div>
        ))}
      </div>

      <div className={styles.controlsContainer}>
        {currentBtn}
        <div className={styles.priceSummary}>
          Итого: {formatPrice(data.items.totalPrice)}
        </div>
      </div>
    </div>
  );
};
