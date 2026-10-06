import { Chivo_Mono, Host_Grotesk } from "next/font/google";
import localFont from "next/font/local";

// Brand typefaces (ADR 0005, docs/design-system.md → Tipografía). Each one has a role:
// - Host Grotesk · interface (System/*: headings, body, labels) → --font-host-grotesk → --font-sans
// - Chivo Mono · measure (Measure/*: metadata, code, figures) → --font-chivo-mono → --font-mono
// - Amstelvar v1.000 · voice (Voice/*: display, title, quote, card) → --font-amstelvar → --font-serif
// Amstelvar is not on Google Fonts: it ships from public/fonts as a Latin subset with only the
// wght (300–700) and opsz (8–144) axes (75 KB roman, 78 KB italic), so the lab artifacts can use
// the same files. Licences: public/fonts/OFL-*.txt.
export const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-host-grotesk",
});

export const chivoMono = Chivo_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-chivo-mono",
});

export const amstelvar = localFont({
  src: [{ path: "../../public/fonts/amstelvar-roman.woff2", weight: "300 700", style: "normal" }],
  display: "swap",
  variable: "--font-amstelvar",
});

// Italic is only for Voice/Quote (MDX blockquotes): same family, not preloaded,
// so it never competes with the headline font on first paint.
export const amstelvarItalic = localFont({
  src: [{ path: "../../public/fonts/amstelvar-italic.woff2", weight: "300 700", style: "italic" }],
  display: "swap",
  preload: false,
  variable: "--font-amstelvar-italic",
});
