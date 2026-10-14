/** "2024-05-20" → "May 20, 2024" (en-US) or "20 may 2024" (es-MX). Parsed as a local date, never UTC. */
export function formatDate(isoDate: string, locale: "en-US" | "es-MX" = "en-US"): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    year: "numeric",
    month: locale === "en-US" ? "long" : "short",
    day: "numeric",
  });
}

/** Short en-US date for cards: "Sep 3, 2026". */
export function formatShortDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
