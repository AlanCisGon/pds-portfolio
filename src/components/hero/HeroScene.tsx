"use client";

import { useEffect, useRef } from "react";

/**
 * Exploded view of a digital product, drawn with three.js. Purely decorative: the canvas is
 * hidden from assistive tech and loads after first paint, so the headline stays the LCP.
 */
export function HeroScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import("./scene").then(({ mountScene }) => {
      if (!cancelled) dispose = mountScene(host);
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
