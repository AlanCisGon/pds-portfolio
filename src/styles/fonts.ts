import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Newsreader } from "next/font/google";

// Brand typefaces (docs/design-system.md → Tipografía), loaded as local files from the
// official `geist` package: the build does not fetch them from Google Fonts, which avoids
// the stale-cache failure seen in the T0 deploy. They expose --font-geist-sans and
// --font-geist-mono, consumed by --font-sans / --font-mono in tokens.css.
// Newsreader is the voice (Voice/* text styles: display, title, quote) and comes from
// next/font/google, exposing --font-newsreader for --font-serif.
export const geistSans = GeistSans;
export const geistMono = GeistMono;

export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
  variable: "--font-newsreader",
});

// Italic is only for Voice/Quote (MDX blockquotes): same family name, not preloaded,
// so it never competes with the headline font on first paint.
export const newsreaderItalic = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
  preload: false,
  variable: "--font-newsreader-italic",
});
