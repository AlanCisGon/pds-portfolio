import { Geist } from "next/font/google";

// Brand typefaces (docs/design-system.md → Tipografía). Exposed as CSS variables
// consumed by --font-sans / --font-serif / --font-mono in tokens.css.
// Newsreader and Geist Mono join when a component first needs them (I3).
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
