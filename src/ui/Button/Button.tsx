import NextLink from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type BaseProps = {
  /** Figma: `Variant`. primary = Cerezo, one main action per view. */
  variant?: "primary" | "secondary" | "ghost";
  /** Figma: `Size` (m 40 / s 32). */
  size?: "m" | "s";
  /** Figma: `LeadingIcon` (omit to hide). */
  leadingIcon?: ReactNode;
  /** Figma: `TrailingIcon` (omit to hide). */
  trailingIcon?: ReactNode;
  /** Figma: `Label`. */
  children: ReactNode;
  className?: string;
};

export type ButtonProps = BaseProps &
  (
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>)
    | { href: string; disabled?: boolean; target?: string; rel?: string }
  );

/** Action. Renders a <button>, or a link when `href` is set. */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "m", leadingIcon, trailingIcon, children, className } = props;
  const cls = className ? `${styles.button} ${className}` : styles.button;
  const content = (
    <>
      {leadingIcon && (
        <span className={styles.icon} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span>{children}</span>
      {trailingIcon && (
        <span className={styles.icon} aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, disabled, target, rel } = props;
    if (disabled) {
      return (
        <span className={cls} data-variant={variant} data-size={size} aria-disabled="true">
          {content}
        </span>
      );
    }
    return (
      <NextLink
        href={href}
        target={target}
        rel={rel}
        className={cls}
        data-variant={variant}
        data-size={size}
      >
        {content}
      </NextLink>
    );
  }

  const {
    variant: _v,
    size: _s,
    leadingIcon: _l,
    trailingIcon: _t,
    children: _c,
    className: _cn,
    href: _h,
    type = "button",
    ...rest
  } = props;
  return (
    <button type={type} className={cls} data-variant={variant} data-size={size} {...rest}>
      {content}
    </button>
  );
}
