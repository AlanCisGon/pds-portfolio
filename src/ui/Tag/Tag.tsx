import type { ReactNode } from "react";
import styles from "./Tag.module.css";

export type TagProps = {
  /** Visible text (Figma: `Label`). */
  children: ReactNode;
  /** Figma: `Size` = Medium | Small. */
  size?: "medium" | "small";
  /** Figma: `LeadingIcon` — an Iconoir or Simple Icons element. Omit to hide (Figma: `showLeadingIcon`). */
  leadingIcon?: ReactNode;
  className?: string;
};

/** Informative tag. Not interactive — for filters or removable items use Chip. */
export function Tag({ children, size = "medium", leadingIcon, className }: TagProps) {
  return (
    <span className={className ? `${styles.tag} ${className}` : styles.tag} data-size={size}>
      {leadingIcon && (
        <span className={styles.icon} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
    </span>
  );
}
