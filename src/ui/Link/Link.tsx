import { ArrowRight, OpenNewWindow } from "iconoir-react";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { VisuallyHidden } from "../VisuallyHidden";
import styles from "./Link.module.css";

export type LinkProps = {
  href: string;
  /** Figma: `Label`. */
  children: ReactNode;
  /** Figma: `Kind`. inline = inside a paragraph; standalone = loose link with a trailing icon. */
  kind?: "inline" | "standalone";
  /** Opens in a new tab with the OpenNewWindow icon and an announcement. Defaults to true for http(s) URLs. */
  external?: boolean;
  /** Figma: `TrailingIcon` (standalone only). Defaults to ArrowRight, or OpenNewWindow when external. */
  trailingIcon?: ReactNode;
  className?: string;
};

/** Navigation link in Cerezo (5.68:1 on page). Avoid on bg-elevated (4.58:1). */
export function Link({ href, children, kind = "inline", external, trailingIcon, className }: LinkProps) {
  const isExternal = external ?? /^https?:/.test(href);
  const cls = className ? `${styles.link} ${className}` : styles.link;
  const icon = trailingIcon ?? (isExternal ? <OpenNewWindow /> : <ArrowRight />);
  return (
    <NextLink
      href={href}
      className={cls}
      data-kind={kind}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {kind === "standalone" && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {isExternal && <VisuallyHidden> (abre en otra pestaña)</VisuallyHidden>}
    </NextLink>
  );
}
