import type { ReactNode } from "react";
import { Avatar } from "../Avatar";
import styles from "./TeamCard.module.css";

export type TeamCardProps = {
  /** Figma: `Name`. */
  name: string;
  /** Figma: `Role`. Plain text, never Cerezo: the card is not interactive. */
  role: string;
  /** Figma: `Description`. */
  children: ReactNode;
  /** Photo or illustration. Falls back to initials. */
  avatarSrc?: string;
  initials?: string;
  /** Figma: `Layout`. horizontal = avatar beside the text; vertical = avatar on top. */
  layout?: "horizontal" | "vertical";
};

/** Static team member card · Figma 02e Cards & Site (83:152). The name is visible, so the avatar is decorative. */
export function TeamCard({
  name,
  role,
  children,
  avatarSrc,
  initials,
  layout = "horizontal",
}: TeamCardProps) {
  return (
    <div className={styles.card} data-layout={layout}>
      <Avatar size="l" src={avatarSrc} name={name} initials={initials} decorative />
      <div className={styles.text}>
        <p className={styles.name}>{name}</p>
        <p className={styles.role}>{role}</p>
        <p className={styles.description}>{children}</p>
      </div>
    </div>
  );
}
