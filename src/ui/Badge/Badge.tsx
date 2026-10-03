import { CheckCircle, InfoCircle, WarningTriangle, XmarkCircle } from "iconoir-react";
import type { ReactNode } from "react";
import styles from "./Badge.module.css";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export const statusIcons: Record<StatusTone, ReactNode> = {
  neutral: <InfoCircle />,
  info: <InfoCircle />,
  success: <CheckCircle />,
  warning: <WarningTriangle />,
  danger: <XmarkCircle />,
};

export type BadgeProps = {
  /** Figma: `Tone` — status (context layer). */
  tone?: StatusTone;
  /** Figma: `Label`. */
  children: ReactNode;
  /** Figma: `showIcon`. Keep it on: never color alone. */
  showIcon?: boolean;
};

/** Status badge. ≠ Tag (informative) ≠ Chip (interactive). Not interactive. */
export function Badge({ tone = "neutral", children, showIcon = true }: BadgeProps) {
  return (
    <span className={styles.badge} data-tone={tone}>
      {showIcon && (
        <span className={styles.icon} aria-hidden="true">
          {statusIcons[tone]}
        </span>
      )}
      {children}
    </span>
  );
}
