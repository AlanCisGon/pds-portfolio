import Image from "next/image";
import styles from "./Avatar.module.css";

const SIZES = { s: 24, m: 32, l: 48 } as const;

export type AvatarProps = {
  /** Figma: `Size` (s 24 / m 32 / l 48). */
  size?: keyof typeof SIZES;
  /** Photo. Falls back to initials when absent. */
  src?: string;
  /** Person's name: alt text for the photo and source of the initials. Use alt="" when the name is visible next to it. */
  name: string;
  /** Set when the name is already visible next to the avatar. */
  decorative?: boolean;
  /** Figma: `Initials`. Defaults to the first letters of `name`. */
  initials?: string;
};

export function Avatar({ size = "m", src, name, decorative = false, initials }: AvatarProps) {
  const px = SIZES[size];
  const text =
    initials ??
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  return (
    <span
      className={styles.avatar}
      data-size={size}
      role={src ? undefined : "img"}
      aria-label={src || decorative ? undefined : name}
      aria-hidden={decorative && !src ? true : undefined}
    >
      {src ? (
        <Image src={src} alt={decorative ? "" : name} width={px} height={px} className={styles.image} />
      ) : (
        <span aria-hidden="true">{text}</span>
      )}
    </span>
  );
}
