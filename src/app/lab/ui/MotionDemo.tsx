"use client";

import { Check, Copy } from "iconoir-react";
import { type PointerEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./MotionDemo.module.css";

// Lab-only prototypes of Félix's "07 Motion" page. Nothing here is part of src/ui yet:
// Clara reviews coherence and tokens before any of it moves into a component.

const sections = ["Inicio", "Trabajo", "Sobre mí"];

/** A · NavItem: the active indicator slides to its new destination with a short stretch. */
function NavIndicator() {
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [box, setBox] = useState({ left: 0, width: 0 });
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const el = refs.current[active];
    if (el) setBox({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  return (
    <div className={styles.nav}>
      {sections.map((s, i) => (
        <button
          key={s}
          type="button"
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={styles.navItem}
          aria-pressed={i === active}
          onClick={() => {
            if (i === active) return;
            setActive(i);
            setPulse((p) => p + 1);
          }}
        >
          {s}
        </button>
      ))}
      <span
        className={styles.track}
        style={{ transform: `translateX(${box.left}px)`, width: box.width }}
        aria-hidden="true"
      >
        <span key={pulse} className={pulse ? styles.indicatorStretch : styles.indicator} />
      </span>
    </div>
  );
}

/** B · Copy: Copy leaves, Check arrives with a small settle, stays 2 s and returns on its own. */
function CopyButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      className={styles.copy}
      data-copied={copied || undefined}
      onClick={() => setCopied(true)}
      aria-label={copied ? "Code copied" : "Copy code"}
    >
      <span className={styles.iconSlot} aria-hidden="true">
        <span className={styles.iconCopy}>
          <Copy />
        </span>
        <span className={styles.iconCheck}>
          <Check />
        </span>
      </span>
      <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

/** D · FeaturedCase on touch: sinks while pressed, lifts on release. Navigation is never delayed. */
function FeaturedPress() {
  const [release, setRelease] = useState(0);
  return (
    <button
      type="button"
      className={styles.feature}
      onPointerUp={() => setRelease((r) => r + 1)}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") setRelease((r) => r + 1);
      }}
    >
      <span key={release} className={release ? styles.featureLift : styles.featureInner}>
        <span className={styles.featureMeta}>E-commerce · Coppel · 2024</span>
        <span className={styles.cardTitle}>Project Helix</span>
        <span className={styles.cardBody}>Toca la tarjeta: se hunde y, al soltar, sube.</span>
      </span>
    </button>
  );
}

/** C · Skeleton → content, with a spinner that only shows after 400 ms. Postponed until there is a backend. */
function SkeletonDemo() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div className={styles.stack}>
      <button type="button" className={styles.trigger} onClick={() => setLoading(true)}>
        Recargar
      </button>
      <div className={styles.card} aria-busy={loading}>
        {loading ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            <span className={styles.skeletonTitle} />
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLineShort} />
          </>
        ) : (
          <div className={styles.content}>
            <p className={styles.cardTitle}>Project Helix</p>
            <p className={styles.cardBody}>Carrito y checkout de Coppel.</p>
          </div>
        )}
      </div>
    </div>
  );
}

type Variant = "a" | "b" | "c";
const variants: { id: Variant; label: string }[] = [
  { id: "a", label: "A · Tono" },
  { id: "b", label: "B · Tono y escala" },
  { id: "c", label: "C · Desenfoque" },
];

/** E · Card al frente: the protagonist rises and the surroundings recede with it (Precisión). */
function CardFront() {
  const [variant, setVariant] = useState<Variant>("a");
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.stack}>
      <fieldset className={styles.segmented} aria-label="Variante del entorno">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={variant === v.id}
            className={styles.segment}
            onClick={() => setVariant(v.id)}
          >
            {v.label}
          </button>
        ))}
      </fieldset>
      <div className={styles.stage} data-variant={variant} data-open={open || undefined}>
        <div className={styles.surroundings} aria-hidden="true">
          <span className={styles.ghostCard} />
          <span className={styles.ghostCard} />
          <span className={styles.ghostLine} />
        </div>
        <button
          type="button"
          className={styles.hero}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={styles.featureMeta}>Toca para traerla al frente</span>
          <span className={styles.cardTitle}>Project Helix</span>
          <span className={styles.cardBody}>Carrito y checkout de Coppel.</span>
        </button>
      </div>
    </div>
  );
}

/** F · Depth planes: four 2D layers on the Z axis follow touch or cursor, up to 4°. */
function DepthPlanes() {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    el.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const reset = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };
  return (
    <div
      ref={ref}
      className={styles.scene}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerUp={reset}
      aria-hidden="true"
    >
      <span className={styles.p0}>P0 · Fondo</span>
      <span className={styles.p1}>P1 · Contenido</span>
      <span className={styles.p2}>P2 · Interactivo</span>
      <span className={styles.p3}>P3 · Foco</span>
    </div>
  );
}

export function MotionDemo() {
  const [reduced, setReduced] = useState(false);

  return (
    <div className={styles.root} data-reduced={reduced || undefined}>
      <label className={styles.toggle}>
        <input type="checkbox" checked={reduced} onChange={(e) => setReduced(e.target.checked)} />
        Ver versión con movimiento reducido
      </label>
      <div className={styles.grid}>
        <div className={styles.demo}>
          <p className={styles.label}>A · NavItem · Material (lo toca la mano)</p>
          <NavIndicator />
          <p className={styles.note}>
            Resorte k 260 · d 24 (propuesto) · estiramiento al arrancar. Reducida: crossfade.
          </p>
        </div>
        <div className={styles.demo}>
          <p className={styles.label}>B · CodeBlock copy · expresivo</p>
          <CopyButton />
          <p className={styles.note}>
            Sale con --ease-exit, entra 0.6 → 1.15 → 1 y 15° → 0°. Rebote: excepción aprobada por
            Alan.
          </p>
        </div>
        <div className={styles.demo}>
          <p className={styles.label}>C · Skeleton y spinner · pospuesto: cuando haya backend</p>
          <SkeletonDemo />
          <p className={styles.note}>
            Pulso 1.2 s y giro 800 ms (tokens en espera). Spinner solo si pasa de 400 ms.
          </p>
        </div>
        <div className={styles.demo}>
          <p className={styles.label}>D · FeaturedCase al tocar · Material</p>
          <FeaturedPress />
          <p className={styles.note}>
            Presionado: 0.97. Al soltar: sube 4 px con el resorte Material. La navegación no espera.
            Reducida: opacidad 0.85.
          </p>
        </div>
        <div className={styles.demo}>
          <p className={styles.label}>E · Card al frente · Precisión</p>
          <CardFront />
          <p className={styles.note}>
            --ease-settle en --duration-wide. La card sube a 1.04; el entorno se mueve menos. C es
            una excepción a decidir por Alan. Reducida: solo tono.
          </p>
        </div>
        <div className={styles.demo}>
          <p className={styles.label}>F · Planos de profundidad · CSS 3D</p>
          <DepthPlanes />
          <p className={styles.note}>
            Mueve el dedo o el cursor: 4° como máximo, más cerca es más accionable. Sin giro del
            teléfono por ahora. Reducida: todo en Z = 0.
          </p>
        </div>
      </div>
    </div>
  );
}
