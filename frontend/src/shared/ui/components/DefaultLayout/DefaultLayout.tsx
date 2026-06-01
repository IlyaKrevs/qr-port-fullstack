import { Outlet } from "react-router-dom";
import styles from "./DefaultLayout.module.css";
import type { TypedAppNavigation } from "@_routes/routes";
import { AppNavLink } from "../AppNavLink/AppNavLink";

interface IProps {
  links: TypedAppNavigation["admin"];
}

export const DefaultLayout: React.FC<IProps> = ({ links }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.navContainer}>
          {links.map((item) => {
            return (
              <AppNavLink key={item.name} to={item.path} end>
                {item.name}
              </AppNavLink>
            );
          })}
        </div>
        <Outlet />
      </div>
    </div>
  );
};
