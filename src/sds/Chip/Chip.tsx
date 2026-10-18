import { Xmark } from "iconoir-react";
import type { ReactNode } from "react";
import styles from "./Chip.module.css";

type BaseProps = {
  /** Figma: `Label`. */
  label: string;
  /** Figma: `Size`. */
  size?: "m" | "s";
  /** Figma: `LeadingIcon` (omit to hide). */
  leadingIcon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export type ChipProps = BaseProps &
  (
    | {
        /** Filter / toggle: the whole chip is a button with aria-pressed. */
        selected?: boolean;
        onClick?: () => void;
        onRemove?: undefined;
      }
    | {
        /** Removable token: the chip is not a toggle; the X is the only button. */
        onRemove: () => void;
        selected?: undefined;
        onClick?: undefined;
      }
  );

/** Interactive chip. For non-interactive information use Tag. */
export function Chip(props: ChipProps) {
  const { label, size = "m", leadingIcon, disabled, className } = props;
  const cls = className ? `${styles.chip} ${className}` : styles.chip;
  const lead = leadingIcon && (
    <span className={styles.icon} aria-hidden="true">
      {leadingIcon}
    </span>
  );

  if (props.onRemove) {
    return (
      <span
        className={cls}
        data-size={size}
        data-removable=""
        aria-disabled={disabled || undefined}
      >
        {lead}
        <span>{label}</span>
        <button
          type="button"
          className={styles.remove}
          onClick={props.onRemove}
          disabled={disabled}
          aria-label={`Remove ${label}`}
        >
          <span className={styles.icon} aria-hidden="true">
            <Xmark />
          </span>
        </button>
      </span>
    );
  }

  const selected = props.selected ?? false;
  return (
    <button
      type="button"
      className={cls}
      data-size={size}
      data-selected={selected || undefined}
      aria-pressed={selected}
      onClick={props.onClick}
      disabled={disabled}
    >
      {lead}
      <span>{label}</span>
    </button>
  );
}
