import NextLink from "next/link";
import type { ReactNode } from "react";
import styles from "./NavItem.module.css";

export type NavItemProps = {
  href: string;
  /** Figma: `Label`. Always the accessible name, even when hidden. */
  label: string;
  /** Figma: `Icon` — an Iconoir element. */
  icon: ReactNode;
  /** Figma: `Selected` — the current page (aria-current="page", Cerezo icon). */
  selected?: boolean;
  /** Figma: `showLabel`. false = icon only (aria-label keeps the name). */
  showLabel?: boolean;
  /** Icon only below 768 px (label stays available to assistive technology). */
  compactOnMobile?: boolean;
};

/** Main navigation item in the Header. */
export function NavItem({
  href,
  label,
  icon,
  selected = false,
  showLabel = true,
  compactOnMobile = false,
}: NavItemProps) {
  return (
    <NextLink
      href={href}
      className={styles.navItem}
      data-selected={selected || undefined}
      aria-current={selected ? "page" : undefined}
      aria-label={showLabel ? undefined : label}
      title={showLabel ? undefined : label}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      {showLabel && (
        <span className={styles.label} data-compact={compactOnMobile || undefined}>
          {label}
        </span>
      )}
    </NextLink>
  );
}
