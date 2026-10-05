"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { NavItem } from "../NavItem";
import styles from "./Header.module.css";

export type HeaderProps = {
  items: Array<{ href: string; label: string; icon: ReactNode }>;
  /** Shown on the left (desktop), e.g. "América/Mazatlán". */
  location: string;
  /** IANA time zone for the local clock on the right. */
  timeZone: string;
};

function useClock(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
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

/** Site header: location · pill navigation · local time. No theme toggle (dark only). */
export function Header({ items, location, timeZone }: HeaderProps) {
  const pathname = usePathname();
  const time = useClock(timeZone);
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className={styles.header}>
      <p className={styles.location}>{location}</p>
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
      <p className={styles.time}>
        <time>{time ?? "--:--"}</time>
      </p>
    </header>
  );
}
