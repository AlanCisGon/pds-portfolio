"use client";

import { Card, Chip, SearchField } from "@/sds";
import { useMemo, useState } from "react";
import { fold } from "./docs/fold";
import styles from "./page.module.css";

export type IndexItem = {
  slug: string;
  name: string;
  level: string;
  summary: string;
  unused: boolean;
  /** Patrón: combina otros componentes del SDS (se lee de sus imports, no a mano). */
  pattern: boolean;
  /** Código y título del grupo de Figma ("02a · Actions"). */
  group: string;
  /** Texto donde se busca: nombre, resumen, cuándo usarlo y cuándo no. */
  haystack: string;
};

const LEVELS = [
  { value: "", label: "Todos" },
  { value: "átomo", label: "Átomo" },
  { value: "molécula", label: "Molécula" },
  { value: "organismo", label: "Organismo" },
  { value: "utilidad", label: "Utilidad" },
  { value: "patrón", label: "Patrón" },
];

/** Índice de /lab/ui: filtro por nivel (Chip) y búsqueda por nombre o caso de uso (SearchField). */
export function IndexFilters({ items, groups }: { items: IndexItem[]; groups: string[] }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");

  const shown = useMemo(() => {
    const terms = fold(query).split(/\s+/).filter(Boolean);
    return items.filter(
      (i) =>
        (!level || (level === "patrón" ? i.pattern : i.level === level)) &&
        terms.every((t) => i.haystack.includes(t)),
    );
  }, [items, query, level]);

  const count = shown.length;

  return (
    <div className={styles.index}>
      <div className={styles.filters}>
        <SearchField
          className={styles.search}
          label="Buscar componentes"
          placeholder="Buscar por nombre o uso"
          value={query}
          onChange={setQuery}
        />
        <fieldset className={`${styles.row} ${styles.fieldset}`}>
          <legend className={styles.srOnly}>Nivel</legend>
          {LEVELS.map((l) => (
            <Chip
              key={l.label}
              label={l.label}
              selected={level === l.value}
              onClick={() => setLevel(l.value)}
            />
          ))}
        </fieldset>
      </div>

      <p className={styles.body} aria-live="polite">
        {count === items.length
          ? `${count} componentes`
          : `${count} de ${items.length} componentes`}
      </p>

      {count === 0 && (
        <p className={styles.body}>
          Ningún componente coincide. Prueba con otro nombre o un uso, como “filtrar” o “estatus”.
        </p>
      )}

      {groups.map((g) => {
        const docs = shown.filter((d) => d.group === g);
        if (docs.length === 0) return null;
        return (
          <section className={styles.section} key={g} aria-label={g}>
            <h2 className={styles.h2}>{g}</h2>
            <ul className={styles.cards}>
              {docs.map((d) => (
                <li key={d.slug}>
                  <Card
                    href={`/lab/ui/${d.slug}`}
                    eyebrow={d.unused ? `${d.level} · sin uso público` : d.level}
                    title={d.name}
                  >
                    {d.summary}
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
