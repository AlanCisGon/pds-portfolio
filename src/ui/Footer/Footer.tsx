import type { ReactNode } from "react";
import { IconButton } from "../IconButton";
import { Link } from "../Link";
import styles from "./Footer.module.css";

export type FooterProps = {
  /** e.g. "© 2026 Alan Cisneros · Culiacán, México". */
  signature: string;
  /** Brand signature page: materials, decisions, versions and team. */
  colophonHref: string;
  social: Array<{ href: string; label: string; icon: ReactNode }>;
};

/** Site footer: signature + colophon, social links. The only structural line of the site (1 px on top). */
export function Footer({ signature, colophonHref, social }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.signature}>
        <p className={styles.text}>{signature}</p>
        <Link href={colophonHref} kind="standalone">
          Colofón
        </Link>
      </div>
      <ul className={styles.social}>
        {social.map((s) => (
          <li key={s.href}>
            <IconButton href={s.href} icon={s.icon} label={s.label} variant="ghost" />
          </li>
        ))}
      </ul>
    </footer>
  );
}
