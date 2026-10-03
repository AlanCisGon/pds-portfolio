import { Avatar } from "../Avatar";
import styles from "./AvatarGroup.module.css";

export type AvatarGroupProps = {
  /** Team of a case study. Shows up to 3 and a "+N" for the rest. */
  people: Array<{ name: string; src?: string }>;
  max?: number;
};

export function AvatarGroup({ people, max = 3 }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <ul className={styles.group} aria-label="Equipo">
      {shown.map((p) => (
        <li key={p.name} className={styles.item}>
          <Avatar name={p.name} src={p.src} size="m" />
        </li>
      ))}
      {rest > 0 && (
        <li className={`${styles.item} ${styles.rest}`} aria-label={`y ${rest} más`}>
          +{rest}
        </li>
      )}
    </ul>
  );
}
