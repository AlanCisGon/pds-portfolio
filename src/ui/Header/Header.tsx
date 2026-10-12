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

/** Hidden while the reader scrolls down, back as soon as they scroll up (or reach the top). */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return; // ignore jitter
      setHidden(y > last && y > 80);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

/** Site header: pill navigation, centered. Optional location and clock on the sides (empty cells keep the nav centered). */
export function Header({ items, location, timeZone }: HeaderProps) {
  const pathname = usePathname();
  const time = useClock(timeZone);
  const hidden = useHideOnScroll();
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
