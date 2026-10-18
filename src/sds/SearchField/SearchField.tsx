"use client";

import { Search, Xmark } from "iconoir-react";
import { type KeyboardEvent, useId, useRef } from "react";
import { VisuallyHidden } from "../VisuallyHidden";
import styles from "./SearchField.module.css";

export type SearchFieldProps = {
  /** Figma: `Label`. Always the accessible name; hidden unless `showLabel`. */
  label: string;
  /** Figma: `showLabel`. */
  showLabel?: boolean;
  /** Figma: `Placeholder`. Never replaces the label. */
  placeholder?: string;
  /** Figma: `Value`. With text, Figma's `State=Filled` (data-filled). */
  value: string;
  onChange: (value: string) => void;
  /** Figma: `Size` (m 40 / s 32). */
  size?: "m" | "s";
  /** Figma: `State=Disabled`. */
  disabled?: boolean;
  /** Accessible name of the clear button. */
  clearLabel?: string;
  className?: string;
};

/**
 * SearchField · Figma 02a Actions (444:169), spec 445:2095.
 * Filters a list in place; not a form field (no error, no submit). Clear returns focus to the
 * input; Esc also clears. The result count is announced by the page, not by the component.
 */
export function SearchField({
  label,
  showLabel = false,
  placeholder,
  value,
  onChange,
  size = "m",
  disabled = false,
  clearLabel = "Clear search",
  className,
}: SearchFieldProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const clear = () => {
    onChange("");
    input.current?.focus();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && value) {
      e.preventDefault();
      clear();
    }
  };

  return (
    <search
      className={className ? `${styles.search} ${className}` : styles.search}
      data-show-label={showLabel || undefined}
    >
      <label htmlFor={id} className={styles.label}>
        {showLabel ? label : <VisuallyHidden>{label}</VisuallyHidden>}
      </label>
      <div
        className={styles.field}
        data-size={size}
        data-filled={value !== "" || undefined}
        data-disabled={disabled || undefined}
      >
        <span className={styles.icon} aria-hidden="true">
          <Search />
        </span>
        <input
          ref={input}
          id={id}
          type="search"
          className={styles.input}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        {value !== "" && !disabled && (
          <button type="button" className={styles.clear} onClick={clear} aria-label={clearLabel}>
            <span className={styles.clearIcon} aria-hidden="true">
              <Xmark />
            </span>
          </button>
        )}
      </div>
    </search>
  );
}
