"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { A4_RANGE, DEFAULT_A4, TUNINGS, type Tuning, stringsOf } from "./pitch";

// Shared by the tuner and the chord finder on the same origin; per device, never required.
const KEY = "lab-guitar-settings";

type Stored = { tuning: string; a4: number };

function read(): Stored | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Stored>;
    const tuning = TUNINGS.some((t) => t.id === v.tuning) ? (v.tuning as string) : TUNINGS[0].id;
    const a4 =
      typeof v.a4 === "number" && v.a4 >= A4_RANGE[0] && v.a4 <= A4_RANGE[1] ? v.a4 : DEFAULT_A4;
    return { tuning, a4 };
  } catch {
    return null;
  }
}

function write(v: Stored) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    // Private mode or blocked storage: the setting lasts for this visit only.
  }
}

/** Tuning and A4 reference, remembered on this device. Starts at the defaults until read. */
export function useGuitarSettings() {
  const [stored, setStored] = useState<Stored>({ tuning: TUNINGS[0].id, a4: DEFAULT_A4 });

  useEffect(() => {
    const saved = read();
    // Storage only exists in the browser, so the saved value arrives after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setStored(saved);
  }, []);

  const update = useCallback((next: Partial<Stored>) => {
    setStored((prev) => {
      const v = { ...prev, ...next };
      write(v);
      return v;
    });
  }, []);

  const tuning: Tuning = TUNINGS.find((t) => t.id === stored.tuning) ?? TUNINGS[0];
  const strings = useMemo(() => stringsOf(tuning, stored.a4), [tuning, stored.a4]);

  return {
    tuning,
    a4: stored.a4,
    strings,
    setTuning: (id: string) => update({ tuning: id }),
    setA4: (a4: number) => update({ a4: Math.max(A4_RANGE[0], Math.min(A4_RANGE[1], a4)) }),
  };
}
