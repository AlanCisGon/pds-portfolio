import NextLink from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.css";

type BaseProps = {
  /** Figma: `Icon` — an Iconoir element. */
  icon: ReactNode;
  /** Accessible name and tooltip. Required: there is no visible text. */
  label: string;
  /** Figma: `Variant`. */
  variant?: "secondary" | "ghost";
  /** Figma: `Size` (m 40 / s 32, both ≥ 24×24 target). */
  size?: "m" | "s";
  className?: string;
};

export type IconButtonProps = BaseProps &
  (
    | ({ href?: undefined } & Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        keyof BaseProps | "children"
      >)
    | { href: string; external?: boolean }
  );

/** Icon-only action (social links, carousel, copy, close). */
export function IconButton(props: IconButtonProps) {
  const { icon, label, variant = "secondary", size = "m", className } = props;
  const cls = className ? `${styles.iconButton} ${className}` : styles.iconButton;
  const glyph = (
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
  );

  if (props.href !== undefined) {
    const external = props.external ?? /^https?:|^mailto:/.test(props.href);
    return (
      <NextLink
        href={props.href}
        className={cls}
        data-variant={variant}
        data-size={size}
        aria-label={label}
        title={label}
        {...(external && !props.href.startsWith("mailto:")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {glyph}
      </NextLink>
    );
  }

  const {
    icon: _i,
    label: _l,
    variant: _v,
    size: _s,
    className: _c,
    href: _h,
    type = "button",
    ...rest
  } = props;
  return (
    <button
      type={type}
      className={cls}
      data-variant={variant}
      data-size={size}
      aria-label={label}
      title={label}
      {...rest}
    >
      {glyph}
    </button>
  );
}
