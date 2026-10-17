"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import styles from "./spec.module.css";

type Part = [string, number, 0 | 1, string, string];

/**
 * Sección 1 de la spec: el componente vivo con los marcadores de Figma (Spec/Marker) encima.
 * Los marcadores se guardan como fracción del ancho, así que siguen al render real; las cotas
 * de alto y ancho se miden del DOM y se comparan con el ejemplo de Figma.
 */
export function Anatomy({
  children,
  parts,
  scale = 1,
}: {
  children: ReactNode;
  parts: Part[];
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number; room: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const measure = () => {
      const cs = getComputedStyle(stage);
      const room =
        stage.clientWidth - Number.parseFloat(cs.paddingLeft) - Number.parseFloat(cs.paddingRight);
      setBox({ w: el.offsetWidth, h: el.offsetHeight, room });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // Escala visual como en Figma, sin pasar del ancho disponible del escenario (en 390 puede bajar de 1).
  const s = box ? Math.min(scale, box.room / Math.max(box.w, 1)) : 1;
  const w = box ? box.w * s : 0;
  const h = box ? box.h * s : 0;

  return (
    <div className={styles.anatomy}>
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.canvas} style={box ? { width: w, height: h } : undefined}>
          <div
            ref={ref}
            className={styles.specimen}
            style={{ transform: `scale(${s})` }}
            aria-hidden="true"
            inert
          >
            {children}
          </div>
          {box &&
            parts.map(([n, x, row]) => (
              <span
                key={`a${n}`}
                className={styles.pin}
                data-row={row}
                style={{ left: `${x * 100}%` }}
                aria-hidden="true"
              >
                <span className={styles.marker} data-kind="anatomy">
                  {n}
                </span>
              </span>
            ))}
          {box && (
            <>
              <span className={styles.dimV} aria-hidden="true">
                <span className={styles.marker} data-kind="measure">
                  1
                </span>
              </span>
              <span className={styles.dimH} aria-hidden="true">
                <span className={styles.marker} data-kind="measure">
                  2
                </span>
              </span>
            </>
          )}
        </div>
      </div>
      <ol className={styles.legend}>
        {parts.map(([n, , , name, desc]) => (
          <li key={n}>
            <span className={styles.marker} data-kind="anatomy" aria-hidden="true">
              {n}
            </span>
            <span>
              <strong className={styles.partName}>{name}</strong>
              <span className={styles.partDesc}>{desc}</span>
            </span>
          </li>
        ))}
        {box && (
          <>
            <li>
              <span className={styles.marker} data-kind="measure" aria-hidden="true">
                1
              </span>
              <span>
                <strong className={styles.partName}>Alto del ejemplo</strong>
                <span className={styles.partDesc}>
                  {Math.round(box.h)} px, medido en el navegador
                </span>
              </span>
            </li>
            <li>
              <span className={styles.marker} data-kind="measure" aria-hidden="true">
                2
              </span>
              <span>
                <strong className={styles.partName}>Ancho del ejemplo</strong>
                <span className={styles.partDesc}>
                  {Math.round(box.w)} px (según contenido), medido en el navegador
                </span>
              </span>
            </li>
          </>
        )}
      </ol>
    </div>
  );
}
