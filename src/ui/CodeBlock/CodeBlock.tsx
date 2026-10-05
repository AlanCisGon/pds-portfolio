"use client";

import { Check, Copy } from "iconoir-react";
import { useEffect, useState } from "react";
import styles from "./CodeBlock.module.css";

export type CodeBlockProps = {
  code: string;
  /** Shown in the header, e.g. "TSX". */
  language?: string;
};

/** Code in case studies and the lab. Copy confirms with aria-live (no Toast). */
export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure className={styles.block}>
      <figcaption className={styles.header}>
        <span className={styles.meta}>{language}</span>
        <button
          type="button"
          className={styles.copy}
          onClick={copy}
          data-copied={copied || undefined}
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          <span className={styles.icon} aria-hidden="true">
            {copied ? <Check /> : <Copy />}
          </span>
          <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
        </button>
        <span className={styles.status} role="status" aria-live="polite">
          {copied ? "Code copied" : ""}
        </span>
      </figcaption>
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
