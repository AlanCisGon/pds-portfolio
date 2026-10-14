"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "../Link";
import { VisuallyHidden } from "../VisuallyHidden";
import styles from "./ArticleCTA.module.css";

export type ArticleCTAProps = {
  /** contact while there is one article; next once there are two or more. */
  variant: "contact" | "next";
  /** Heading S. contact: the question; next: "Next note". */
  heading: string;
  /** Optional line under the heading. */
  body?: string;
  /** Primary link. contact: mailto; next: the next article. */
  href: string;
  /** Primary link label ("Write to me" or the next title). */
  label: string;
  /** Secondary link: share on LinkedIn. */
  share: { href: string; label: string };
};

type Reveal = "idle" | "pending" | "done";

/** ArticleCTA · molecule. The peak of the reading flow: settles in once, never loops.
 *  Progressive: visible without JS, with reduced motion, or as soon as it gets focus. */
export function ArticleCTA({ variant, heading, body, href, label, share }: ArticleCTAProps) {
  const ref = useRef<HTMLElement>(null);
  const [reveal, setReveal] = useState<Reveal>("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight) return; // already on screen: no entrance
    setReveal("pending");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReveal("done");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    const onFocus = () => {
      setReveal("done");
      observer.disconnect();
    };
    node.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect();
      node.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <section
      ref={ref}
      className={styles.cta}
      data-variant={variant}
      data-reveal={reveal === "idle" ? undefined : reveal}
      aria-label={heading}
    >
      <p className={styles.heading} style={{ "--i": 0 } as React.CSSProperties}>
        {heading}
      </p>
      {body && (
        <p className={styles.body} style={{ "--i": 1 } as React.CSSProperties}>
          {body}
        </p>
      )}
      <div className={styles.actions} style={{ "--i": 2 } as React.CSSProperties}>
        <Link href={href} kind="standalone" external={false}>
          {label}
        </Link>
        <a href={share.href} className={styles.share} target="_blank" rel="noopener noreferrer">
          {share.label}
          <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
        </a>
      </div>
    </section>
  );
}
