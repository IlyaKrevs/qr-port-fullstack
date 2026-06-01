import styles from "./AppButton.module.css";

type ButtonColors = "primary" | "secondary" | "success" | "danger";

interface AppButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: ButtonColors;
}

const colorsDictionary: Record<ButtonColors, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  success: styles.success,
  danger: styles.danger,
};

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  onClick,
  color = "primary",
}) => {
  const colors = colorsDictionary[color];

  return (
    <button className={[styles.button, colors].join(" ")} onClick={onClick}>
      {children}
    </button>
  );
};
