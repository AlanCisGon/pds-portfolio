import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

// Brand typefaces (docs/design-system.md → Tipografía), loaded as local files from the
// official `geist` package: the build does not fetch them from Google Fonts, which avoids
// the stale-cache failure seen in the T0 deploy. They expose --font-geist-sans and
// --font-geist-mono, consumed by --font-sans / --font-mono in tokens.css.
// Newsreader (voice) joins via next/font/google when a component first needs it.
export const geistSans = GeistSans;
export const geistMono = GeistMono;
