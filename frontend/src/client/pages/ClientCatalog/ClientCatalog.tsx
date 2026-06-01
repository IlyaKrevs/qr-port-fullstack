import styles from "./ClientCatalog.module.css";
import { useCartStore } from "@store/useCartStore";
import { ClientCatalogItem } from "@client/components/ClientCatalogItem/ClientCatalogItem";

import { useCatalogStore } from "@store/useCatalogStore";

interface ClientCatalogProps {
  children?: React.ReactNode;
}

export const ClientCatalog: React.FC<ClientCatalogProps> = () => {
  const catalogItems = useCatalogStore((s) => s.items);

  const addItem = useCartStore((s) => s.addItem);

  if (!catalogItems) {
    return <>HELLO</>;
  }

  return (
    <div className={styles.container}>
      {catalogItems.map((item) => {
        return <ClientCatalogItem key={item.id} {...item} onClick={addItem} />;
      })}
    </div>
  );
};
