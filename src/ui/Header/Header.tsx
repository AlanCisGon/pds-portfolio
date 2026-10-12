"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { NavItem } from "../NavItem";
import styles from "./Header.module.css";

export type HeaderProps = {
  items: Array<{ href: string; label: string; icon: ReactNode }>;
  /** Optional, shown on the left (desktop). The site leaves it empty: location lives in the colophon. */
  location?: string;
  /** Optional IANA time zone for a local clock on the right. Omit it for no clock. */
  timeZone?: string;
  /** Paths where the nav stays hidden until the reader scrolls past the first screen (e.g. a full-bleed hero). */
  revealAfterFoldOn?: string[];
};

function useClock(timeZone?: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    if (!timeZone) return;
    const fmt = new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

/** Hidden while the reader scrolls down, back as soon as they scroll up (or reach the top).
 *  With a fold-gated nav, it first stays visible for a stretch after the fold, so passing it reveals the nav. */
function useHideOnScroll(foldGated: boolean) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return; // ignore jitter
      const start = foldGated ? window.innerHeight * 0.85 + 480 : 80;
      setHidden(y > last && y > start);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [foldGated]);
  return hidden;
}

/** True while the page is still on its first screen (above the fold). */
function useAboveFold(enabled: boolean) {
  // Starts true so a fold-hidden nav never flashes on first paint.
  const [above, setAbove] = useState(true);
  useEffect(() => {
    const onScroll = () => setAbove(window.scrollY < window.innerHeight * 0.85);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return enabled && above;
}

/** Site header: pill navigation, centered. Optional location and clock on the sides (empty cells keep the nav centered). */
export function Header({ items, location, timeZone, revealAfterFoldOn }: HeaderProps) {
  const pathname = usePathname();
  const time = useClock(timeZone);
  const foldGated = !!pathname && !!revealAfterFoldOn?.includes(pathname);
  const hiddenOnScroll = useHideOnScroll(foldGated);
  const aboveFold = useAboveFold(foldGated);
  const hidden = hiddenOnScroll || aboveFold;
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className={styles.header} data-hidden={hidden || undefined}>
      <p className={styles.location}>{location ?? ""}</p>
      <nav aria-label="Main">
        <ul className={styles.nav}>
          {items.map((item) => (
            <li key={item.href}>
              <NavItem
                href={item.href}
                label={item.label}
                icon={item.icon}
                selected={isCurrent(item.href)}
                compactOnMobile
              />
            </li>
          ))}
        </ul>
      </nav>
      <p className={styles.time}>{timeZone && <time>{time ?? "--:--"}</time>}</p>
    </header>
  );
}
