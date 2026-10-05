import { slugify as transliterate } from "transliteration";

/** Heading anchor ids: "Metrics & Context" → "metrics-and-context". */
export function slugify(str: string): string {
  return transliterate(str.replace(/&/g, " and "), { lowercase: true, separator: "-" }).replace(
    /-+/g,
    "-",
  );
}
