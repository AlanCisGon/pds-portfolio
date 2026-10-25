import type { ReactNode } from "react";
import type { StatusTone } from "../Badge";
import styles from "./Gauge.module.css";

export type GaugeProps = {
  /** Current reading, clamped to min/max. null = no reading: the needle rests at the center. */
  value: number | null;
  min?: number;
  max?: number;
  /** Figma: `Zone`. Half-width of the target band around the center (0 = no band). */
  zone?: number;
  /** Figma: `Tone` — status (context layer) of the needle and the band. Never color alone. */
  tone?: Extract<StatusTone, "neutral" | "success" | "danger">;
  /** Accessible name of the meter. */
  label: string;
  /** Reading as words (aria-valuetext), e.g. "12 cents grave". */
  valueText?: string;
  /** Readout inside the arc: the figure the needle points at. */
  children?: ReactNode;
};

// Geometry in SVG units (viewBox 300 × 180): the arc spans ±60° around 12 o'clock.
const CX = 150;
const CY = 160;
const R = 120;
const SPAN = 60;

function point(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: CX + r * Math.sin(a), y: CY - r * Math.cos(a) };
}

function arc(r: number, from: number, to: number) {
  const a = point(r, from);
  const b = point(r, to);
  return `M${a.x.toFixed(2)} ${a.y.toFixed(2)} A${r} ${r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

/** Semicircular meter centered on a target (e.g. cents from a note). Display only. */
export function Gauge({
  value,
  min = -50,
  max = 50,
  zone = 0,
  tone = "neutral",
  label,
  valueText,
  children,
}: GaugeProps) {
  const half = Math.max(Math.abs(min), Math.abs(max));
  const toDeg = (v: number) => (Math.max(min, Math.min(max, v)) / half) * SPAN;
  const step = (max - min) / 10;
  const ticks = Array.from({ length: 11 }, (_, i) => min + i * step);
  const shown = value ?? 0;
  const needleFrom = point(R - 40, 0);
  const needleTo = point(R + 8, 0);

  return (
    <div
      className={styles.gauge}
      data-tone={tone}
      data-idle={value === null || undefined}
      role="meter"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value === null ? undefined : Math.round(value)}
      aria-valuetext={valueText}
    >
      <svg viewBox="0 0 300 180" className={styles.dial} aria-hidden="true">
        <path className={styles.track} d={arc(R, -SPAN, SPAN)} strokeWidth={2} />
        {zone > 0 && (
          <path
            className={styles.zone}
            d={arc(R + 6, -toDeg(zone), toDeg(zone))}
            strokeWidth={12}
          />
        )}
        {ticks.map((t) => {
          const major = t === min || t === max || t === 0;
          const a = point(R + 2, toDeg(t));
          const b = point(R + (major ? 16 : 10), toDeg(t));
          const l = point(R + 30, toDeg(t));
          return (
            <g key={t}>
              <line
                className={styles.tick}
                data-major={major || undefined}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={major ? 2.5 : 1.5}
              />
              {major && (
                <text className={styles.label} x={l.x} y={l.y + 4} textAnchor="middle">
                  {t > 0 ? `+${t}` : t < 0 ? `−${Math.abs(t)}` : "0"}
                </text>
              )}
            </g>
          );
        })}
        <line
          className={styles.needle}
          x1={needleFrom.x}
          y1={needleFrom.y}
          x2={needleTo.x}
          y2={needleTo.y}
          strokeWidth={5}
          transform={`rotate(${toDeg(shown).toFixed(2)} ${CX} ${CY})`}
        />
      </svg>
      {children && <div className={styles.readout}>{children}</div>}
    </div>
  );
}
