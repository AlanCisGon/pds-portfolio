"use client";

import { Link as LinkIcon } from "iconoir-react";
import { type ReactNode, useEffect, useState } from "react";
import styles from "./HeadingLink.module.css";

export type HeadingLinkProps = {
  /** Section anchor id. */
  id: string;
  /** Figma: `Heading`. */
  children: ReactNode;
  as?: "h2" | "h3" | "h4";
};

/** Section heading with a copy-link anchor. The icon shows on hover/focus; confirmation via aria-live. */
export function HeadingLink({ id, children, as: Tag = "h2" }: HeadingLinkProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      window.history.replaceState(null, "", `#${id}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Tag id={id} className={styles.heading}>
      <span>{children}</span>
      <button type="button" className={styles.anchor} onClick={copy} aria-label="Copiar enlace a la sección">
        <span className={styles.icon} aria-hidden="true">
          <LinkIcon />
        </span>
      </button>
      <span className={styles.status} role="status" aria-live="polite">
        {copied ? "Enlace copiado" : ""}
      </span>
    </Tag>
  );
}
