import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
}
