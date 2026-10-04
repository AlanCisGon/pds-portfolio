"use client";

import { Chip } from "@/ui";
import { useState } from "react";

/** Interactive Chip demo for the catalog (filters + removable tokens). */
export function ChipDemo() {
  const [selected, setSelected] = useState<string[]>(["Finanzas"]);
  const [tokens, setTokens] = useState(["Research", "Service Design", "UX Lead"]);
  const toggle = (v: string) =>
    setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  return (
    <>
      <div className="row">
        {["E-commerce", "Finanzas", "Telecom"].map((v) => (
          <Chip key={v} label={v} selected={selected.includes(v)} onClick={() => toggle(v)} />
        ))}
        <Chip label="Deshabilitado" disabled />
        <Chip label="Small" size="s" selected />
      </div>
      <div className="row">
        {tokens.map((t) => (
          <Chip key={t} label={t} onRemove={() => setTokens((x) => x.filter((y) => y !== t))} />
        ))}
      </div>
    </>
  );
}
