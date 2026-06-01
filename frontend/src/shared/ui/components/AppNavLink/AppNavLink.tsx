import styles from "./AppNavLink.module.css";
import { NavLink, type NavLinkProps } from "react-router-dom";

interface AppNavLinkProps extends NavLinkProps {
  children: React.ReactNode;
}

export const AppNavLink: React.FC<AppNavLinkProps> = ({
  children,
  ...props
}) => {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        [styles.link, isActive ? styles.active : ""].join(" ")
      }
    >
      {children}
    </NavLink>
  );
};
