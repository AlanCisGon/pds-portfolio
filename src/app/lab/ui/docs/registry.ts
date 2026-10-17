import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { actions } from "./actions";
import { content } from "./content";
import { data, navigation } from "./data";
import { site, utility } from "./site";
import type { ComponentDoc, ComponentGroup } from "./types";

export const DOCS: ComponentDoc[] = [
  ...actions,
  ...content,
  ...data,
  ...navigation,
  ...site,
  ...utility,
];

export const GROUP_ORDER: ComponentGroup[] = [
  "actions",
  "content",
  "data",
  "navigation",
  "site",
  "utility",
];

export function getDoc(slug: string) {
  return DOCS.find((d) => d.slug === slug);
}

const UI_DIR = path.join(process.cwd(), "src", "ui");

export type SourceFacts = {
  /** Tokens de tokens.css que usa su CSS, leídos del código (no a mano). */
  tokens: string[];
  /** Lleva "use client" en algún archivo. */
  client: boolean;
  /** Archivos del componente. */
  files: string[];
  /** Tokens que usan los componentes del SDS que este importa (p. ej. Link dentro de FeaturedCase). */
  childTokens: Record<string, string[]>;
};

/** Lee el código del componente en build: así la doc no se desfasa del CSS. */
export async function getSourceFacts(name: string, depth = 1): Promise<SourceFacts> {
  const dir = path.join(UI_DIR, name);
  const files = (await readdir(dir)).filter((f) => /\.(tsx|css)$/.test(f));
  const tokens = new Set<string>();
  const children = new Set<string>();
  let client = false;
  for (const f of files) {
    const src = await readFile(path.join(dir, f), "utf8");
    if (f.endsWith(".css")) {
      for (const m of src.matchAll(/var\((--[a-z0-9-]+)/g)) tokens.add(m[1]);
    } else {
      if (/^\s*["']use client["']/.test(src)) client = true;
      for (const m of src.matchAll(/from "\.\.\/([A-Za-z]+)"/g)) children.add(m[1]);
    }
  }
  const childTokens: Record<string, string[]> = {};
  if (depth > 0) {
    for (const child of children)
      childTokens[child] = (await getSourceFacts(child, depth - 1)).tokens;
  }
  return {
    tokens: [...tokens].sort(),
    client,
    files: files.map((f) => `src/ui/${name}/${f}`),
    childTokens,
  };
}
